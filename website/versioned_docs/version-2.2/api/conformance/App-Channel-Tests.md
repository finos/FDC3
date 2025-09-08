---
id: App-Channel-Tests
sidebar_label: App Channel Tests
title: App Channel Tests
hide_title: true
---

# App Channel Tests  
<!-- markdownlint-disable MD033 -->

## Basic Broadcast

| App | Step                    | Details                                                                    |
|-----|-------------------------|----------------------------------------------------------------------------|
| A   | 1. Retrieve `Channel`   | Retrieve a `Channel` object representing an 'App' channel called `test-channel` using: <br />`const testChannel = await fdc3.getOrCreateChannel("test-channel")` |
| A   | 2. Add Context Listener | Add an _untyped_ context listener to the channel, using: <br /> !`await testChannel.addContextListener(null,handler)` |
| B   | 3. Retrieve `Channel`   | Retrieve a `Channel` object representing the same 'App' channel A did (`test-channel`)|
| B   | 4. Broadcast            | Broadcast an `fdc3.instrument` Context to the channel with: <br />`testChannel.broadcast(<fdc3.instrument>)`|
| A   | 5. Receive Context      | The handler added in step 2 will receive the instrument context. Ensure that the instrument received by A is identical to that sent by B.  |

- `ACBasicUsage1` Perform above test.

## Current Context

| App | Step                        | Details                                                                    |
|-----|-----------------------------|----------------------------------------------------------------------------|
| B   | 1. Retrieve `Channel`       |Retrieve a `Channel` object representing an 'App' channel called `test-channel` using: <br />`const testChannel = await fdc3.getOrCreateChannel("test-channel")` |
| B   | 2. Broadcast                | Broadcast an `fdc3.instrument` to the channel using: <br />`testChannel.broadcast(<fdc3.instrument>)`|
| A   | 3. Retrieve `Channel`       |Retrieve a `Channel` object representing the same 'App' channel B did (`test-channel`)|
| A   | 4. Retrieve Current Context | A gets the _current context_ of the user channel. via:  `await testChannel.getCurrentContext()` <br />Ensure that the instrument received by A is identical to that sent by B    |

- `ACBasicUsage2` Perform above test

## Filtered Context

| App | Step                    | Details                                                         |
|-----|-------------------------|-----------------------------------------------------------------|
| A   | 1. Retrieve `Channel`   | Retrieve a `Channel` object representing an 'App' channel called `test-channel` using: <br />`const testChannel = await fdc3.getOrCreateChannel("test-channel")` |
| A   | 2. Add Context Listener | Add a _typed_ context listener for `fdc3.instrument`, using: <br />`await testChannel.addContextListener("fdc3.instrument", handler)`|
| B   | 3. Retrieve `Channel`   | Retrieve a `Channel` object representing the same 'App' channel A did (`test-channel`)|
| B   | 4. Broadcast            | B broadcasts both an `fdc3.instrument` context and an `fdc3.contact` context, using: <br /> `testChannel.broadcast(<fdc3.instrument>)` <br /> `testChannel.broadcast(<fdc3.contact>)`|
| A   | 5. Receive Context      | An fdc3.instrument context is received by the handler added in step 2.<br />Ensure that the fdc3.instrument received by A is identical to that sent by B<br />Ensure that the fdc3.contact context is NOT received.                                                                   |

- `ACFilteredContext1`: Perform above test.
- `ACFilteredContext2`: Perform above test, but add listeners for both `fdc3.instrument` and `fdc3.contact` in step2.  Ensure that both context objects are received.
- `ACFilteredContext3`: Perform above test, except creating a _different_ channel in app B. Check that you _don't_ receive anything (as the channels don't match).
- `ACFilteredContext4`: Perform above test, except that after creating the channel **A** creates another channel with a further _different_ channel id and adds a further context listener to it.  Ensure that **A** is still able to receive context on the first channel (i.e. it is unaffected by the additional channel) and does NOT receive anything on the second channel.
- `ACUnsubscribe`: Perform above test, except that after creating the channel **A** then `unsubscribe()`s the listener it added to the channel. Check that **A** does NOT receive anything.

### App Channel History

| App | Step                        | Details                                                 |
|-----|-----------------------------|---------------------------------------------------------|
| A   | 1. Retrieve `Channel`       | Retrieve a `Channel` object representing an 'App' channel called `test-channel` using: <br />`const testChannel = await fdc3.getOrCreateChannel("test-channel")` |
| B   | 2. Retrieve `Channel`       | Retrieve a `Channel` object representing the same 'App' channel A did (`test-channel`)|
| B   | 3. Broadcast                | B broadcasts both the instrument context and a contact context, using: <br /> `testChannel.broadcast(<fdc3.instrument>)` <br /> `testChannel.broadcast(<fdc3.contact>)` |
| A   | 4. Add Context Listener     | A adds a context listener to the channel _after_ B has completed all its broadcasts, via: <br />`await testChannel.addContextListener("fdc3.instrument", handler)` <br /> Ensure that A does NOT receive any context via these listeners (past context is only retrieved via a `getCurrentContext()` call on App channels). |
| A   | 5. Retrieve Current Context | A is able to retrieve the most recent context of each context type from the `Channel`  via: <br />`const instrument = await testChannel.getCurrentContext("fdc3.instrument")`<br />`const contact = await testChannel.getCurrentContext("fdc3.contact")`<br />Ensure that both contexts retrieved by A are identical to those sent by B|

- `ACContextHistoryTyped`: Perform above test.
- `ACContextHistoryMultiple`: **B** Broadcasts multiple history items of both types.  Ensure that only the last version of each type is received by **A**.
- `ACContextHistoryLast`: In step 5. **A** retrieves the _untyped_ current context of the channel via `const currentContext = await testChannel.getCurrentContext()`. Ensure that A receives only the very last broadcast context item _of any type_.
