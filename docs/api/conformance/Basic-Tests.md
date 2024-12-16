---
id: Basic-Tests
sidebar_label: Basic Tests
title: Basic Tests
hide_title: true
---

# Basic Tests
<!-- markdownlint-disable MD033 -->

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `BasicCL1`: You can create a context listener by calling `fdc3.addContextListener("fdc3.contact",<handler>)`.  A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicCL2`: You can create an **unfiltered** context listener by calling `fdc3.addContextListener(null,<handler>)`.  A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicIL1`: You can create an intent listener by calling `fdc3.addIntentListener(<intentName>,<handler>)`. A `Listener` object is returned and can be used to remove the listener again by calling its `unsubscribe` function.
- `BasicGI1`: An application can retrieve an `ImplementationMetadata` object to find out the version of FDC3 it is using and the provider details by calling:
  - `await fdc3.getInfo()`
- `BasicAC1`: An application can retrieve a named 'App' channel via the `fdc3.getOrCreateChannel(<name>)` function. The `Channel` object returned conforms to the defined interface.
- `BasicUC1`: An application can query the available user/system channels, which are returned as an array of `Channel` Objects conforming to the defined interface.  The API call is:
  - `await fdc3.getUserChannels()`
- `BasicJC1`: The application should be able to join one of the user/system channels with the channel's id.  Having done so, the current channel should NOT be null, and be set for the application _to the channel for the id given_.  After you leave the current channel, it should go back to being `null`.
  - The channel is joined with:
    - `fdc3.joinUserChannel(<channelId>)`
  - A `Channel` object representing the current channel is retrieved with:
    - `fdc3.getCurrentChannel()` to get the current channel.
  - The channel is left with:
    - `fdc3.leaveCurrentChannel()`
- `BasicRI1`: The application should be able to raise an intent by invoking:
  - `fdc3.raiseIntent(<intent name>)`
  - A promise should be returned.
- `BasicRI2`: The application should be able to raise an intent for some item of context by invoking:
  - `fdc3.raiseIntentForContext(<context>)`
  - A promise should be returned.
