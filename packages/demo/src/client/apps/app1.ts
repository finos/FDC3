import { getClientAPI } from '@kite9/client'

function createContext(i: number) {
    return {
        type: "demo.counter",
        count: i
    }
}

/**
 * Calling this function should get the fdc3 DesktopAgent and then 
 * broadcast 50 context elements to the default channel.
 * 
 * Can be called any number of times.
 */
async function startBroadcasting() {
    console.log("starting...")
    const fdc3 = await getClientAPI();
    console.log("got api...")
    const channels = await fdc3.getUserChannels()
    const channel = channels[0]
    for (let index = 0; index < 50; index++) {
        setTimeout(() => channel.broadcast(createContext(index)), index * 1000);
    }
}

window.addEventListener("load", () => {
    const broadcast = document.getElementById("broadcast");
    broadcast?.addEventListener("click", () => startBroadcasting());
})
