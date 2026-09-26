const cleanupChannel = new BroadcastChannel('fdc3-conformance-open-b-cleanup');

cleanupChannel.addEventListener('message', event => {
  const message = event.data;
  if (message?.type !== 'close-open-b' || typeof message.requestId !== 'string') return;

  // Acknowledge receipt so the test fixture can stop retrying, then close this
  // test-only app. Frames ask the reference Desktop Agent to remove their iframe;
  // top-level windows ask the browser to close the tab.
  cleanupChannel.postMessage({ type: 'close-open-b-ack', requestId: message.requestId });
  cleanupChannel.close();

  if (window.parent !== window) {
    window.parent.postMessage({ type: 'fdc3-conformance-close-open-b', requestId: message.requestId }, '*');
  } else {
    window.close();
  }
});
