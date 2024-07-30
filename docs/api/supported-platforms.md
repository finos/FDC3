---
id: supported-platforms
title: Supported Platforms
---

FDC3 is platform- and programming language-independent. An FDC3-capable platform requires a Desktop Agent that supports the FDC3 standard, and that agent is responsible for coordinating application interactions.

There are two main categories of platform: web and native, both of which are described below. There exists a third category, hybrid, where a web application runs within the context of a standalone native application via a web view.

## Web

:::tip

The recommended way to get access to the FDC3 Desktop Agent API in an application is to to import and call the `getAgent` function from the FDC3 NPM module, which supports all standard's compliant Desktop Agents for web applications:

```ts
import { DesktopAgent, getAgent } from "@finos/fdc3";

const fdc3: DesktopAgent = await getAgent();
```

[For more details on the getAgent() function and arguments you can pass to it, see its reference page.](ref/GetAgent)

:::

For a web application to use the FDC3 API it needs to retrieve a copy of the `DesktopAgent` API interface, which it will use to communicate with the Desktop Agent (this interface is often referred to as the `fdc3` object or the "FDC3 API").

There are two standardized types of interface to a DA that a web application may use (which is appropriate depends on where the web application is run):

- **Desktop Agent Preload**: Used where the Desktop Agent is able to inject the the `DesktopAgent` API at `window.fdc3` allowing an app to access it directly, for example in an Electron app or where a browser Browser Extension is in use.
- **Desktop Agent Proxy**: Used when running in a standard web browser (without a browser extension or similar customization). The Desktop Agent will often be running in a different window or frame to the application and must be communicated with via cross-document messaging with `postMessage` and `MessagePorts` (see the [HTML5 Living Standard](https://html.spec.whatwg.org/multipage/web-messaging.html) for more details). A 'proxy' class implementing the Desktop Agent API is used to abstract the details of cross-document messaging, allowing the application to work with the FDC3 API directly.

The FDC3 Standard defines a [Web Connection Protocol (WCP)](specs/webConnectionProtocol) that allows apps to work with either interface, by detecting which is applicable. The FDC3 NPM module implements the `getAgent()` function defined by WCP and can return an injected Desktop Agent, a Desktop Agent Proxy, or other Desktop Agent implementation enabled by a non-standard interface.

Hence, FDC3 apps SHOULD obtain access to a `DesktopAgent` object (`fdc3`) by importing or loading the `@finos/fdc3` library and then calling the provided `getAgent()` function, ensuring that they can support any of the standardized interfaces.

:::note

In prior versions of FDC3 (<= 2.1) Apps were required to use the 'Desktop Agent Preload' interface, i.e. they relied on the existence of the `window.fdc3` object, which meant that apps running in a standard web browser had to import libraries specific to the Desktop Agent implementation in use. From FDC3 2.2 onwards the 'Desktop Agent Proxy' interface is available, which allows apps in a standard web browser to connect to any Desktop Agent that implements that interface.

Hence, from FDC3 2.2 onwards apps SHOULD call the `getAgent()` to retrieve a `DesktopAgent` API interface.

:::

As web applications can navigate to or be navigated by users to different URLs and become different applications, validation of apps identity is often necessary. The web application's current URL is passed to web browser-based Desktop Agents to allow them to establish the app's identity - usually connecting it with an App Directory record already known to the Desktop Agent. For more details on identity validation see the Identity Validation section of the [Web Connection Protocol (WCP)](specs/webConnectionProtocol).

### getAgent

//TODO: rewrite this section after updating getAgent docs for using URLs and param for setting window.fdc3.
//  Provide a brief introduction and link to getAgent reference


As Web applications can navigate (or be navigated by users) to different URLs and become different application, apps MUST pass details of their identity to `getAgent()`. This can be done in one of two ways.

1. Provide an appId field

    The appId SHOULD be _fully qualified_ (containing a domain name). The DA will then use this to construct a query to AppD endpoint rules. For instance, this will result in a query to "https://yourorg.org/v2/apps/yourApp".

    Example: Obtaining an fdc3 interface
    
    ```js
    import { getAgent } from "@finos/fdc3";

    try {
        const fdc3 = await getAgent({ appId: “yourApp@yourorg.org” }); 
    } catch (e) {
        // Failed to connect
    }
    ```

2. Provide an appDUrl field

    As an alternative to providing a fully qualified appId, apps MAY provide an `appDUrl` field that contains a link to an AppD definition for the app.

    Example: Obtaining an fdc3 interface using an AppD locator
    ```JavaScript
    try {
        const fdc3 = await getAgent({ appDUrl: 'https://yourorg.org/appd/v2/apps/yourApp' }); 
    } catch (e) {
        // console.log(e); // Failed to connect
    }
    ```

3. Provide a both appId and appDUrl fields

    The DA will construct the AppD query according to AppD endpoint rules. For instance, this will result in a query to "https://yourorg.org/appd/v2/apps/yourApp".

    Example: Obtaining an fdc3 interface using an AppD locator
    
    ```js
    try {
        const fdc3 = await getAgent({ appId: "yourApp", appDUrl: 'https://yourorg.org/appd' }); 
    } catch (e) {
        // console.log(e); // Failed to connect
    }
    ```

Applications MAY provide additional fields related to configuration or failover support. See [GetAgentParams](ref/GetAgent) for those options.

> Note: Applications SHOULD provide visual feedback to users indicating that the app is in the process of connecting. Once the FDC3 interface is accessible the application SHOULD update that visual feedback.








### Usage

There are two main ways FDC3 can be used from web applications:

#### 1. Direct Usage

Simply rely on the global object being made available by your Desktop Agent, and address the API directly:

```js
function sendData() {
  window.fdc3.broadcast({
    type: 'fdc3.instrument',
    id: { ticker: 'AAPL' }
  })
}

if (window.fdc3) {
  sendData();
} else {
  window.addEventListener("fdc3Ready", sendData);
}
```

#### 2. NPM Wrapper

FDC3 offers the [`@finos/fdc3` npm package](https://www.npmjs.com/package/@finos/fdc3) that can by used by web applications to target operations from the [API Specification](api/spec) in a consistent way. Each FDC3-compliant Desktop Agent that the application runs in, can then provide an implementation of the FDC3 API operations.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="npm" label="npm">

```bash
npm install @finos/fdc3
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @finos/fdc3
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm install @finos/fdc3
```

</TabItem>
</Tabs>

The npm package provides a wrapper around FDC3, allowing you to use it with ES6 import syntax:

```javascript
import * as fdc3 from '@finos/fdc3';

await fdc3.raiseIntent('ViewAnalysis', {
    type: 'fdc3.instrument',
    id: { ticker: 'AAPL' }
});
```

It also includes a helper function you can use to wait for FDC3 to become available:

```javascript
import { fdc3Ready, addIntentListener } from '@finos/fdc3'

await fdc3Ready();

const listener = await addIntentListener('ViewAnalysis', instrument => {
  // handle intent
});
```

## Native

The FDC3 Standard does not currently define wire formats for an app to communicate with a Desktop Agent, nor does it define language specific API bindings, other than JavaScript and TypeScript. Hence, for a native application to be FDC3-enabled, it needs to either:

- Make use of a shared library (such as a .NET DLL or JAR file) that provides it with an implementation of the FDC3 API (which ties it to a specific Desktop Agent implementation).
- Model itself as a Desktop Agent (rather than just an app working with one) and use the Agent Bridging protocol to connect to a Desktop Agent Bridge and work through it to interoperate with apps managed by other Desktop Agents.

## Hybrid

In a hybrid application, a standalone native application incorporates a web view, within which a web application runs. This may be considered a special case of the web platform where all platform-provider requirements for web applications must be satisfied, but it is the responsibility of the associated native application, rather than a platform provider, to ensure they are fulfilled. This may be achieved via either of the defined web interfaces, i.e. by injecting an implementation of the DesktopAgent API at `window.fdc3` or via the FDC3 Web Connection Protocol (`postMessage`).

## Compliance

Support for each platform is optional and compliance with the FDC3 standard should be assessed for each platform implemented independently of any other, with the exception of ensuring that where applications running on multiple platforms are used together, communication between them still complies with the standard.

The Web API binding is expressed using TypeScript syntax that defines the API interface (for both TypeScript and JavaScript). Adherence to the specific binding is required for Web application platforms. No specific API binding for native platforms is currently expressed in the Standard. Hence, native applications may be implemented with any programming language binding that supports the constructs required by the API specification, until such time that the FDC3 Standard introduces an appropriate language-specific binding.
