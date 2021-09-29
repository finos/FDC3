---
title: Supported Platforms
id: version-1.2-supported-platforms
original_id: supported-platforms
---

As an open standard, FDC3 can be implemented on any platform and in any language.

All that is required is a "desktop agent" that supports the FDC3 standard, which is responsible for co-ordinating application interactions.

## Web

For web applications to be FDC3-enabled, they need to run in the context of an agent that makes the FDC3 API available to the application. This desktop agent is also responsible for lauching and co-ordinating applications. It could be a browser extension, web app, or full-fledged desktop container framework.

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

The FDC3 standard does not define wire formats for communication. Hence, for native applications to be FDC3-enabled, they need to make use of a library (e.g. a DLL in .Net or JAR file in Java) that provides them with an implementation of the FDC3 API. FDC3-enabled native applications are therefore specific to particular desktop container frameworks (or other suitable environments) that provide the necessary libraries.

Despite this limitation, implementing support for FDC3 in a native application can allow it to interact with a wide variety of FDC3-enabled web applications.
