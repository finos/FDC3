---
title: Globals
---

Since FDC3 is typically available to the whole web application, desktop agents are expected to make the [`DesktopAgent`](DesktopAgent) interface available at a global level.

## `window.fdc3` Object

The global `fdc3` object can be used to access FDC3 API operations, if the current desktop agent supports FDC3.

**Example:**

```ts
// check if fdc3 is available
if (window.fdc3) {
  // raise an intent
  await window.fdc3.raiseIntent('StartChat', {
    type: 'fdc3.contact',
    id: { email: 'johndoe@mail.com' }
  })
}
```

## `fdc3Ready` Event

The global `window.fdc3` should only be available after the API is ready to use. To prevent the API from being used before it is ready, implementors should provide an `fdc3Ready` event.

**Example:**

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

## `fdc3Ready()` Function

If you are using the `@finos/fdc3` NPM package, it includes a handy wrapper function that will check for the existence of `window.fdc3` and wait on the `fdc3Ready` event for you.

It returns a promise that will resolve immediately if the `window.fdc3` global is already defined, or reject with an error if the `fdc3Ready` event doesn't fire after a specified timeout period (default: 5 seconds).

**Example:**

```ts
import { fdc3Ready, broadcast } from '@finos/fdc3'

async function fdc3Action() {
  try {
    await fdc3Ready(1000); // wait for (at most) 1 second
    broadcast({
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' }
    })
  } catch (error) {
    // handle error
  }
}
```
