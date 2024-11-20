import { Fdc3UserInterfaceChannels, Fdc3UserInterfaceChannelSelected, Fdc3UserInterfaceHello, Fdc3UserInterfaceRestyle } from "@kite9/fdc3-schema/generated/api/BrowserTypes";

// TODO: Update typings
let channels: any[] = []
let channelId: string | null = null


const DEFAULT_COLLAPSED_CSS = {
    position: "fixed",
    zIndex: "1000",
    right: "10px",
    bottom: "10px",
    width: "50px",
    height: "50px"
}

const DEFAULT_EXPANDED_CSS = {
    position: "fixed",
    zIndex: "1000",
    right: "10px",
    bottom: "10px",
    width: "450px",
    maxHeight: "600px",
    transition: "all 0.5s ease-out allow-discrete"
}

window.addEventListener("load", () => {
    const parent = window.parent;
    const logo = document.getElementById("logo")!
    const list = document.getElementById("channel-list")!
    const close = document.getElementById("close")!

    const mc = new MessageChannel();
    const myPort = mc.port1
    myPort.start()


    // ISSUE: 1302
    const helloMessage: Fdc3UserInterfaceHello = {
        type: "Fdc3UserInterfaceHello",
        payload: {
            initialCSS: DEFAULT_COLLAPSED_CSS,
            implementationDetails: "Demo Channel Selector v1.0"
        }
    }
    parent.postMessage(helloMessage, "*", [mc.port2]);

    function changeSize(expanded: boolean) {
        document.body.setAttribute("data-expanded", `${expanded}`);
        const restyleMessage: Fdc3UserInterfaceRestyle = {
            type: "Fdc3UserInterfaceRestyle", 
            payload: { 
                updatedCSS: expanded ? DEFAULT_EXPANDED_CSS : DEFAULT_COLLAPSED_CSS 
            } 
        }
        myPort.postMessage(restyleMessage)
    }

    myPort.addEventListener("message", (e) => {
        if (e.data.type == 'iframeHandshake') {
            // ok, port is ready, send the iframe position details
            const restyleMessage: Fdc3UserInterfaceRestyle = {
                type: "Fdc3UserInterfaceRestyle", 
                payload: { 
                    updatedCSS: DEFAULT_COLLAPSED_CSS 
                } 
            }
            myPort.postMessage(restyleMessage)
        } else if (e.data.type == 'fdc3UserInterfaceChannels') {
            const details: Fdc3UserInterfaceChannels = e.data
            channels = details.payload.userChannels
            channelId = details.payload.selected

            const selectedColor = (channelId ? (channels.find(c => c.id == channelId)?.displayMetadata?.color) : null) ?? 'white'
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
                channelId = channel.id
                const message: Fdc3UserInterfaceChannelSelected = { 
                    type: "Fdc3UserInterfaceChannelSelected", 
                    payload: { 
                        selected: channel.id 
                    } 
                }
                myPort.postMessage(message)
            }
        })

        // ask the parent container to increase the window size
        changeSize(true)
    })

    close.addEventListener("click", () => {
        changeSize(false)
    })

})