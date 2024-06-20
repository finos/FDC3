import { ChannelDetails, SelectorMessageChannels } from "@kite9/fdc3-common";

var channels: ChannelDetails[] = []
var channelId: string | null = null


window.addEventListener("load", () => {
    const parent = window.parent;
    const logo = document.getElementById("logo")!!
    const list = document.getElementById("channel-list")!!
    const close = document.getElementById("close")!!

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
            logo.style.backgroundColor = selectedColor
        }
    })

    logo.addEventListener("click", () => {
        list.innerHTML = ''
        channels.forEach(channel => {

            const li = document.createElement("li")
            li.style.backgroundColor = channel.displayMetadata.color
            const a = document.createElement("a")
            const description = document.createElement("em")
            description.textContent = channel.displayMetadata.name = (channel.id == channelId ? " CURRENT CHANNEL " : "")
            a.textContent = channel.id

            li.appendChild(a)
            li.appendChild(description)
            list.appendChild(li)
            a.setAttribute("href", "#")
            a.onclick = () => {
                changeSize(false)
                myPort.postMessage({ type: "SelectorMessageChoice", channelId: channel.id })
            }
        })

        // ask the parent container to increase the window size
        changeSize(true)
    })

    close.addEventListener("click", () => {
        changeSize(false)
    })


})