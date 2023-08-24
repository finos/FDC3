import { AppIdentifier } from "@finos/fdc3";
import { supply } from "../lib/supply";
import { AppChecker, DesktopAgentDetailResolver } from "../lib/types";


window.addEventListener("load", () => {
    
    let currentInstance = 0;
    let currentApiInstance = 0;

    type AppIdentifierAndWindow = AppIdentifier & { window: Window, url: string }

    const instances : AppIdentifierAndWindow[] = []

    function useFrames() : boolean {
        const cb = document.getElementById("frames") as HTMLInputElement;
        return (cb.checked)
    }

    function openTab(url: string) : Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    }

    function openFrame(url: string) : Window {
        return window.open(url, "_blank")!!;
    }

    function launch(url: string, appId: string) {
        const w = useFrames() ? openTab(url): openFrame(url);
        const instance = currentInstance++;
        w.name = "App"+instance;
        instances.push({
            appId,
            instanceId: ""+instance,
            window: w,
            url: w.location.href
        })
    }

    // for a given window, allows us to determine which app it is (if any)
    const appChecker : AppChecker = o => instances.find(i => i.window ==o) != undefined;
    const daDetailResolver : DesktopAgentDetailResolver = (o) => { 
        const appIdentifier = instances.find(i => i.window ==o)!!
        return { 
            url: "/src/demo/implementation.js",
            apiId : currentApiInstance++, 
            apikey: "Abc",
            appId: appIdentifier.appId,
            instanceId: appIdentifier.instanceId!!
        }
    }

    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    supply(appChecker, {
        "js-inject": daDetailResolver
    });

    // hook up the buttons
    document.getElementById("app1")?.addEventListener("click", () => launch("/static/app1/index.html", "1"));
    document.getElementById("app2")?.addEventListener("click", () => launch("http://robs-pro:8080/static/app2/index.html", "2"));
    document.getElementById("app3")?.addEventListener("click", () => launch("http://localhost:8080/static/app3/index.html", "3"));


    // implementation of broadcast, desktop-agent side
    window.addEventListener(
        "message",
        (event) => {
          const data = event.data;
          if (data.type == "Broadcast") {
            const origin = event.origin;
            const source = event.source as Window
            console.log(`Broadcast Origin:  ${origin} Source: ${source} From ${JSON.stringify(data.from)}`);
            if (appChecker(source)) {
                instances
                    .forEach(i => {
                        i.window.postMessage(data, "*")
                    })
            }
          }
    });
})

