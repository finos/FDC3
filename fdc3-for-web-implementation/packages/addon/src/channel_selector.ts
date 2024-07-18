import { ChannelDetails, SelectorMessageChannels } from "@kite9/fdc3-common";


var channels: ChannelDetails[] = []
var channelId: string | null = null

function fillChannels(data: ChannelDetails[], selected: string | null, messageClickedChannel: (s: String) => void) {
  const list = document.getElementById('list')!!;
  list.innerHTML = '';

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


    if (id === selected) {
      node.setAttribute("aria-selected", "true");
      node.style.backgroundColor = "#bbb";
    }
  });
};

window.addEventListener("load", () => {
  const parent = window.parent;
  const logo = document.getElementById("logo")!!

  const mc = new MessageChannel();
  const myPort = mc.port1
  myPort.start()

  parent.postMessage({ type: "SelectorMessageInitialize" }, "*", [mc.port2]);

  function changeSize(expanded: boolean) {
    document.body.setAttribute("data-expanded", "" + expanded);
    myPort.postMessage({ type: "SelectorMessageResize", expanded })
  }

  myPort.addEventListener("message", (e) => {
    if (e.data.type == 'SelectorMessageChannels') {
      const details = e.data as SelectorMessageChannels
      console.log(JSON.stringify("CHANNEL DETAILS: " + JSON.stringify(details)))
      channels = details.channels
      channelId = details.selected

      const selectedColor = (channelId ? (channels.find(c => c.id == channelId)?.displayMetadata?.color) : null) ?? 'black'
      logo.style.fill = selectedColor
    }
  })

  logo.addEventListener("click", () => {
    fillChannels(channels, channelId, (id) => {
      changeSize(false)
      myPort.postMessage({ type: "SelectorMessageChoice", channelId: id })
    })

    // ask the parent container to increase the window size
    changeSize(true)
  })


})