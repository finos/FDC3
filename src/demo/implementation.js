/**
 * This dummy desktop agent just implements broadcast and addContextListener for the 
 * purposes of the demo.  Communication is also via post-message.  
 */
class DummyDesktopAgent {

    constructor(id, details) {
        this.id = id;
        this.details = details;
    }

    broadcast(context) {
        console.log("Broadcasting: "+JSON.stringify(context))
        window.opener.postMessage({
            type: "Broadcast",
            context: context,
            from: this.id
        }, "*") // in a real desktop agent, don't use *
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
            fdc3Version: "2.0"
        }
    }
}

export default (id, details) => {
    return new DummyDesktopAgent(id, details);
}
