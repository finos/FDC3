import {
  Channel,
  Fdc3UserInterfaceChannelSelected,
  Fdc3UserInterfaceHello,
  Fdc3UserInterfaceRestyle,
  isFdc3UserInterfaceChannels,
  isFdc3UserInterfaceHandshake,
} from '@kite9/fdc3-schema/dist/generated/api/BrowserTypes';
import { selectHighestContrast } from './contrast';

const fillChannels = (data: Channel[], selected: string | null, messageClickedChannel: (s: string | null) => void) => {
  const list = document.getElementById('list')!;
  list.innerHTML = '';

  data.forEach(({ id, displayMetadata }) => {
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');

    const span = document.createElement('span');
    span.classList.add('glyph');

    if (displayMetadata?.color) {
      span.style.color = selectHighestContrast(displayMetadata.color, 'white', 'black');
      span.style.backgroundColor = displayMetadata.color;
      span.style.borderColor = displayMetadata.color;
    }
    span.textContent = displayMetadata?.glyph ?? '';
    node.appendChild(span);

    if (displayMetadata?.name) {
      const span2 = document.createElement('span');
      span2.classList.add('name');
      span2.textContent = displayMetadata.name;
      node.appendChild(span2);
    }

    list.appendChild(node);
    node.addEventListener('click', () => {
      messageClickedChannel(id);
    });

    if (id === selected) {
      node.setAttribute('aria-selected', 'true');
      node.style.backgroundColor = '#bbb';
    }
  });

  //add an element for leaving all channels
  const node = document.createElement('div');
  node.setAttribute('tabIndex', '0');

  const span = document.createElement('span');
  span.classList.add('glyph');
  span.textContent = 'X';
  node.appendChild(span);

  const span2 = document.createElement('span');
  span2.classList.add('name');
  span2.textContent = 'none';
  node.appendChild(span2);

  list.appendChild(node);
  node.addEventListener('click', () => {
    messageClickedChannel(null);
  });

  if (selected === null) {
    node.setAttribute('aria-selected', 'true');
    node.style.backgroundColor = '#bbb';
  }
};

window.addEventListener('load', () => {
  const parent = window.parent;
  const logo = document.getElementById('logo')!;

  const mc = new MessageChannel();
  const myPort = mc.port1;

  myPort.addEventListener('message', ({ data }) => {
    console.debug('Received message: ', data);

    if (isFdc3UserInterfaceHandshake(data)) {
      collapse();
    } else if (isFdc3UserInterfaceChannels(data)) {
      logo.removeEventListener('click', expand);
      const { userChannels, selected } = data.payload;
      fillChannels(userChannels, selected, channelStr => {
        const message: Fdc3UserInterfaceChannelSelected = {
          type: 'Fdc3UserInterfaceChannelSelected',
          payload: {
            selected: channelStr || null,
          },
        };
        myPort.postMessage(message);
        console.log('Channel Selected: ', message);
        collapse();
      });

      const selectedChannel = userChannels.find(c => c.id === selected);
      logo.style.fill = selectedChannel?.displayMetadata?.color ?? 'white';
      console.log('Adding click event listener');
      logo.addEventListener('click', expand);
    }
  });
  myPort.start();

  const helloMessage: Fdc3UserInterfaceHello = {
    type: 'Fdc3UserInterfaceHello',
    payload: {
      implementationDetails: 'FDC3 Reference Channel Selector UI',
      initialCSS: {
        width: `${8 * 6}px`,
        height: `${8 * 8}px`,
        right: '2px',
        bottom: '8px',
        zIndex: '1000',
        'z-index': '1000',
        position: 'fixed',
      },
    },
  };
  parent.postMessage(helloMessage, '*', [mc.port2]);

  const expand = () => {
    document.body.setAttribute('data-expanded', 'true');
    const restyleMessage: Fdc3UserInterfaceRestyle = {
      type: 'Fdc3UserInterfaceRestyle',
      payload: {
        updatedCSS: {
          width: `100%`,
          height: `100%`,
          top: '0',
          left: '0',
          zIndex: '1000',
          'z-index': '1000',
          position: 'fixed',
        },
      },
    };
    myPort.postMessage(restyleMessage);
  };

  const collapse = () => {
    const restyleMessage: Fdc3UserInterfaceRestyle = {
      type: 'Fdc3UserInterfaceRestyle',
      payload: {
        updatedCSS: {
          width: `${8 * 6}px`,
          height: `${8 * 8}px`,
          right: '8px',
          bottom: '2px',
          zIndex: '1000',
          'z-index': '1000',
          position: 'fixed',
        },
      },
    };
    myPort.postMessage(restyleMessage);

    // If you immediately change to the logo, before the iframe has a chance to finish restyling,
    // you see a flicker of a giant, colored logo.
    // Here, we wait a negligible amount of time, and hope that the restyling has finished. This avoids the flicker.
    // It's not a *good* idea, it's just the best available, since we don't know when the restyle finishes.
    setTimeout(() => {
      document.body.setAttribute('data-expanded', 'false');
    }, 15);
  };
});
