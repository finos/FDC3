---
id: Basic-Tests
sidebar_label: Basic Tests
title: Basic Tests
hide_title: true
---

# Basic Tests
<!-- markdownlint-disable MD033 -->

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `BasicCL1`: A context listener can be created for a specific context type by calling `fdc3.addContextListener("fdc3.contact",<handler>)`.  A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicCL2`: An **unfiltered** context listener can be created by calling `fdc3.addContextListener(null,<handler>)`.  A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicIL1`: An intent listener can be created for a specific intent by calling `fdc3.addIntentListener(<intentName>,<handler>)`. A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicGI1`: An `ImplementationMetadata` object can be retrieved, to find out the version of FDC3 that is in use along with details of the provider, by calling:
  - `await fdc3.getInfo()`.w The FDC3 version should match the API version being tested for conformance.
- `BasicAC1`: A named 'App' channel can be retrieved via the `fdc3.getOrCreateChannel(<name>)` function. The `Channel` object returned conforms to the defined interface.
- `BasicUC1`: The list available user/system channels can be retrieved as an array of `Channel` Objects conforming to the defined interface.  The API call is:
  - `await fdc3.getUserChannels()`
- `BasicJC1`: A user/system channel can be joined with the with the channel's id by calling `fdc3.joinUserChannel(<channelId>)`.  Having done so, the current channel, retrieved by calling `fdc3.getCurrentChannel()` should NOT be null and should match _the channel id given_.  After leaving the current channel by calling `fdc3.leaveCurrentChannel()`, it should go back to being `null`.
- `BasicRI1`: A specified intent can be raised by invoking `fdc3.raiseIntent(<intent name>, <context>)`. A promise should be returned.
- `BasicRI2`: An intent can be raised for some item of context by invoking: `fdc3.raiseIntentForContext(<context>)`. A promise should be returned.
