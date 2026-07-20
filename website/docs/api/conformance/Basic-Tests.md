---
id: Basic-Tests
sidebar_label: Basic Tests
title: Basic Tests
hide_title: true
---

# Basic Tests
<!-- markdownlint-disable MD033 -->

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

## Connection

![2.2+](https://img.shields.io/badge/FDC3-2.2+-purple) In FDC3 2.2, a new interface was introduced to support Browser-based FDC3 Desktop Agents, known as a 'Desktop Agent Proxy', and a new [`getAgent`](../ref/GetAgent) API call was introduced to all apps to retrieve the Desktop Agent API via that interface or the existing 'Desktop Agent Preload' interface. This test pack checks that the a connection is made correctly via `getAgent`.

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | `getAgent`      | App A calls `getAgent` and waits for the promise to resolve to a `DesktopAgent` instance. |
| A   | `getInfo`       | App A can call the `getInfo()` method on the `DesktopAgent` instance to get the `ImplementationMetadata` object. <br /> Check that fdc3Version is set to 2.x.  <br />Check that provider and providerVersion are populated. |
| A   | `getUserChannels`| App A can call the `getUserChannels()` method on the `DesktopAgent` instance to get the `Channel` objects representing the system channels.<br />Check **user** channels are returned.|

- `GetAgentAPI`: ![2.2+](https://img.shields.io/badge/FDC3-2.2+-purple) Perform the above test.

## Basic API Usage

- `BasicCL1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): A context listener can be created for a specific context type by calling `fdc3.addContextListener("fdc3.contact",<handler>)`.  A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicCL2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): An **unfiltered** context listener can be created by calling `fdc3.addContextListener(null,<handler>)`.  A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicIL1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): An intent listener can be created for a specific intent by calling `fdc3.addIntentListener(<intentName>,<handler>)`. A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicGI1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): An `ImplementationMetadata` object can be retrieved, to find out the version of FDC3 that is in use along with details of the provider, by calling:
  - `await fdc3.getInfo()`. The FDC3 version should match the API version being tested for conformance.
- `BasicAC1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): A named 'App' channel can be retrieved by calling `fdc3.getOrCreateChannel(<name>)`. The `Channel` object returned conforms to the defined interface.
- `BasicUC1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): The list available user/system channels can be retrieved, as an array of `Channel` Objects conforming to the defined interface, by calling `await fdc3.getUserChannels()`.
- `BasicJC1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): A user/system channel can be joined with the with the channel's id by calling `fdc3.joinUserChannel(<channelId>)`.  Having done so, the current channel, retrieved by calling `fdc3.getCurrentChannel()` should NOT be null and should match _the channel id given_.  After leaving the current channel by calling `fdc3.leaveCurrentChannel()`, it should go back to being `null`.
- `BasicRI1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): A specified intent can be raised by invoking `fdc3.raiseIntent(<intent name>, <context>)`. A promise should be returned.
- `BasicRI2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): An intent can be raised for some item of context by invoking: `fdc3.raiseIntentForContext(<context>)`. A promise should be returned.
- `BasicDM1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Desktop Agent methods remain callable when destructured. The test also verifies destructured `broadcast`, `addContextListener`, and `addEventListener` methods on App and User `Channel` objects, and destructured `unsubscribe` methods on returned `Listener` objects.
- `BasicClose1` ![3.0](https://img.shields.io/badge/FDC3-3.0-purple): An app can request that its own window or frame be closed by calling `fdc3.close()`. On success the app is closed (the promise does not resolve). On failure the promise rejects with an error from the `CloseError` enumeration.
