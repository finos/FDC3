import { MessageHandler } from '../BasicFDC3Server';
import { AppRegistration, InstanceID, ServerContext, State } from '../ServerContext';
import {
  AppRequestMessage,
  HeartbeatEvent,
  WebConnectionProtocol6Goodbye,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { FullAppIdentifier } from './support';

type HeartbeatDetails = {
  instanceId: string;
  time: number;
  state: string;
};

function convertToText(s?: State): string {
  if (s == undefined) {
    return 'Unknown';
  } else {
    switch (s) {
      case State.Pending:
        return 'Pending';
      case State.Connected:
        return 'Connected';
      case State.NotResponding:
        return 'Not Responding';
      case State.Terminated:
        return 'Terminated';
    }
  }
}

/*
 * Handles heartbeat pings and responses
 */
export class HeartbeatHandler implements MessageHandler {
  private readonly contexts: ServerContext<AppRegistration>[] = [];
  private readonly lastHeartbeats: Map<InstanceID, number> = new Map();
  private readonly timerFunction: NodeJS.Timeout;

  constructor(pingInterval: number = 1000, disconnectedAfter: number = 5000, deadAfter: number = 20000) {
    this.timerFunction = setInterval(() => {
      this.contexts.forEach(async sc => {
        const apps = await sc.getAllApps();
        apps
          .filter(app => app.state == State.Connected || app.state == State.NotResponding)
          .forEach(app => {
            const now = new Date().getTime();
            this.sendHeartbeat(sc, app);

            // check when the last heartbeat happened
            const lastHeartbeat = this.lastHeartbeats.get(app.instanceId);
            const currentState = app.state;

            if (lastHeartbeat != undefined) {
              const timeSinceLastHeartbeat = now - lastHeartbeat;

              if (timeSinceLastHeartbeat < disconnectedAfter && currentState != State.Connected) {
                console.error(
                  `Heartbeat from ${app.instanceId} for ${timeSinceLastHeartbeat}ms. App is considered connected.`
                );
                sc.setAppState(app.instanceId, State.Connected);
              } else if (timeSinceLastHeartbeat > disconnectedAfter && currentState == State.Connected) {
                console.error(
                  `No heartbeat from ${app.instanceId} for ${timeSinceLastHeartbeat}ms. App is considered not responding.`
                );
                sc.setAppState(app.instanceId, State.NotResponding);
              } else if (timeSinceLastHeartbeat > deadAfter && currentState == State.NotResponding) {
                console.error(
                  `No heartbeat from ${app.instanceId} for ${timeSinceLastHeartbeat}ms. App is considered terminated.`
                );
                sc.setAppState(app.instanceId, State.Terminated);
              } else {
                // no action
              }
            } else {
              // start the clock
              this.lastHeartbeats.set(app.instanceId, now);
            }
          });
      });
    }, pingInterval);
  }

  heartbeatTimes(): HeartbeatDetails[] {
    const now = new Date().getTime();
    return Array.from(this.lastHeartbeats)
      .map(e => {
        return {
          instanceId: e[0],
          time: now - e[1],
          state: convertToText(this.contexts.map(sc => sc.getInstanceDetails(e[0])).reduce((a, b) => a || b)?.state),
        } as HeartbeatDetails;
      })
      .filter(e => e.state != 'Terminated');
  }

  shutdown(): void {
    clearInterval(this.timerFunction);
  }

  accept(
    msg: AppRequestMessage | WebConnectionProtocol6Goodbye,
    sc: ServerContext<AppRegistration>,
    from: InstanceID
  ): void {
    if (!this.contexts.includes(sc)) {
      this.contexts.push(sc);
    }

    if (msg.type == 'heartbeatAcknowledgementRequest') {
      const app = sc.getInstanceDetails(from);
      if (app) {
        this.lastHeartbeats.set(app.instanceId, new Date().getTime());
      }
    }

    if (msg.type == 'WCP6Goodbye') {
      const app = sc.getInstanceDetails(from);
      if (app) {
        sc.setAppState(from, State.Terminated);
      }
    }
  }

  async sendHeartbeat(sc: ServerContext<AppRegistration>, app: FullAppIdentifier): Promise<void> {
    const event: HeartbeatEvent = {
      type: 'heartbeatEvent',
      meta: {
        timestamp: new Date(),
        eventUuid: sc.createUUID(),
      },
      payload: {},
    };
    sc.post(event, app.instanceId);
  }
}
