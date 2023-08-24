import { AppIdentifier } from "@finos/fdc3";
import { supply } from "../lib/agent/supply";
import { AppChecker, DesktopAgentDetailResolver } from "../lib/types";
import { RequestMessageType } from "../lib/BridgingTypes";


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
    const jsInject : DesktopAgentDetailResolver = (o) => { 
        const appIdentifier = instances.find(i => i.window ==o)!!
        return { 
            url: "/src/demo/implementation.ts",
            apiId : currentApiInstance++, 
            apikey: "Abc",
            appId: appIdentifier.appId,
            instanceId: appIdentifier.instanceId!!
        }
    }
   
    const postMessageProtocol : DesktopAgentDetailResolver = (o) => {
        const appIdentifier = instances.find(i => i.window ==o)!!
        return { 
            apiId : currentApiInstance++, 
            appId: appIdentifier.appId,
            instanceId: appIdentifier.instanceId!!,
            provider: "Dummy",
            origin: window.origin
        }
    }

    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    supply(appChecker, {
        "js-inject": jsInject,
        "post-message-protocol": postMessageProtocol
    });

    // hook up the buttons
    document.getElementById("app1")?.addEventListener("click", () => launch("/static/app1/index.html", "1"));
    document.getElementById("app2")?.addEventListener("click", () => launch("http://robs-pro:8080/static/app2/index.html", "2"));
    document.getElementById("app3")?.addEventListener("click", () => launch("http://localhost:8080/static/app3/index.html", "3"));

    // implementation of broadcast, desktop-agent side (post-message-protocol version)
    window.addEventListener(
        "message",
        (event) => {
          const data = event.data;
          if (data.type == RequestMessageType.BroadcastRequest) {
            const origin = event.origin;
            const source = event.source as Window
            console.log(`${RequestMessageType.BroadcastRequest} Origin:  ${origin} Source: ${source} From ${JSON.stringify(data.from)}`);
            if (appChecker(source)) {
                instances
                    .forEach(i => {
                        i.window.postMessage(data, "*")
                    })
            }
          }
    });
})

