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

const openIframe = e => {
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
    document.getElementById('user-selection').innerHTML = prettyPrintJson.toHtml(e.data);
  };
  e.target.disabled = true;

  const iframe = document.querySelector('iframe');

  // STEP 1A: Send port to iframe
  iframe.contentWindow.postMessage('Begin handshake', '*', [channel.port2]);
};

window.addEventListener('load', () => {
  const sendBtn = document.getElementById('send-btn');
  sendBtn.addEventListener('click', openIframe);
});
