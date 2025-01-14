import {
  FDC3_USER_INTERFACE_CHANNEL_SELECTED_TYPE,
  FDC3_USER_INTERFACE_CHANNELS_TYPE,
  FDC3_USER_INTERFACE_HANDSHAKE_TYPE,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import './style.css';

// Channel data
const recommendedChannels = [
  {
    id: 'fdc3.channel.1',
    type: 'user',
    displayMetadata: {
      name: 'Channel 1',
      color: 'red',
      glyph: '1',
    },
  },
  {
    id: 'fdc3.channel.2',
    type: 'user',
    displayMetadata: {
      name: 'Channel 2',
      color: 'orange',
      glyph: '2',
    },
  },
  {
    id: 'fdc3.channel.3',
    type: 'user',
    displayMetadata: {
      name: 'Channel 3',
      color: 'yellow',
      glyph: '3',
    },
  },
  {
    id: 'fdc3.channel.4',
    type: 'user',
    displayMetadata: {
      name: 'Channel 4',
      color: 'green',
      glyph: '4',
    },
  },
  {
    id: 'fdc3.channel.5',
    type: 'user',
    displayMetadata: {
      name: 'Channel 5',
      color: 'cyan',
      glyph: '5',
    },
  },
  {
    id: 'fdc3.channel.6',
    type: 'user',
    displayMetadata: {
      name: 'Channel 6',
      color: 'blue',
      glyph: '6',
    },
  },
  {
    id: 'fdc3.channel.7',
    type: 'user',
    displayMetadata: {
      name: 'Channel 7',
      color: 'magenta',
      glyph: '7',
    },
  },
  {
    id: 'fdc3.channel.8',
    type: 'user',
    displayMetadata: {
      name: 'Channel 8',
      color: 'purple',
      glyph: '8',
    },
  },
];

// Example resolver data
const exampleResolverData = {
  type: 'ResolverIntents',
  appIntents: [
    {
      apps: [
        {
          appId: 'trading-view-chart',
          description: 'TradingView is a social network for traders and investors on Stock, Futures and Forex markets!',
          icons: [
            {
              src: 'https://apps.connectifi-interop.com/tradingviewChart/icon.png',
            },
          ],
          title: 'TradingView Chart',
        },
        {
          appId: 'adaptabledemo',
          instanceId: '324587329238y7r59824',
          description: 'AdapTable is a powerful data grid with a range of advanced features',
          icons: [
            {
              src: 'https://apps.connectifi-interop.com/adaptableDemo/icon.png',
            },
          ],
          title: 'AdapTable',
        },
      ],
      intent: {
        name: 'ViewInstrument',
        displayName: 'View Instrument',
      },
    },
  ],
  source: {
    appId: 'fdc3-demo',
    instanceId: 'fdc3-demo-instance',
  },
};

let selected = recommendedChannels[2].id;
let expanded = true;

const openChannelIframe = (e: MouseEvent) => {
  const channel = new MessageChannel();

  // STEP 2B: Receive confirmation over port from iframe
  channel.port1.addEventListener('message', ({ data }) => {
    switch (data.type) {
      // User clicked on one of the channels in the channel selector
      case FDC3_USER_INTERFACE_CHANNEL_SELECTED_TYPE: {
        // STEP 4B: Receive user selection information from iframe
        selected = data.channel;
        //Make sure UI receives message back about selection
        channel.port1.postMessage({
          type: FDC3_USER_INTERFACE_CHANNELS_TYPE,
          channels: recommendedChannels,
          selected,
        });
        break;
      }

      // Handshake completed. Send channel data to iframe
      case FDC3_USER_INTERFACE_HANDSHAKE_TYPE: {
        // STEP 3A: Send channel data to iframe
        channel.port1.postMessage({
          type: FDC3_USER_INTERFACE_CHANNELS_TYPE,
          channels: recommendedChannels,
          selected,
        });
        break;
      }
    }
  });
  channel.port1.start();

  const { target } = e;
  if (target) (target as HTMLButtonElement).disabled = true;

  const iframe = document.querySelector<HTMLIFrameElement>('#channel-iframe')!;
  iframe.parentElement?.setAttribute('data-visible', 'true');

  const resizeButton = document.getElementById('dimensions-btn-channel')!;
  resizeButton.setAttribute('data-visible', 'true');
  resizeButton.addEventListener('click', () => {
    expanded = !expanded;
    //TODO: update this to a Fdc3UserInterfaceRestyle message
    channel.port1.postMessage({ type: 'Fdc3UserInterfaceChannelResize', expanded });
    iframe.setAttribute('data-expanded', `${expanded}`);
    resizeButton.textContent = expanded ? 'Collapse' : 'Expand';
  });

  // STEP 1A: Send port to iframe
  //TODO: align message with standard
  iframe.contentWindow?.postMessage({ type: 'Fdc3UserInterfaceHello' }, '*', [channel.port2]);
};

const openResolverIframe = (e: MouseEvent) => {
  const channel = new MessageChannel();

  // STEP 2B: Receive confirmation over port from iframe
  channel.port1.onmessage = ({ data }) => {
    switch (data.type) {
      case 'Fdc3UserInterfaceHandshake': {
        // STEP 3A: Send channel data to iframe
        channel.port1.postMessage(exampleResolverData);
        break;
      }
      case 'Fdc3UserInterfaceResolveAction':
      case 'Fdc3UserInterfaceResolve': {
        // STEP 4B: Receive user selection information from iframe

        // TODO - prettyPrintJson dependency is not referenced, re-enable when added
        // document.getElementById('resolver-user-selection')!.innerHTML = prettyPrintJson.toHtml(data);
        break;
      }
    }
  };
  const { target } = e;
  if (target) (target as HTMLButtonElement).disabled = true;

  const iframe = document.querySelector<HTMLIFrameElement>('#resolver-iframe');
  iframe!.parentElement?.setAttribute('data-visible', 'true');

  // STEP 1A: Send port to iframe
  iframe!.contentWindow?.postMessage({ type: 'Fdc3UserInterfaceHello' }, '*', [channel.port2]);
};

window.addEventListener('load', () => {
  document.getElementById('send-btn-channel')!.addEventListener('click', openChannelIframe);
  document.getElementById('send-btn-resolver')!.addEventListener('click', openResolverIframe);
});
