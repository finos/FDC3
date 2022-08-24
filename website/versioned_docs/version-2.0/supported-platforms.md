---
id: version-2.0-supported-platforms
title: Supported Platforms
original_id: supported-platforms
---

FDC3 is platform- and programming language-independent. An FDC3-capable platform requires a Desktop Agent that supports the FDC3 standard, and that agent is responsible for coordinating application interactions.

There are two main categories of platform: web and native, both of which are described below. There exists a third category, hybrid, where a web application runs within the context of a standalone native application via a web view.

## Web

For a web application to be FDC3-enabled, it needs to run in the context of an environment or **_Platform Provider_** that makes the FDC3 API available to the application. This environment could be a browser extension, a web or native app, or fully-fledged desktop container framework.

### Usage

There are two main ways FDC3 can be used from web applications:

#### 1. Direct Usage

Simply rely on the global object being made available by your desktop agent, and address the API directly:

```javascript
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
FDC3 offers the [`@finos/fdc3` npm package](https://www.npmjs.com/package/@finos/fdc3) that can by used by web applications to target operations from the [API Specification](api/spec) in a consistent way. Each FDC3-compliant desktop agent that the application runs in, can then provide an implementation of the FDC3 API operations.

<!--DOCUSAURUS_CODE_TABS-->
<!--npm -->

```sh
npm install @finos/fdc3
```
<!--yarn-->

```sh
yarn add @finos/fdc3
```

<!--pnpm-->

```sh
pnpm install @finos/fdc3
```

<!--END_DOCUSAURUS_CODE_TABS-->

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

##### See also
* [`fdc3Ready() Function`](api/ref/Globals#fdc3ready-function)

## Native

The FDC3 standard does not define wire formats for communication, nor does it define language specific API bindings, other than JavaScript and TypeScript. Hence, for a native application to be FDC3-enabled, it needs to make use of a shared library (such as a .NET DLL or JAR file) that provides it with an implementation of the FDC3 API. Therefore, an FDC3-enabled native application is currently specific to a particular desktop container framework (or other suitable environment) that provides the necessary library.

Despite this limitation, implementing support for FDC3 in a native application can allow it to interact with a wide variety of FDC3-enabled web applications.

## Hybrid
In a hybrid application, a standalone native application incorporates a web view, within which a web application runs. This may be considered a special case of the web platform where all platform-provider requirements for web applications must be satisfied, but it is the responsibility of the associated native application, rather than a platform provider, to ensure they are fulfilled. This may be achieved, for example, by injecting an implementation of the DesktopAgent API and ensuring that it is accessible at the usual location, `window.fdc3`.

## Compliance
Support for each platform is optional and compliance with the FDC3 standard should be assessed for each platform implemented independently of any other, with the exception of ensuring that where applications running on multiple platforms are used together, communication between them still complies with the standard.

The web API binding is expressed using TypeScript syntax that defines the API interface (for both TypeScript and JavaScript). Adherence to the specific binding is required for web application platforms. No specific API binding for native platforms is currently expressed in the standard. Hence, native applications may be implemented with any programming language binding that supports the constructs required by the API specification, until such time that the FDC3 standard introduces an appropriate language-specific binding.