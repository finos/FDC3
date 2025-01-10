import { dragElement } from './drag';
import {
  Channel,
  Fdc3UserInterfaceChannelSelected,
  Fdc3UserInterfaceHello,
  Fdc3UserInterfaceRestyle,
  isFdc3UserInterfaceChannels,
  isFdc3UserInterfaceHandshake,
  UpdatedCSS,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

let channels: Channel[] = [];
let channelId: string | null = null;

export const DEFAULT_COLLAPSED_CSS: UpdatedCSS = {
  width: '50px',
  height: '50px',
  position: 'fixed',
  zIndex: '1000',
};

const DEFAULT_EXPANDED_CSS: UpdatedCSS = {
  left: '0',
  right: '0',
  top: '0',
  bottom: '0',
  position: 'fixed',
  zIndex: '1000',
};

export type Position = {
  left: string;
  top: string;
  bottom: string;
  right: string;
};

const position: Position = {
  right: '10px',
  bottom: '10px',
  left: '',
  top: '',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debug = (...params: any[]) => {
  console.debug('Demo Channel Selector: ', ...params);
};

window.addEventListener('load', () => {
  const parent = window.parent;
  const logo = document.getElementById('logo')!;
  const close = document.getElementById('close')!;
  const drag = document.getElementById('drag')!;
  const selector = document.getElementById('selector')!;
  const list = document.getElementById('channel-list')!;

  const mc = new MessageChannel();
  const myPort = mc.port1;
  myPort.start();

  // ISSUE: 1302
  const helloMessage: Fdc3UserInterfaceHello = {
    type: 'Fdc3UserInterfaceHello',
    payload: {
      initialCSS: {
        ...DEFAULT_COLLAPSED_CSS,
        ...position,
      },
      implementationDetails: 'Demo Channel Selector v1.0',
    },
  };
  parent.postMessage(helloMessage, '*', [mc.port2]);
  debug('Sent hello message: ', helloMessage);

  function changeSize(expanded: boolean) {
    document.body.setAttribute('data-expanded', 'none');
    if (expanded) {
      const message: Fdc3UserInterfaceRestyle = {
        type: 'Fdc3UserInterfaceRestyle',
        payload: { updatedCSS: DEFAULT_EXPANDED_CSS },
      };
      myPort.postMessage(message);
      debug('Setting expanded styles: ', message);
      console.debug();
      selector.style.left = position.left;
      selector.style.top = position.top;
      selector.style.right = position.right;
      selector.style.bottom = position.bottom;
      setTimeout(() => {
        document.body.setAttribute('data-expanded', 'selector');
      }, 20);
    } else {
      const message: Fdc3UserInterfaceRestyle = {
        type: 'Fdc3UserInterfaceRestyle',
        payload: { updatedCSS: { ...DEFAULT_COLLAPSED_CSS, ...position } },
      };
      debug('Setting collapsed styles: ', message);
      myPort.postMessage(message);
      setTimeout(() => {
        document.body.setAttribute('data-expanded', 'logo');
      }, 20);
    }
  }

  myPort.addEventListener('message', e => {
    if (isFdc3UserInterfaceHandshake(e.data)) {
      // ok, port is ready, send the iframe position details
      const message: Fdc3UserInterfaceRestyle = {
        type: 'Fdc3UserInterfaceRestyle',
        payload: { updatedCSS: { ...DEFAULT_COLLAPSED_CSS, ...position } },
      };
      myPort.postMessage(message);
      debug('Received handshake, sending initial restyle: ', message);
    } else if (isFdc3UserInterfaceChannels(e.data)) {
      debug('Received channel details: ', e.data);
      channels = e.data.payload.userChannels;
      channelId = e.data.payload.selected;

      const selectedColor =
        (channelId ? channels.find(c => c.id == channelId)?.displayMetadata?.color : null) ?? 'white';
      logo.style.backgroundColor = selectedColor;
    }
  });

  close.addEventListener('click', () => {
    changeSize(false);
  });

  logo.addEventListener('click', () => {
    list.innerHTML = '';
    channels.forEach(channel => {
      const li = document.createElement('div');
      li.style.backgroundColor = channel.displayMetadata!.color!;
      const description = document.createElement('em');
      description.textContent = channel.displayMetadata!.name = channel.id == channelId ? ' CURRENT CHANNEL ' : '';
      li.textContent = channel.id;

      li.appendChild(description);
      list.appendChild(li);
      li.onclick = () => {
        changeSize(false);
        channelId = channel.id;
        const message: Fdc3UserInterfaceChannelSelected = {
          type: 'Fdc3UserInterfaceChannelSelected',
          payload: {
            selected: channel.id,
          },
        };
        myPort.postMessage(message);
        debug('Sending channel selection: ', message);
      };
    });
    changeSize(true);
  });

  dragElement(drag, selector, position);
});
