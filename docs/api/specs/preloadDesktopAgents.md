---
id: preloadDesktopAgents
sidebar_label: Preload Desktop Agents
title: Preload Desktop Agents (next)
---


> Note - The [getAgent() specification in the  FDC3 Web Connection Protocol](webConnectionProtocol.md) relies on Preload DAs behaving as specified in this document. FDC3 apps are now encouraged to use `getAgent()` instead of relying on the existence of the global object.

## Injecting the global FDC3 object

A Preload Desktop Agent MUST provide the FDC3 API via a global accessible as `window.fdc3`. Implementors MAY additionally make the API available through modules, imports, or other means.

The global `window.fdc3` must only be available after the API is ready to use. To enable applications to avoid using the API before it is ready, implementors MUST provide a global `fdc3Ready` event that is fired when the API is ready for use. Implementations should first check for the existence of the FDC3 API and add a listener for this event if it is not found:

```js
function fdc3Action() {
  // Make some fdc3 API calls here
}

if (window.fdc3) {
  fdc3Action();
} else {
  window.addEventListener('fdc3Ready', fdc3Action);
}
```

Since FDC3 is typically available to the whole web application, Desktop Agents are expected to make the [`DesktopAgent`](../api/ref/DesktopAgent) interface available at a global level.

The global `window.fdc3` SHOULD only be available after the API is ready to use. To prevent the API from being used before it is ready, implementors SHOULD provide an `fdc3Ready` event.

## validateAppIdentity()

In order to handle navigation events, Preload DAs SHOULD provide a `validateAppIdentity()` function on the global `fdc3` object (DesktopAgent interface). This function should behave the same as documented in the [Browser Resident DA Authentication Step](./browserResidentDesktopAgents.md#step-2---authentication), allowing the same combinations of appId and appDUrl as are allowed by `getAgent()`.

Example:

```js
const { instanceUuid, instanceId } = await fdc3.validateAppIdentity({
    appId: "yourApp@yourOrg.com",
    instanceUuid: "some generated uuid"
});
```

The function should reject with an error string if the app identity does not match what is expected.

If a Preload DA does not provide the validateAppIdentity() function this it assumes responsibility for handling navigation and refresh events.
