import { getAgent } from '@kite9/client'

/**
 * This demonstrates using the API via a promise
 */
getAgent().then(async fdc3 => {
    console.log("in promise")
    const log = document.getElementById("log");
    const msg = document.createElement("p");
    msg.textContent = "FDC3 Loaded: " + JSON.stringify(fdc3.getInfo());
    log?.appendChild(msg);
    const channels = await fdc3.getUserChannels()

    fdc3.joinUserChannel(channels[0].id)

    fdc3.addContextListener(null, context => {
        const msg = document.createElement("p");
        msg.textContent = "Received: " + JSON.stringify(context);
        log?.appendChild(msg);
    })
});
