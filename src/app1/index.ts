import { load } from '../WebC3'

const options = {

};

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
    const fdc3 = await load(options); 
    for (let index = 0; index < 50; index++) {
        setInterval(() => fdc3.broadcast(createContext(index)), index*1000);
    }
}

window.addEventListener("load", () => {
    const broadcast = document.getElementById("broadcast");
    broadcast.addEventListener("click", () => startBroadcasting());
})
