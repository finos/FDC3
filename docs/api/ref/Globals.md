---
title: Globals
---

Since FDC3 is typically available to the whole web application, desktop agents are expected to make the [`DesktopAgent`](DesktopAgent) interface available at a global level.

## `window.fdc3` Object

The global `fdc3` object can be used to access FDC3 API operations, if the current desktop agent supports FDC3.

### Example

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

### Example

```ts
function fdc3Action() {
  // Make some fdc3 API calls here
}

if (window.fdc3) {
  fdc3Action();
} else {
  window.addEventListener("fdc3Ready", fdc3Action);
}
```
