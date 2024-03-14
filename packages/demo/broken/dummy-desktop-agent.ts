import { AppIdentifier } from "@finos/fdc3";
import { AppChecker, DesktopAgentDetailResolver, DesktopAgentDetails, DesktopAgentPortResolver, FDC3_PORT_TRANSFER_REQUEST_TYPE, } from "fdc3-common";
import { supply } from "da-server/src/supply/post-message";
import { MAIN_HOST, SECOND_HOST } from "./constants";

enum Opener { Tab, Frame, Nested }

enum Approach { IFRAME, PARENT_POST_MESSAGE }

window.addEventListener("load", () => {

    let currentInstance = 0;
    let currentApiInstance = 0;

    type AppIdentifierAndWindow = AppIdentifier & { window: Window, url: string }

    const instances: AppIdentifierAndWindow[] = []

    function getOpener(): Opener {
        const cb = document.getElementById("opener") as HTMLInputElement;
        const val = cb.value
        var out: Opener = Opener[val as keyof typeof Opener]; //Works with --noImplicitAny
        return out;
    }

    function getApproach(): Approach {
        const cb = document.getElementById("approach") as HTMLInputElement;
        const val = cb.value
        var out: Approach = Approach[val as keyof typeof Approach]; //Works with --noImplicitAny
        return out;
    }

    function openFrame(url: string): Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    }

    function openTab(url: string): Window {
        return window.open(url, "_blank")!!;
    }

    function openNested(url: string): Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "nested.html?url=" + url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    }

    function open(url: string): Window {
        const opener = getOpener();
        switch (opener) {
            case Opener.Tab:
                return openTab(url);
            case Opener.Nested:
                return openNested(url);
            case Opener.Frame:
                return openFrame(url);
        }
        throw new Error("unsupported")
    }

    function launch(url: string, appId: string) {
        const w = open(url);
        const instance = currentInstance++;
        w.name = "App" + instance;
        instances.push({
            appId,
            instanceId: "" + instance,
            window: w,
            url: w.location.href
        })
    }

    // for a given window, allows us to determine which app it is (if any)
    const appChecker: AppChecker = o => instances.find(i => i.window == o)

    // this is for when the API is using an iframe, and needs to know the address to load
    const detailsResolver: DesktopAgentDetailResolver = (o, a) => {
        const apiKey = "ABC" + (currentApiInstance++)
        if (getApproach() == Approach.IFRAME) {
            return {
                apiKey,
                uri: MAIN_HOST + "/static/embed/index.html"
            }
        } else {
            return {
                apiKey
            } as DesktopAgentDetails
        }
    }

    // this is for when the api isn't using an iframe, and just requests a port from this host directly.
    const sw = new SharedWorker(MAIN_HOST + '/src/server/SimpleServer.ts', {
        type: "module",
        name: "Demo FDC3 Server"
    })

    sw.port.start()

    const portResolver: DesktopAgentPortResolver = (o, a) => {
        if (getApproach() == Approach.IFRAME) {
            return null;
        } else {
            const sw = new SharedWorker(MAIN_HOST + '/src/server/SimpleServer.ts', {
                type: "module",
                name: "Demo FDC3 Server"
            })

            sw.port.start()
            return sw.port;
        }
    }

    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    supply(appChecker, detailsResolver, portResolver)

    // hook up the buttons
    document.getElementById("app1")?.addEventListener("click", () => launch(MAIN_HOST + "/static/app1/index.html", "1"));
    document.getElementById("app2")?.addEventListener("click", () => launch(MAIN_HOST + "/static/app2/index.html", "1"));
    document.getElementById("app3")?.addEventListener("click", () => launch(SECOND_HOST + "/static/app2/index.html", "2"));
    document.getElementById("app4")?.addEventListener("click", () => launch(MAIN_HOST + "/static/app3/index.html", "3"));

})

