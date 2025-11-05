import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { APP_GOODBYE, APP_HELLO, DA_HELLO, FDC3_APP_EVENT } from '../../message-types';
import { DemoFDC3ServerFactory, DemoFDC3ServerInstance } from './DemoServerContext';
import { FDC3_2_1_JSONDirectory } from './FDC3_2_1_JSONDirectory';
import { ChannelState, ChannelType, DirectoryApp, State, type FDC3ServerInstance } from '@finos/fdc3-web-impl';
import { link, UI, UI_URLS } from './util';
import { BrowserTypes } from '@finos/fdc3-schema';
import { WebConnectionProtocol3Handshake } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

type WebConnectionProtocol2LoadURL = BrowserTypes.WebConnectionProtocol2LoadURL;

function createAppStartButton(app: DirectoryApp, sc: FDC3ServerInstance): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');
  div.classList.add('app');
  const h3 = document.createElement('h3');
  h3.textContent = app.title;
  div.appendChild(h3);
  const button = document.createElement('button');
  button.textContent = 'Start';
  button.onclick = () => sc.open(app.appId);
  div.appendChild(button);
  const p = document.createElement('p');
  p.textContent = app.description ?? '';
  div.appendChild(p);
  return div;
}

enum Approach {
  IFRAME,
  PARENT_POST_MESSAGE,
}

function getApproach(): Approach {
  const cb = document.getElementById('approach') as HTMLInputElement;
  const val = cb.value;
  const out: Approach = Approach[val as keyof typeof Approach]; //Works with --noImplicitAny
  return out;
}

function getUIKey(): UI {
  const cb = document.getElementById('ui') as HTMLInputElement;
  const val = cb.value;
  const out: UI = UI[val as keyof typeof UI]; //Works with --noImplicitAny
  return out;
}

window.addEventListener('load', () => {
  const desktopAgentUUID = uuid();

  const socket = io();

  socket.on('connect', async () => {
    socket.emit(DA_HELLO, desktopAgentUUID);

    const directory = new FDC3_2_1_JSONDirectory();
    await directory.load('/static/da/appd.json');
    await directory.load('/static/da/local-conformance.v2.json');

    const channelDetails: ChannelState[] = [
      {
        id: 'fdc3.channel.1',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 1',
          color: 'red',
          glyph: '1',
        },
      },
      {
        id: 'fdc3.channel.2',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 2',
          color: 'orange',
          glyph: '2',
        },
      },
      {
        id: 'fdc3.channel.3',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 3',
          color: 'yellow',
          glyph: '3',
        },
      },
      {
        id: 'fdc3.channel.4',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 4',
          color: 'green',
          glyph: '4',
        },
      },
      {
        id: 'fdc3.channel.5',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 5',
          color: 'cyan',
          glyph: '5',
        },
      },
      {
        id: 'fdc3.channel.6',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 6',
          color: 'blue',
          glyph: '6',
        },
      },
      {
        id: 'fdc3.channel.7',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 7',
          color: 'magenta',
          glyph: '7',
        },
      },
      {
        id: 'fdc3.channel.8',
        type: ChannelType.user,
        context: [],
        displayMetadata: {
          name: 'Channel 8',
          color: 'purple',
          glyph: '8',
        },
      },
    ];

    // Create the factory and server instance
    const factory = new DemoFDC3ServerFactory(socket, directory, channelDetails, true, 20000, 10000);
    const fdc3ServerInstance = factory.createInstance() as DemoFDC3ServerInstance;

    socket.on(FDC3_APP_EVENT, (msg, from) => {
      fdc3ServerInstance.receive(msg, from);
    });

    socket.on(APP_GOODBYE, (id: string) => {
      fdc3ServerInstance.setAppState(id, State.Terminated);
    });

    // let's create buttons for some apps
    const appList = document.getElementById('app-list') as HTMLOListElement;
    directory.retrieveAllApps().forEach(app => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mani = app?.hostManifests?.demo as any;
      const show = mani?.visible ?? true;
      if (show) {
        appList.appendChild(createAppStartButton(app, fdc3ServerInstance));
      }
    });

    // set up Desktop Agent Proxy interface here
    // disabling rule for checks on origin of messages - this could be improved by validating for origins we know we are working with
    // nosemgrep: javascript.browser.security.insufficient-postmessage-origin-validation.insufficient-postmessage-origin-validation
    window.addEventListener('message', async e => {
      const event = e as MessageEvent;
      const data = event.data;
      const source = event.source as Window;
      const origin = event.origin;

      console.log('Received: ' + JSON.stringify(event.data));
      if (data.type == 'WCP1Hello') {
        const instance = await fdc3ServerInstance.getInstanceForWindow(source);
        if (instance) {
          if (getApproach() == Approach.IFRAME) {
            const message: WebConnectionProtocol2LoadURL = {
              type: 'WCP2LoadUrl',
              meta: {
                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                timestamp: new Date(),
              },
              payload: {
                iframeUrl:
                  window.location.origin +
                  `/static/da/embed.html?&desktopAgentId=${desktopAgentUUID}&instanceId=${instance.instanceId}&UI=${getUIKey()}`,
              },
            };

            source.postMessage(message, origin);
          } else {
            const channel = new MessageChannel();
            link(socket, channel, instance.instanceId);
            socket.emit(APP_HELLO, desktopAgentUUID, instance.instanceId);
            const ui = UI_URLS[getUIKey()];

            // send the other end of the channel to the app
            const message: WebConnectionProtocol3Handshake = {
              type: 'WCP3Handshake',
              meta: {
                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                timestamp: new Date(),
              },
              payload: {
                fdc3Version: '2.2',
                ...ui,
              },
            };
            source.postMessage(message, origin, [channel.port1]);
          }
        } else {
          let sourceName;
          try {
            sourceName = source.name;
          } catch (e: unknown) {
            sourceName = `{a cross-origin window: ${(e as Error).message ?? e}}`;
          }
          console.error(`Couldn't locate an instance for window: ${sourceName}`);
        }
      }
    });
  });
});
