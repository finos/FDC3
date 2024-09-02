---
id: supported-platforms
title: Supported Platforms
---

FDC3 is platform- and programming language-independent. An FDC3-capable platform requires a Desktop Agent that supports the FDC3 standard, and that agent is responsible for coordinating application interactions.

There are two main categories of platform: web and native, both of which are described below. There exists a third category, hybrid, where a web application runs within the context of a standalone native application via a web view.

## Web

For a web application to be FDC3-enabled, it needs to run in the context of an environment or **_Platform Provider_** that makes the FDC3 API available to the application. This environment could be a browser extension, a web or native app, or a fully-fledged desktop container framework.

### API Access & Globals

The FDC3 API can be made available to an application through a number of different methods.  In the case of web applications, a Desktop Agent MUST provide the FDC3 API via a global accessible as `window.fdc3`. Implementors MAY additionally make the API available through modules, imports, or other means.

The global `window.fdc3` must only be available after the API is ready to use. To enable applications to avoid using the API before it is ready, implementors MUST provide a global `fdc3Ready` event that is fired when the API is ready for use. Implementations should first check for the existence of the FDC3 API and add a listener for this event if it is not found:

```ts
function fdc3Action() {
  // Make some fdc3 API calls here
}

if (window.fdc3) {
  fdc3Action();
} else {
  window.addEventListener('fdc3Ready', fdc3Action);
}
```

Since FDC3 is typically available to the whole web application, Desktop Agents are expected to make the [`DesktopAgent`](DesktopAgent) interface available at a global level.

The global `window.fdc3` should only be available after the API is ready to use. To prevent the API from being used before it is ready, implementors should provide an `fdc3Ready` event.

### Usage

There are two main ways FDC3 can be used from web applications:

#### 1. Direct Usage

Simply rely on the global object being made available by your desktop agent, and address the API directly:

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

FDC3 offers the [`@finos/fdc3` npm package](https://www.npmjs.com/package/@finos/fdc3) that can be used by web applications to target operations from the [API Specification](api/spec) in a consistent way. Each FDC3-compliant desktop agent that the application runs in, can then provide an implementation of the FDC3 API operations.

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

### .NET

For a .NET application to be FDC3-enabled, it needs to run in the context of a platform provider that makes the FDC3 API available.  The manner in which you get a reference to the desktop agent can be highly dependent on the provider chosen.  For those looking to implement your own desktop agent, a recommended and typical design is to register an instance of the desktop agent at startup which can be injected into any class constructors that need references through inversion of control.  More details for creating your own DesktopAgent can be found in the [fdc3-dotnet repository](https://github.com/finos/fdc3-dotnet).

#### Usage

FDC3 offers the [`Finos.Fdc3` NuGet package](https://www.nuget.org/packages/Finos.Fdc3) that can be used by .NET applications to target operations from the [API Specification](api/spec) in a consistent way. Each FDC3-compliant desktop agent that the application runs in, can then provide an implementation of the FDC3 API operations.


## Hybrid

In a hybrid application, a standalone native application incorporates a web view, within which a web application runs. This may be considered a special case of the web platform where all platform-provider requirements for web applications must be satisfied, but it is the responsibility of the associated native application, rather than a platform provider, to ensure they are fulfilled. This may be achieved, for example, by injecting an implementation of the DesktopAgent API and ensuring that it is accessible at the usual location, `window.fdc3`.

## Compliance

Support for each platform is optional and compliance with the FDC3 standard should be assessed for each platform implemented independently of any other, with the exception of ensuring that where applications running on multiple platforms are used together, communication between them still complies with the standard.

The Web API binding is expressed using TypeScript syntax that defines the API interface (for both TypeScript and JavaScript). Adherence to the specific binding is required for Web application platforms. No specific API binding for native platforms is currently expressed in the Standard. Hence, native applications may be implemented with any programming language binding that supports the constructs required by the API specification, until such time that the FDC3 Standard introduces an appropriate language-specific binding.
