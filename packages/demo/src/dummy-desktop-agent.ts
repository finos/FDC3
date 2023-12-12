import { AppIdentifier } from "@finos/fdc3";
import { AppChecker, DesktopAgentDetailResolver, FDC3_PORT_TRANSFER_REQUEST_TYPE, } from "fdc3-common";
import { supply } from "server";

enum Approach { Tab, Frame, Nested }

window.addEventListener("load", () => {
    
    let currentInstance = 0;
    let currentApiInstance = 0;

    type AppIdentifierAndWindow = AppIdentifier & { window: Window, url: string }

    const instances : AppIdentifierAndWindow[] = []

    function getApproach() : Approach {
        const cb = document.getElementById("opener") as HTMLInputElement;
        const val = cb.value
        var out : Approach = Approach[val as keyof typeof Approach]; //Works with --noImplicitAny
        return out;
    }

    function openFrame(url: string) : Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    }

    function openTab(url: string) : Window {
        return window.open(url, "_blank")!!;
    }

    function openNested(url: string) : Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "nested.html?url="+url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    } 

    function open(url: string): Window {
        const approach = getApproach();
        switch (approach) {
            case Approach.Tab:
                return openTab(url);
            case Approach.Nested:
                return openNested(url);
            case Approach.Frame:
                return openFrame(url);
        }
        throw new Error("unsupported")
    }

    function launch(url: string, appId: string) {
        const w = open(url);
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
    const appChecker : AppChecker = o => instances.find(i => i.window == o)

    const detailsResolver : DesktopAgentDetailResolver = (o) => { 
        return { 
            apikey: "Abc"
        }
    }

    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    supply(appChecker, detailsResolver, {
        uri: "http://localhost:8080/static/embed/index.html"
    })

    // hook up the buttons
    document.getElementById("app1")?.addEventListener("click", () => launch("/static/app1/index.html", "1"));
    document.getElementById("app2")?.addEventListener("click", () => launch("http://robs-pro:8080/static/app2/index.html", "2"));
    document.getElementById("app3")?.addEventListener("click", () => launch("http://localhost:8080/static/app3/index.html", "3"));

    // // listen for desktop agent ports being sent to connect
    // bc.addEventListener(
    //     "message",
    //     (event) => {
    //         console.log("Received "+event)
    //         if (event.data.type == FDC3_PORT_TRANSFER_REQUEST_TYPE) {
    //             const port = event.data.payload
    //             server.register(port)
    //         }
    //     });
})

