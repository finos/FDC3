---
id: supported-platforms
title: Supported Platforms
---

FDC3 is platform- and programming language-independent. An FDC3-capable platform requires a Desktop Agent that supports the FDC3 standard, and that agent is responsible for coordinating application interactions.

There are two main categories of platform: web and native, both of which are described below. There exists a third category, hybrid, where a web application runs within the context of a standalone native application via a web view.

## Web

:::tip

The recommended way to get access to the FDC3 Desktop Agent API in an application is to to import and call the `getAgent` function from the FDC3 NPM module, which supports all FDC3 Standard conformant Desktop Agents for web applications:

```ts
import { DesktopAgent, getAgent, AgentError } from "@finos/fdc3";

//...

try {
    const desktopAgent: DesktopAgent = await getAgent();
    //do FDC3 things here
} catch (e: AgentError) {
    //connection failed
}

//OR

getAgent().then((desktopAgent: DesktopAgent) => {
    //do FDC3 things here
}).catch((e: AgentError) => {
    //connection failed
});
```

[For more details on the getAgent() function and arguments you can pass to it, see its reference page.](ref/GetAgent)

:::

For a web application to use the FDC3 API it needs to retrieve a copy of the `DesktopAgent` API interface, which it will use to communicate with the Desktop Agent (this interface is often referred to as the `fdc3` object or the "FDC3 API"). FDC3 offers the [`@finos/fdc3` npm package](https://www.npmjs.com/package/@finos/fdc3) that can be used by web applications to retrieve a `DesktopAgent` interface and to provide typing. Each FDC3-compliant Desktop Agent that the application runs in, can then provide an implementation of the FDC3 API operations.

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

There are two standardized types of interface to a DA that a web application may use (which is appropriate depends on where the web application is run):

- **Desktop Agent Preload**: Used where the Desktop Agent is able to inject the the `DesktopAgent` API at `window.fdc3` allowing an app to access it directly, for example in an Electron app or where a browser Browser Extension is in use.
- **Desktop Agent Proxy**: Used when running in a standard web browser (without a browser extension or similar customization). The Desktop Agent will often be running in a different window or frame to the application and MUST be communicated with via cross-document messaging with `postMessage` and `MessagePorts` (see the [HTML5 Living Standard](https://html.spec.whatwg.org/multipage/web-messaging.html) for more details). A 'proxy' class implementing the Desktop Agent API is used to abstract the details of cross-document messaging, allowing the application to work with the FDC3 API directly.

The FDC3 Standard defines a [Web Connection Protocol (WCP)](specs/webConnectionProtocol) that allows apps to work with either interface, by detecting which is applicable, and [Desktop Agent Communication Protocol (DACP)](../specs/desktopAgentCommunicationProtocol) that standardizes the messaging protocol used for cross-document messaging over `postMessage` and `MessagePorts` in a web browser.

The FDC3 NPM module implements the `getAgent()` function defined by WCP and can return an injected Desktop Agent, a Desktop Agent Proxy, or other Desktop Agent implementation enabled by a non-standard interface.

Hence, FDC3 apps SHOULD obtain access to a `DesktopAgent` object (`fdc3`) by importing or loading the `@finos/fdc3` library and then calling the provided `getAgent()` function, ensuring that they can support any of the standardized interfaces.

:::info

In prior versions of FDC3 (<= 2.1) Apps were required to use the 'Desktop Agent Preload' interface, i.e. they relied on the existence of the `window.fdc3` object, which meant that apps running in a standard web browser had to import libraries specific to the Desktop Agent implementation in use. From FDC3 2.2 onwards the 'Desktop Agent Proxy' interface is available, which allows apps in a standard web browser to connect to any Desktop Agent that implements that interface.

Hence, from FDC3 2.2 onwards apps SHOULD call `getAgent()` to retrieve a `DesktopAgent` API interface.

:::

As web applications can navigate to or be navigated by users to different URLs and become different applications, validation of apps identity is often necessary. The web application's current URL is passed to web browser-based Desktop Agents to allow them to establish the app's identity - usually connecting it with an App Directory record already known to the Desktop Agent. For more details on identity validation see the Identity Validation section of the [Web Connection Protocol (WCP)](specs/webConnectionProtocol).

### Usage

Once you've retrieved a `DesktopAgent` interface you may use its functions to communicate with the Desktop Agent and through it, other applications:

```js
import { DesktopAgent, getAgent } from "@finos/fdc3";

async function sendData(desktopAgent: DesktopAgent) {
  await desktopAgent.broadcast({
    type: "fdc3.instrument",
    id: { ticker: "AAPL" }
  });
}

const desktopAgent: DesktopAgent = await getAgent();
await sendData(desktopAgent);
```

## Native

The FDC3 Standard currently only defines language specific API bindings for JavaScript/TypeScript and .NET, but is intended to be implemented in other languages (which can make use of the [Desktop Agent Communication Protocol (DACP)](../specs/desktopAgentCommunicationProtocol) as a wire protocol, but need to define a suitable connection protocol, which includes a defined communication channel to do so).  

Hence, for a native application to be FDC3-enabled, it needs to either:

- Make use of a shared library (such as a .NET DLL or JAR file) that provides it with an implementation of the FDC3 API (which ties it to a specific Desktop Agent implementation).
- Model itself as a Desktop Agent (rather than just an app working with one) and use the Agent Bridging protocol to connect to a Desktop Agent Bridge and work through it to interoperate with apps managed by other Desktop Agents.

### .NET

For a .NET application to be FDC3-enabled, it needs to run in the context of a platform provider that makes the FDC3 API available.  The manner in which you get a reference to the desktop agent can be highly dependent on the provider chosen.  For those looking to implement your own desktop agent, a recommended and typical design is to register an instance of the Desktop Agent at startup which can be injected into any class constructors that need references through inversion of control.  More details for creating your own DesktopAgent can be found in the [fdc3-dotnet repository](https://github.com/finos/fdc3-dotnet).

#### Usage

FDC3 offers the [`Finos.Fdc3` NuGet package](https://www.nuget.org/packages/Finos.Fdc3) that can be used by .NET applications to target operations from the [API Specification](./spec) in a consistent way. Each FDC3-compliant desktop agent that the application runs in, can then provide an implementation of the FDC3 API operations.

## Hybrid

In a hybrid application, a standalone native application incorporates a web view, within which a web application runs. This may be considered a special case of the web platform where all platform-provider requirements for web applications must be satisfied, but it is the responsibility of the associated native application, rather than a platform provider, to ensure they are fulfilled. This may be achieved via either of the defined web interfaces, i.e. by injecting an implementation of the DesktopAgent API at `window.fdc3` or via the FDC3 Web Connection Protocol (`postMessage`).

## Compliance

Support for each platform is optional and compliance with the FDC3 standard should be assessed for each platform implemented independently of any other, with the exception of ensuring that where applications running on multiple platforms are used together, communication between them still complies with the standard.

The Web API binding is expressed using TypeScript syntax that defines the API interface (for both TypeScript and JavaScript). Adherence to the specific binding is required for Web application platforms. No specific API binding for native platforms is currently expressed in the Standard. Hence, native applications may be implemented with any programming language binding that supports the constructs required by the API specification, until such time that the FDC3 Standard introduces an appropriate language-specific binding.
