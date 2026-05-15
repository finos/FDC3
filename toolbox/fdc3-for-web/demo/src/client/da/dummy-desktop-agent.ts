import './dummy-desktop-agent.css';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { APP_GOODBYE, DA_HELLO, FDC3_APP_EVENT } from '../../message-types.js';
import { DemoServerContext } from './DemoServerContext.js';
import { FDC3_2_1_JSONDirectory } from './FDC3_2_1_JSONDirectory.js';
import {
  AppRegistration,
  ChannelState,
  ChannelType,
  DefaultFDC3Server,
  DirectoryApp,
  ServerContext,
} from '@finos/fdc3-web-impl';
import { UI, UI_URLS } from './util.js';
import { BrowserTypes } from '@finos/fdc3-schema';
import { WebConnectionProtocol3Handshake } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

type WebConnectionProtocol2LoadURL = BrowserTypes.WebConnectionProtocol2LoadURL;

function primaryIconSrc(app: DirectoryApp): string | undefined {
  const icons = app.icons;
  if (!icons?.length) return undefined;
  const first = icons[0] as { src?: string };
  return typeof first?.src === 'string' && first.src.length > 0 ? first.src : undefined;
}

function createAppStartButton(app: DirectoryApp, sc: ServerContext<AppRegistration>): HTMLDivElement {
  const card = document.createElement('div');
  card.classList.add('da-app-card');

  const description = (app.description ?? '').trim();
  const popoverId = `da-app-desc-${app.appId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  if (description.length > 0) {
    const descBtn = document.createElement('button');
    descBtn.type = 'button';
    descBtn.classList.add('da-app-card__desc-trigger');
    descBtn.textContent = 'i';
    descBtn.setAttribute('popovertarget', popoverId);
    descBtn.setAttribute('aria-label', `About ${app.title}`);
    card.appendChild(descBtn);

    const pop = document.createElement('div');
    pop.id = popoverId;
    pop.classList.add('da-app-card__popover');
    pop.setAttribute('popover', 'auto');
    pop.textContent = description;
    card.appendChild(pop);
  }

  const iconWrap = document.createElement('div');
  iconWrap.classList.add('da-app-card__icon-wrap');
  const iconSrc = primaryIconSrc(app);
  if (iconSrc) {
    const img = document.createElement('img');
    img.classList.add('da-app-card__icon');
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = iconSrc;
    img.addEventListener('error', () => {
      img.replaceWith(fallbackIconEl(app.title ?? app.appId));
    });
    iconWrap.appendChild(img);
  } else {
    iconWrap.appendChild(fallbackIconEl(app.title ?? app.appId));
  }
  card.appendChild(iconWrap);

  const titleEl = document.createElement('div');
  titleEl.classList.add('da-app-card__title');
  titleEl.textContent = app.title ?? app.appId;
  card.appendChild(titleEl);

  const start = document.createElement('button');
  start.type = 'button';
  start.classList.add('da-app-card__start');
  start.textContent = 'Start';
  start.onclick = () => sc.open(app.appId);
  card.appendChild(start);

  return card;
}

function fallbackIconEl(label: string): HTMLDivElement {
  const el = document.createElement('div');
  el.classList.add('da-app-card__icon-fallback');
  el.textContent = (label.trim().charAt(0) || '?').toUpperCase();
  return el;
}

const UNCATEGORIZED = 'Uncategorized';

const CATEGORY_COLOURS = ['#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa', '#fce4ec', '#f1f8e9', '#ede7f6'];

function primaryCategory(app: DirectoryApp): string {
  const first = app.categories?.[0];
  if (typeof first === 'string' && first.trim().length > 0) {
    return first.trim();
  }
  return UNCATEGORIZED;
}

function groupAppsByCategory(apps: DirectoryApp[]): Map<string, DirectoryApp[]> {
  const groups = new Map<string, DirectoryApp[]>();
  for (const app of apps) {
    const category = primaryCategory(app);
    const bucket = groups.get(category) ?? [];
    bucket.push(app);
    groups.set(category, bucket);
  }
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => (a.title ?? a.appId).localeCompare(b.title ?? b.appId));
  }
  return groups;
}

function sortedCategoryNames(groups: Map<string, DirectoryApp[]>): string[] {
  const names = [...groups.keys()].filter(c => c !== UNCATEGORIZED).sort((a, b) => a.localeCompare(b));
  if (groups.has(UNCATEGORIZED)) {
    names.push(UNCATEGORIZED);
  }
  return names;
}

function pastelForCategoryIndex(index: number, category: string): string {
  if (category === UNCATEGORIZED) {
    return '#f1f5f9';
  }
  return CATEGORY_COLOURS[index % CATEGORY_COLOURS.length];
}

function createCategorySection(
  category: string,
  apps: DirectoryApp[],
  sc: ServerContext<AppRegistration>,
  backgroundColor: string
): HTMLElement {
  const section = document.createElement('section');
  section.classList.add('da-category-section');
  section.style.backgroundColor = backgroundColor;

  const heading = document.createElement('h3');
  heading.classList.add('da-category-section__title');
  heading.textContent = category;
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.classList.add('da-category-section__apps');
  for (const app of apps) {
    grid.appendChild(createAppStartButton(app, sc));
  }
  section.appendChild(grid);

  return section;
}

function renderAppList(container: HTMLDivElement, apps: DirectoryApp[], sc: ServerContext<AppRegistration>): void {
  container.replaceChildren();
  const groups = groupAppsByCategory(apps);
  const categories = sortedCategoryNames(groups);

  categories.forEach((category, index) => {
    const bucket = groups.get(category);
    if (!bucket?.length) return;
    container.appendChild(createCategorySection(category, bucket, sc, pastelForCategoryIndex(index, category)));
  });
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
    await directory.load('http://localhost:4005/static/generated/fdc3-example-apps.json');
    await directory.load('http://localhost:4005/static/localhost-workbench.json');
    await directory.load('http://localhost:4005/static/localhost-conformance.json');
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
    const fdc3Server = new DefaultFDC3Server(sc, directory, channelDetails, true, 20000, 15000);

    socket.on(FDC3_APP_EVENT, (msg, from) => {
      fdc3Server.receive(msg, from);
    });

    socket.on(APP_GOODBYE, (id: string) => {
      fdc3Server.cleanup(id);
    });

    const appList = document.getElementById('app-list') as HTMLDivElement;
    const visibleApps = directory.retrieveAllApps().filter((app: DirectoryApp) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mani = app?.hostManifests?.demo as any;
      return mani?.visible ?? true;
    });
    renderAppList(appList, visibleApps, sc);

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

              if (msg.type == 'WCP6Goodbye') {
                // handle disconnect messages
                fdc3Server.cleanup(instance.instanceId);
              } else {
                // handle DACP messages and WCP4ValidateAppIdentity
                fdc3Server.receive(msg, instance.instanceId);
              }
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
