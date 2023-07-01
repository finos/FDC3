import { load } from '../WebC3'

const options = {

};

load(options).then(fdc => {
    const log = document.getElementById("log");
    const msg = document.createElement("p");
    msg.textContent = "FDC Loaded: "+JSON.stringify(fdc.getInfo());
    log.appendChild(msg);

    fdc.addContextListener(null, context => {
        const msg = document.createElement("p");
        msg.textContent = "Received: "+JSON.stringify(msg);
        log.appendChild(msg);
    })
});
