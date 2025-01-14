import {
  Fdc3UserInterfaceHello,
  Fdc3UserInterfaceResolve,
  Fdc3UserInterfaceResolveAction,
  Fdc3UserInterfaceRestyle,
  isFdc3UserInterfaceHandshake,
  isFdc3UserInterfaceResolve,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { AppIdentifier } from '@finos/fdc3-standard';

const DEFAULT_COLLAPSED_CSS = {
  position: 'fixed',
  display: 'none',
  zIndex: '1000',
  right: '0',
  bottom: '0',
  width: '0',
  height: '0',
};

const DEFAULT_EXPANDED_CSS = {
  position: 'fixed',
  display: 'block',
  zIndex: '1000',
  left: '10%',
  top: '10%',
  right: '10%',
  bottom: '10%',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debug = (...params: any[]) => {
  console.debug('Demo Intent Resolver: ', ...params);
};

window.addEventListener('load', () => {
  const parent = window.parent;

  const mc = new MessageChannel();
  const myPort = mc.port1;
  myPort.start();

  const list = document.getElementById('intent-list')!;

  // ISSUE: 1302
  const helloMessage: Fdc3UserInterfaceHello = {
    type: 'Fdc3UserInterfaceHello',
    payload: {
      initialCSS: DEFAULT_COLLAPSED_CSS,
      implementationDetails: 'Demo Intent Resolver v1.0',
    },
  };
  parent.postMessage(helloMessage, '*', [mc.port2]);
  debug('Sent hello message: ', helloMessage);

  function callback(intent: string | null, app: AppIdentifier | null) {
    const restyleMessage: Fdc3UserInterfaceRestyle = {
      type: 'Fdc3UserInterfaceRestyle',
      payload: { updatedCSS: DEFAULT_COLLAPSED_CSS },
    };
    myPort.postMessage(restyleMessage);
    debug('Setting collapsed styles: ', restyleMessage);

    if (intent && app) {
      const message: Fdc3UserInterfaceResolveAction = {
        type: 'Fdc3UserInterfaceResolveAction',
        payload: {
          action: 'click',
          appIdentifier: app,
          intent: intent,
        },
      };
      myPort.postMessage(message);
      debug('Sent resolution: ', message);
    } else {
      const message: Fdc3UserInterfaceResolveAction = {
        type: 'Fdc3UserInterfaceResolveAction',
        payload: {
          action: 'cancel',
        },
      };
      myPort.postMessage(message);
      debug('Sent cancellation: ', message);
    }
  }

  myPort.addEventListener('message', e => {
    if (isFdc3UserInterfaceHandshake(e.data)) {
      const message: Fdc3UserInterfaceRestyle = {
        type: 'Fdc3UserInterfaceRestyle',
        payload: { updatedCSS: DEFAULT_COLLAPSED_CSS },
      };
      myPort.postMessage(message);
      debug('Received handshake, sending initial restyle: ', message);
    } else if (isFdc3UserInterfaceResolve(e.data)) {
      const message: Fdc3UserInterfaceRestyle = {
        type: 'Fdc3UserInterfaceRestyle',
        payload: { updatedCSS: DEFAULT_EXPANDED_CSS },
      };
      myPort.postMessage(message);
      debug('Received request for resolution, setting expanded styles: ', message);
      Array.from(list.children).forEach(i => i.remove());
      const details: Fdc3UserInterfaceResolve['payload'] = e.data.payload;
      details.appIntents.forEach(intent => {
        intent.apps.forEach(app => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          const description = document.createElement('em');

          if (app.instanceId) {
            description.textContent = `${intent.intent.displayName ?? ''} on app instance ${app.instanceId} of ${app.appId}`;
          } else {
            description.textContent = ` ${intent.intent.displayName ?? ''} on a new instance of ${app.appId}`;
          }

          a.textContent = intent.intent.name;

          li.appendChild(a);
          li.appendChild(description);
          list.appendChild(li);
          a.setAttribute('href', '#');
          a.onclick = () => callback(intent.intent.name, app);
        });
      });
    }
  });

  document.getElementById('cancel')!.addEventListener('click', () => {
    callback(null, null);
  });
});
