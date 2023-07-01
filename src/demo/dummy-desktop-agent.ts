import { AppIdentifier } from "@finos/fdc3";
import { supply } from "../lib/webc3";
import { AppIdentifierResolver } from "../lib/types";

window.addEventListener("load", () => {
    
    let currentInstance = 0;

    type AppIdentifierAndWindow = AppIdentifier & { window: Window, url: string }

    const instances : { [key: string] : AppIdentifierAndWindow } = {}

    function launch(url: string, appId: string) {
        const w : Window = window.open(url, "_blank")!!;
        const instance = currentInstance++;
        w.name = "App"+instance;
        instances[w.name] = {
            appId,
            instanceId: ""+instance,
            window: w,
            url: w.location.href
        }  
    }

    // for a given window, allows us to determine which app it is (if any)
    const appIdentifierResolver : AppIdentifierResolver = o => instances[o.name];

    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    supply("/src/demo/implementation.js", appIdentifierResolver);

    // hook up the buttons
    document.getElementById("app1")?.addEventListener("click", () => launch("/static/app1/index.html", "1"));
    document.getElementById("app2")?.addEventListener("click", () => launch("/static/app2/index.html", "2"));


    // allow apps opened by this desktop agent to broadcast to each other
    window.addEventListener(
        "message",
        (event) => {
          const data = event.data;
          if (data.type == "Broadcast") {
            const origin = event.origin;
            const source = event.source as Window
            console.log(`Broadcast Origin:  ${origin} Source: ${source} `);
            const appIdentifier = appIdentifierResolver(source);
            if (appIdentifier != null) {
                Object.values(instances)
                    .filter(i => i.window != source)
                    .forEach(i => {
                        i.window.postMessage(data, "*")
                    })
            }
          }
    });
})

