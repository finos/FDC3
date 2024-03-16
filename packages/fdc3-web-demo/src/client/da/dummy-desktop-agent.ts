import { AppIdentifier } from "@finos/fdc3";
import { AppChecker, DesktopAgentDetailResolver, DesktopAgentDetails, DesktopAgentPortResolver } from "fdc3-common";
import { supply } from "da-server/src/supply/post-message";
import { MAIN_HOST, SECOND_HOST, WORKBENCH_HOST } from "./constants";
import { io } from "socket.io-client"
import { v4 as uuid } from 'uuid'
import { link } from "./constants";
import { APP_HELLO, DA_HELLO } from "../../common";

enum Opener { Tab, Frame, Nested }

enum Approach { IFRAME, PARENT_POST_MESSAGE }

window.addEventListener("load", () => {

    let currentInstance = 0;
    let currentApiInstance = 0;
    let desktopAgentUUID = uuid()

    type AppRegistration = {
        appId: AppIdentifier,
        window: Window
        url: string
    }

    const instances: AppRegistration[] = []

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
            appId: {
                appId,
                instanceId: "" + instance
            },
            window: w,
            url: w.location.href
        })
    }

    // for a given window, allows us to determine which app it is (if any)
    const appChecker: AppChecker = o => instances.find(i => i.window == o)?.appId

    // this is for when the API is using an iframe, and needs to know the address to load
    const detailsResolver: DesktopAgentDetailResolver = (o: Window, a: AppIdentifier) => {
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

    const socket = io()

    socket.on("connect", () => {
        socket.emit(DA_HELLO, desktopAgentUUID)
    })


    const portResolver: DesktopAgentPortResolver = (o: Window, a: AppIdentifier) => {
        if (getApproach() == Approach.IFRAME) {
            return null;
        } else {
            const channel = new MessageChannel()
            const socket = io()

            socket.on("connect", () => {
                console.log("Server creating socket")
                link(socket, channel)
                socket.emit(APP_HELLO, desktopAgentUUID, a)
            })


            return channel.port1;
        }
    }

    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    supply(appChecker, detailsResolver, portResolver)

    // hook up the buttons
    document.getElementById("app1")?.addEventListener("click", () => launch(MAIN_HOST + "/static/app1/index.html", "1"));
    document.getElementById("app2")?.addEventListener("click", () => launch(MAIN_HOST + "/static/app2/index.html", "1"));
    document.getElementById("app3")?.addEventListener("click", () => launch(SECOND_HOST + "/static/app2/index.html", "2"));
    document.getElementById("app4")?.addEventListener("click", () => launch(MAIN_HOST + "/static/app3/index.html", "3"));
    document.getElementById("workbench")?.addEventListener("click", () => launch(WORKBENCH_HOST + "/toolbox/fdc3-workbench/index.html", "3"));

})

