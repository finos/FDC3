const fillChannels = (data, messageClickedChannel) => {
  const list = document.getElementById('list');
  list.innerHTML = '';
  data.forEach(({ id, type, displayMetadata }) => {
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');
    const span = document.createElement('span');
    span.classList.add('glyph');
    span.style.color = displayMetadata.color;
    span.style.borderColor = displayMetadata.color;
    span.textContent = displayMetadata.glyph ?? '';
    node.appendChild(span);
    const span2 = document.createElement('span');
    span2.classList.add('name');
    span2.textContent = displayMetadata.name;
    node.appendChild(span2);
    list.appendChild(node);
    node.addEventListener('click', () => messageClickedChannel({ id, type, displayMetadata }));
  });
};

// STEP 1B: Receive port from parent
window.addEventListener('message', ({ ports }) => {
  // STEP 3B: Receive channel data from parent
  ports[0].onmessage = ({ data }) => {
    fillChannels(data, channel => {
      // STEP 4A: Send user selection information to parent
      ports[0].postMessage(channel);
    });
  };
  // STEP 2A: Send confirmation over port to parent
  ports[0].postMessage('Returning handshake');
});
