---
id: overview
sidebar_label: API Overview
title: API Overview
hide_title: true
---
# API Overview

The API specification of the FDC3 standard support the following goals:
- Create a consistent developer interface for working with FDC3
- Standardize interfaces for reference implementations
- Standardize interfaces between desktop agents

The role of FDC3 API specification is to establish a baseline interface for interoperability between applications. Because FDC3 is largely an agreement between existing platforms and applications - standards should be optimized for ease of adoption rather than functional completeness. Functionality absent from a FDC3 specification is in no way a commentary on its importance.

The focus of the FDC3 Standard Working Group has been to create a small but consistent API, the following docs go through the components and API's in detail.

## Key Elements

- [`window.fdc3`](ref/Globals#windowfdc3-object) global object and [`fdc3Ready`](ref/Globals#fdc3ready-event) event, for accessing FDC3 operations globally
- [`DesktopAgent`](ref/DesktopAgent) interface, which exposes FDC3 operations
- [`Channel`](ref/Channel) interface, for subscribing to specific context channels
- [`Listener`](ref/Listener) interface, which allows unsubscribing intent or context listeners

## Usage

There are two main ways FDC3 can be used from web applications:

### 1. Direct Usage

Simply rely on the global object being made available by your desktop agent, and address the API directly:

```ts
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


### 2. NPM Wrapper

The [`@finos/fdc3` npm package](https://www.npmjs.com/package/@finos/fdc3) provides a wrapper around FDC3, allowing you to use it with ES6 import syntax:

```ts
import * as fdc3 from '@finos/fdc3'

async function fdc3Action() {
  // all asynchronous function will implicitly check if window.fdc3 is defined,
  // and wait for the fdc3Ready event if it isn't (with a default timeout of 5 seconds)
  await fdc3.raiseIntent('ViewAnalysis', {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' }
  })
}
```

Alternatively you can also import individual operations directly:

```ts
import { fdc3Ready, addIntentListener } from '@finos/fdc3'

async function fdc3Action() {
  // for synchronous functions, like broadcast or adding a listener, it is recommend to wait for fdc3 to be ready yourself,
  // as the synchronous function can only check if window.fdc3 is defined, and throw if it isn't
  await fdc3Ready();
  const listener = addIntentListener('ViewAnalysis', instrument => {
    console.log('View analysis for ' + instrument.id.ticker);
  })
}
```

#### See also
* [`fdc3Ready() Function`](ref/Globals#fdc3ready-function)



