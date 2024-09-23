import { IframeChannelsPayload, Channel } from "@kite9/fdc3-common";


const fillChannels = (data: Channel[], selected: string | null, messageClickedChannel: (s: string) => void) => {
  const list = document.getElementById('list')!!;
  list.innerHTML = '';

  data.forEach(({ id, displayMetadata }) => {
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');

    const span = document.createElement('span');
    span.classList.add('glyph');

    if(displayMetadata?.color){
      span.style.color = displayMetadata.color;
      span.style.borderColor = displayMetadata.color;
    }
    span.textContent = displayMetadata?.glyph ?? '';
    node.appendChild(span);

    if(displayMetadata?.name){
      const span2 = document.createElement('span');
      span2.classList.add('name');
      span2.textContent = displayMetadata.name;
      node.appendChild(span2);
    }
    
    list.appendChild(node);
    node.addEventListener('click', () => messageClickedChannel(id));

    if (id === selected) {
      node.setAttribute("aria-selected", "true");
      node.style.backgroundColor = "#bbb";
    }
  });
};

window.addEventListener("load", () => {
  const parent = window.parent;
  const logo = document.getElementById("logo")!;

  const mc = new MessageChannel();
  const myPort = mc.port1;
  myPort.start();
  myPort.onmessage = ({data}) => {
    console.debug("Received message: ", data);
    switch(data.type){
      case "iframeHandshake": {
        collapse();
        break;
      }
      case "iframeChannels": {
        const {userChannels, selected} = data.payload as IframeChannelsPayload;
        fillChannels(userChannels, selected, (channelStr) => {
          myPort.postMessage({
            type: "iframeChannelSelected",
            payload: {
              selected: channelStr || null
            }
          });
          collapse();
        });
        const selectedChannel = userChannels.find((c) => c.id === selected);
        logo.style.fill = selectedChannel?.displayMetadata?.color ?? "white";
        break;
      }
    }
  };

  parent.postMessage({
    type: "iframeHello",
    payload: {
      initialCSS: {
        width: `${8*4}px`,
        height: `${8*5}px`,
        right: "2px",
        bottom: "2px",
        zIndex: "1000",
        "z-index": "1000",
        position: "fixed"

      }
    }
  }, "*", [mc.port2]);

  const expand = () => {
    document.body.setAttribute("data-expanded", "true");
    myPort.postMessage({
      type: "iframeRestyle",
      payload: {
        updatedCSS: {
          width: `266px`,
          height: `113px`,
          right: "2px",
          bottom: "2px",
          zIndex: "1000",
          "z-index": "1000",
          position: "fixed"
        }
      }
    });
  }

  const collapse = () => {
    document.body.setAttribute("data-expanded", "false");
    myPort.postMessage({
      type: "iframeRestyle",
      payload: {
        updatedCSS: {
          width: `${8*4}px`,
          height: `${8*5}px`,
          right: "2px",
          bottom: "2px",
          zIndex: "1000",
          "z-index": "1000",
          position: "fixed"
        }
      }
    });
  }

  logo.addEventListener("click", expand);

});