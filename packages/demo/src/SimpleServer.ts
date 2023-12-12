
/**
 * This is a very basic implementation of the server side of the desktop agent. 
 * You can register message ports with it and plug in extra functionality to handle new message types. 
 */

class SimpleServer {

    constructor() {
    }

    register(client: MessagePort) {
        console.log("Added new listener")
        client.addEventListener("message", e => {
            console.log("Received: "+e.data)
        })
    }
}

const theServer = new SimpleServer();

onconnect = function (event) {
    const port = event.ports[0]
    theServer.register(port)
}