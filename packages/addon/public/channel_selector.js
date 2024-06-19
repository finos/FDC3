const fillChannels = (data, selected, messageClickedChannel) => {
  const list = document.getElementById('list');
  const tokens = document.getElementById("tokens");
  list.innerHTML = '';
  tokens.innerHTML = "";
  data.forEach(({ id, displayMetadata }) => {
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
    node.addEventListener('click', () => messageClickedChannel(id));


    if(id === selected){
      node.setAttribute("aria-selected", true);
      node.style.backgroundColor = "#bbb";
      tokens.appendChild(span.cloneNode(true));
    }
  });
};

// STEP 1B: Receive port from parent
window.addEventListener('message', ({ ports }) => {
  // STEP 3B: Receive channel data from parent
  ports[0].onmessage = ({ data }) => {
    switch(data.type){
      case "iframeChannels": {
        fillChannels(data.channels, data.selected, channel => {
          // STEP 4A: Send user selection information to parent
          ports[0].postMessage({type: "iframeChannelSelected", channel});
        });
        break;
      }
      case "iframeChannelResize": {
        document.body.setAttribute("data-expanded", data.expanded);
      }
    }
  };

  // STEP 2A: Send confirmation over port to parent
  ports[0].postMessage({type: 'iframeHandshake'});
});