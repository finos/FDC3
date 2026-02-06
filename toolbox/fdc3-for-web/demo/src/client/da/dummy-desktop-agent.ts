import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { APP_GOODBYE, DA_HELLO, FDC3_APP_EVENT } from '../../message-types.js';
import { DemoServerContext } from './DemoServerContext.js';
import { FDC3_2_1_JSONDirectory } from './FDC3_2_1_JSONDirectory.js';
import { AppRegistration, DefaultFDC3Server, DirectoryApp, ServerContext } from '@finos/fdc3-web-impl';
import { ChannelState, ChannelType } from '@finos/fdc3-web-impl/src/handlers/BroadcastHandler.js';
import { UI, UI_URLS } from './util.js';
import { BrowserTypes } from '@finos/fdc3-schema';
import { WebConnectionProtocol3Handshake } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

type WebConnectionProtocol2LoadURL = BrowserTypes.WebConnectionProtocol2LoadURL;

function createAppStartButton(app: DirectoryApp, sc: ServerContext<AppRegistration>): HTMLDivElement {
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
    const sc = new DemoServerContext(socket, directory);

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
    const fdc3Server = new DefaultFDC3Server(sc, directory, channelDetails, true, 20000, 10017);

    socket.on(FDC3_APP_EVENT, (msg, from) => {
      fdc3Server.receive(msg, from);
    });

    socket.on(APP_GOODBYE, (id: string) => {
      fdc3Server.cleanup(id);
    });

    // let's create buttons for some apps
    const appList = document.getElementById('app-list') as HTMLOListElement;
    directory.retrieveAllApps().forEach(app => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mani = app?.hostManifests?.demo as any;
      const show = mani?.visible ?? true;
      if (show) {
        appList.appendChild(createAppStartButton(app, sc));
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

      console.log('Received window.postMessage: ' + JSON.stringify(event.data));
      if (data.type == 'WCP1Hello') {
        const instance = await sc.getInstanceForWindow(source);
        if (instance) {
          console.log('Identified instance for source window: ' + JSON.stringify(instance.instanceId));

          if (getApproach() == Approach.IFRAME) {
            // Let getAgent/the app know to load an adaptor into an iframe via WCP2LoadUrl
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

            console.log('Responding with message: ', JSON.stringify(message));

            // no message port is included as communication will be setup with the iframe
            source.postMessage(message, origin);
          } else {
            //setup a MessageChannel and handling for incoming messages on it
            const channel = new MessageChannel();
            channel.port2.onmessage = message => {
              console.log(
                `message received on message port for app ${instance.instanceId}, message: ${JSON.stringify(message.data)}`
              );
              const msg = message.data as
                | BrowserTypes.AppRequestMessage
                | BrowserTypes.WebConnectionProtocol4ValidateAppIdentity
                | BrowserTypes.WebConnectionProtocol6Goodbye;
              fdc3Server.receive(msg, instance.instanceId);
            };

            //update the server Context with the MessagePort
            await sc.setInstanceDetails(instance.instanceId, { ...instance, messagePort: channel.port2 });

            //get details of channel selector and intent resolver
            const ui = UI_URLS[getUIKey()];

            //prepare the handshake message
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
            console.log('Responding with message: ', JSON.stringify(message));

            //send the handshake message and include the message port for further comms
            source.postMessage(message, origin, [channel.port1]);
          }
        } else {
          // Log unknown windows but don't let them connect
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
