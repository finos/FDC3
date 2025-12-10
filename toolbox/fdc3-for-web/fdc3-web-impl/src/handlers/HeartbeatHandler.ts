import { MessageHandler } from './MessageHandler';
import { InstanceID, State } from '../AppRegistration';
import {
  AppRequestMessage,
  HeartbeatEvent,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { FullAppIdentifier } from './support';
import { FDC3ServerInstance, HeartbeatActivityEvent } from '../FDC3ServerInstance';
import { FDC3ServerInstanceEvent } from '../FDC3ServerInstanceEvents';

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
  private readonly fdc3Instances: FDC3ServerInstance[] = [];
  private readonly lastHeartbeats: Map<InstanceID, number> = new Map();
  private readonly timerFunction: NodeJS.Timeout;

  constructor(pingInterval: number = 1000, disconnectedAfter: number = 5000, deadAfter: number = 20000) {
    this.timerFunction = setInterval(() => {
      this.fdc3Instances.forEach(async sc => {
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
                sc.heartbeatActivity(app.instanceId, HeartbeatActivityEvent.ConnectedResponding);
              } else if (timeSinceLastHeartbeat > disconnectedAfter && currentState == State.Connected) {
                sc.heartbeatActivity(app.instanceId, HeartbeatActivityEvent.NotRespondingAfterDisconnectTime);
              } else if (timeSinceLastHeartbeat > deadAfter && currentState == State.NotResponding) {
                sc.heartbeatActivity(app.instanceId, HeartbeatActivityEvent.NotRespondingAfterDeadTime);
              } else {
                // no action
              }
            } else {
              // start the clock
              this.lastHeartbeats.set(app.instanceId, now);
              sc.heartbeatActivity(app.instanceId, HeartbeatActivityEvent.ConnectedResponding);
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
          state: convertToText(
            this.fdc3Instances.map(sc => sc.getInstanceDetails(e[0])).reduce((a, b) => a || b, undefined)?.state
          ),
        } as HeartbeatDetails;
      })
      .filter(e => e.state != 'Terminated');
  }

  shutdown(): void {
    clearInterval(this.timerFunction);
  }

  async accept(
    msg: AppRequestMessage | WebConnectionProtocol6Goodbye,
    sc: FDC3ServerInstance,
    from: InstanceID
  ): Promise<void> {
    if (!this.fdc3Instances.includes(sc)) {
      this.fdc3Instances.push(sc);
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

  async sendHeartbeat(sc: FDC3ServerInstance, app: FullAppIdentifier): Promise<void> {
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

  async handleEvent(e: FDC3ServerInstanceEvent, i: FDC3ServerInstance): Promise<void> {
    if (e.type === 'shutdown') {
      if (this.fdc3Instances.includes(i)) {
        this.fdc3Instances.splice(this.fdc3Instances.indexOf(i), 1);
      }
    }
  }
}
