---
title: Supported Platforms
---

FDC3 is platform- and programming language-independent. An FDC3-capable platform requires a Desktop Agent that supports the FDC3 standard, and that agent is responsible for coordinating application interactions.

There are two main categories of platform: web and native, both of which are described below. There exists a third category, hybrid, where a web application runs within the context of a standalone native application via a web view.

## Web

For a web application to be FDC3-enabled, it needs to run in the context of an environment or **_Platform Provider_** that makes the FDC3 API available to the application. This environment could be a browser extension, a web or native app, or fully-fledged desktop container framework.

### Installation

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

### Usage

```javascript
import * as fdc3 from '@finos/fdc3'

// declare FDC3-compliant data
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL',
        ISIN: 'US0378331005',
        FIGI : 'BBG000B9XRY4'
    }
}

// invoke an action in another application, with the required data
const result = await fdc3.raiseIntent('ViewAnalysis', instrument)

// join the red channel and broadcast data to subscribers
await fdc3.joinChannel('red')
fdc3.broadcast(instrument)

// set up a listener for incoming data
const listener = fdc3.addContextListener('fdc3.contact', contact => { })
```

For details about the available API operations, see the [API Referennce](api/ref/DesktopAgent).

## Native

The FDC3 standard does not define wire formats for communication, nor does it define language specific API bindings, other than JavaScript and TypeScript. Hence, for a native application to be FDC3-enabled, it needs to make use of a shared library (such as a .NET DLL or JAR file) that provides it with an implementation of the FDC3 API. Therefore, an FDC3-enabled native application is currently specific to a particular desktop container framework (or other suitable environment) that provides the necessary library.

Despite this limitation, implementing support for FDC3 in a native application can allow it to interact with a wide variety of FDC3-enabled web applications.

## Hybrid
In a hybrid application, a standalone native application incorporates a web view, within which a web application runs. This may be considered a special case of the web platform where all platform-provider requirements for web applications must be satisfied, but it is the responsibility of the associated native application, rather than a platform provider, to ensure they are fulfilled. This may be achieved, for example, by injecting an implementation of the DesktopAgent API and ensuring that it is accessible at the usual location, `window.fdc3`.

## Compliance
Support for each platform is optional and compliance with the FDC3 standard should be assessed for each platform implemented independently of any other, with the exception of ensuring that where applications running on multiple platforms are used together, communication between them still complies with the standard.

The Web API binding is expressed using TypeScript syntax that defines the API interface (for both TypeScript and JavaScript). Adherence to the specific binding is required for Web application platforms. No specific API binding for native platforms is currently expressed in the standard. Hence, Native applications may be implemented with any programming language binding that supports the constructs required by the API specification, until such time that the FDC3 standard introduces an appropriate language-specific binding.