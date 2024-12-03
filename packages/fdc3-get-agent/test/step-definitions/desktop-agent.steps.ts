import { After, DataTable, Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { handleResolve, setupGenericSteps } from '@kite9/testing';
import { MockDocument } from '../support/MockDocument';
import { MockWindow } from "../support/MockWindow";
import { fdc3Ready, getAgent } from '../../src';
import { DesktopAgentDetails, GetAgentParams, WebDesktopAgentType } from '@kite9/fdc3-standard';
import { dummyInstanceId, EMBED_URL, MockFDC3Server } from '../support/MockFDC3Server';
import { MockStorage } from '../support/MockStorage';
import { DesktopAgent, ImplementationMetadata } from '@kite9/fdc3-standard';
import { DESKTOP_AGENT_SESSION_STORAGE_DETAILS_KEY } from '../../src/messaging/AbstractWebMessaging';
import { clearAgentPromise, getAgentPromise } from '../../src/strategies/getAgent';
import expect from 'expect';

setupGenericSteps()
Given('Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response', async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this)
    this.mockFDC3Server = new MockFDC3Server(mockWindow as any, false, this.mockContext)
    this.props[field] = this.mockFDC3Server
    this.mockContext.open(dummyInstanceId.appId)
})

Given('Parent Window desktop {string} listens for postMessage events in {string}, returns iframe response', async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this)
    this.mockFDC3Server = new MockFDC3Server(mockWindow as any, true, this.mockContext)
    this.props[field] = this.mockFDC3Server
    this.mockContext.open(dummyInstanceId.appId)
})

Given('{string} is a function which opens an iframe for communications on {string}', function (this: CustomWorld, fn: string, doc: string) {
    this.props[fn] = () => {
        this.mockContext.open(dummyInstanceId.appId)
        const document = handleResolve(doc, this) as MockDocument
        var ifrm = document.createElement("iframe")
        this.mockFDC3Server = new MockFDC3Server(ifrm as any, false, this.mockContext)
        ifrm.setAttribute("src", EMBED_URL + "?connectionAttemptUuid=123")
        document.body.appendChild(ifrm)
        return ifrm
    }
});

Given('an existing app instance in {string}', async function (this: CustomWorld, field: string) {
    const uuid = this.mockContext.open(dummyInstanceId.appId)
    this.props[field] = uuid
})


Given('A Dummy Desktop Agent in {string}', async function (this: CustomWorld, field: string) {

    const da: DesktopAgent = {
        async getInfo(): Promise<ImplementationMetadata> {
            return {
                fdc3Version: "2.0",
                appMetadata: {
                    appId: "cucumber-app"
                },
                provider: "cucumber-provider"
            } as any
        }
    } as any

    this.props[field] = da
    this.props['result'] = null
})

Given('`window.fdc3` is injected into the runtime with the value in {string}', async function (this: CustomWorld, field: string) {
    const object = handleResolve(field, this)
    window.fdc3 = object
    window.dispatchEvent(new Event('fdc3.ready'))
});

When('I call getAgent for a promise result', function (this: CustomWorld) {
    try {
        this.props['result'] = getAgent()
    } catch (error) {
        this.props['result'] = error
    }
})

When('I call fdc3Ready for a promise result', function (this: CustomWorld) {
    try {
        this.props['result'] = fdc3Ready()
    } catch (error) {
        this.props['result'] = error
    }
})

After(function (this: CustomWorld) {
    // Clean up
    clearAgentPromise()
})

When('I call getAgent for a promise result with the following options', function (this: CustomWorld, dt: DataTable) {
    try {
        const first = dt.hashes()[0]
        const toArgs = Object.fromEntries(Object.entries(first)
            .map(([k, v]) => {
                const val = handleResolve(v, this)
                const val2 = isNaN(val) ? val : Number(val)
                const val3 = val2 === "true" ? true : val2 === "false" ? false : val2
                return [k, val3]
            })
        )
        this.props['result'] = getAgent(toArgs as GetAgentParams)
    } catch (error) {
        this.props['result'] = error
    }
})

Given('a browser document in {string} and window in {string}', async function (this: CustomWorld, d: string, w: string) {
    // creates the mock app window
    const mw = new MockWindow("mockWindow", this, "mocky")
    globalThis.window = mw as any
    this.props[w] = globalThis.window;

    // to keep it simple, mock app window parent is set to itself, to avoid excess routing
    mw.parent = mw;

    // mock document exists in the window
    globalThis.document = new MockDocument("mockDocument", mw) as any
    this.props[d] = globalThis.document as any;

    // browser storage
    globalThis.sessionStorage = new MockStorage() as any

})

Given("the session identity is set to {string}", async function (this: CustomWorld, id: string) {
    const details: DesktopAgentDetails = {
        agentType: WebDesktopAgentType.ProxyParent,
        instanceUuid: handleResolve(id, this),
        appId: 'cucumber-app',
        instanceId: 'uuid-0'
    }

    globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_DETAILS_KEY + "-mocky", JSON.stringify(details))
})

When("{string} pagehide occurs", async function (this: CustomWorld, field: string) {
    const window: MockWindow = handleResolve(field, this)
    window.dispatchEvent(new Event('pagehide'))
})

When("theAgentPromise is cleared", async function (this: CustomWorld) {
    expect(getAgentPromise()).toBeNull()
})