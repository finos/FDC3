---
id: preloadDesktopAgents
sidebar_label: Preload Desktop Agents
title: Preload Desktop Agents (next)
---


A Preload Desktop Agent is an FDC3 Desktop Agent (DA) supporting web applications that 'inject' or 'preload' scripts into web windows which provide access to an FDC3 Desktop Agent API implementation. This document specifies the required behavior for a Preload Desktop Agent (DA).

:::info

> The [getAgent() specification in the FDC3 Web Connection Protocol](webConnectionProtocol.md) relies on Preload DAs behaving as specified in this document.

:::

## Injecting the global FDC3 object

Since FDC3 is typically available to the whole web application, Desktop Agents are expected to make the [`DesktopAgent`](../api/ref/DesktopAgent) interface available at a global level. Hence, a Preload Desktop Agent MUST provide the FDC3 API via a global accessible as `window.fdc3`. Implementors MAY additionally make the API available through modules, imports, or other means.

The global `window.fdc3` MUST only be available after the API is ready to use. Implementors MUST provide a global `fdc3Ready` event that is fired when the API is ready for use.

However, implementors SHOULD also ensure that the global is made available as soon as possible after the window is created to ensure that it can be detected by `getAgent()`. Queuing of requests to the API MAY be used to make the API available, while initialization is underway.

:::note

Prior to FDC3 2.2, apps were advised to check for the existence of the FDC3 API at `window.fdc3` and then add a listener for the `fdc3Ready` event if it was not found. This has since been superseded by the recommendation to use `getAgent()`, which handles those steps internally, alongside supporting FDC3 in web browsers ( via the [Browser Resident Desktop Agent spec](./browserResidentDesktopAgents)).

:::
