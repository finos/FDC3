/**
 * This dummy desktop agent just implements broadcast and addContextListener for the 
 * purposes of the demo.  Communication is also via post-message.  
 */
class DummyDesktopAgent {

    constructor(details) {
        this.details = details;
        this.id = {
            appId: this.details.appId,
            instanceId: this.details.instanceId
        }

        const img = document.createElement("img");
        img.setAttribute("width", 70);
        img.setAttribute("height", 70);
        img.src= "https://cosaic.io/wp-content/uploads/2022/09/fdc3-check.png"
        img.style = "position: absolute; bottom: 0px; right: 0px;"
        document.body.appendChild(img)
    }

    broadcast(context) {
        console.log("Broadcasting: "+JSON.stringify(context))
        const da = window.opener ?? window.parent;
        if (da) {
            da.postMessage({
                type: "Broadcast",
                context: context,
                from: this.id
            }, "*") // in a real desktop agent, don't use *
        }
    }

    addContextListener(type, callback) {
        console.log("Adding context listener");

        window.addEventListener("message", (event) => {
            const data = event.data;
            if (data.type == "Broadcast") {
                callback(data.context);
            }
        })
    }

    getInfo() {
        return {
            fdc3Version: "2.0",
            id: this.id
        }
    }
}

export default (details) => {
    return new DummyDesktopAgent(details);
}
