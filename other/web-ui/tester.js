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
  context: "fdc3.instrument",
  intents: [
    {
      intent: "ViewChart",
      displayName: "View Chart"
    },
    {
      intent: "ViewInstrument",
      displayName: "View Instrument"
    }
  ],
  options: {
    ViewChart: {
      apps: [
        {
          appId: "chartiq",
          title: "ChartIQ",
        },
        {
          appId: "trading-view-chart",
          title: "TradingView Chart",
          icon: {
            "src": "https://apps.connectifi-interop.com/tradingviewChart/icon.png"
          }
        }
      ],
      openApps: []
    },
    ViewInstrument: {
      apps: [
        {
          appId: "adaptabledemo",
          title: "AdapTable Demo",
          icon: {
            src: "data:image/png;base64,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"
          },
        },
        {
          appId: "ticker-details",
          title: "Ticker Details Demo",
          icon: {
            src: "https://apps.connectifi-interop.com/tickerDetails/icon.png"
          },
        }
      ],
      openApps: new Array(10).fill("").map((_, i) => {
        return {
          windowId: `adaptabledemo-${i+1}`,
          appId: "adaptabledemo",
          title: `AdapTable Demo (${i+1})`
        }
      })
    }
  }
};

const openChannelIframe = e => {
  const channel = new MessageChannel();
  let handshook = false;

  // STEP 2B: Receive confirmation over port from iframe
  channel.port1.onmessage = e => {
    if (!handshook) {
      // STEP 3A: Send channel data to iframe
      channel.port1.postMessage(recommendedChannels);
      handshook = true;
      return;
    }

    // STEP 4B: Receive user selection information from iframe
    document.getElementById('channel-user-selection').innerHTML = e.data;
  };
  e.target.disabled = true;

  const iframe = document.getElementById("channel-iframe");
  iframe.parentElement.setAttribute("data-visible", "true");

  // STEP 1A: Send port to iframe
  iframe.contentWindow.postMessage('Begin handshake', '*', [channel.port2]);
};

const openResolverIframe = e => {
  const channel = new MessageChannel();
  let handshook = false;

  // STEP 2B: Receive confirmation over port from iframe
  channel.port1.onmessage = e => {
    if (!handshook) {
      // STEP 3A: Send channel data to iframe
      channel.port1.postMessage(exampleResolverData);
      handshook = true;
      return;
    }

    // STEP 4B: Receive user selection information from iframe
    document.getElementById('resolver-user-selection').innerHTML = prettyPrintJson.toHtml(e.data);
  };
  e.target.disabled = true;

  const iframe = document.getElementById("resolver-iframe");
  iframe.parentElement.setAttribute("data-visible", "true");

  // STEP 1A: Send port to iframe
  iframe.contentWindow.postMessage('Begin handshake', '*', [channel.port2]);
};

window.addEventListener('load', () => {
  document.getElementById('send-btn-channel').addEventListener('click', openChannelIframe);
  document.getElementById('send-btn-resolver').addEventListener('click', openResolverIframe);
});
