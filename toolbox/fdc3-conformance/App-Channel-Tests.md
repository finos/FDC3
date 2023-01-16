# App Channel Tests  ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

## Basic Broadcast

| App | Step               | Details                                                                    |
|-----|--------------------|----------------------------------------------------------------------------|
| A   | 1.createChannel    |Get or create a user channel called `test-channel` using: <br/>`const testChannel = await fdc3.getOrCreateChannel("test-channel")` |
| A   | 2.addContextListener |Add an _untyped_ context listener, using: <br/> ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) `const listener = await testChannel.addContextListener(null, handler)` <br/>![1.2](https://img.shields.io/badge/FDC3-1.2-green) `testChannel.addContextListener(null, handler)` |
| B   | 3.createChannel      | Get or create the same named user channel as A- `test-channel`|
| B   | 4.Broadcast          | Broadcast an `fdc3.instrument` to the channel with: <br/>`testChannel.broadcast(<some instrument>)`|
| A   | 5.Receive Context    | Ensure that the instrument received by A is identical to that sent by B  |

- `ACBasicUsage1` Perform above test.

## Current Context

| App | Step               | Details                                                                    |
|-----|--------------------|----------------------------------------------------------------------------|
| B   | 1.createChannel        | Get or create a user channel called `test-channel` using: <br/>`const testChannel = await fdc3.getOrCreateChannel("test-channel")`|
| B   | 2.Broadcast          | Broadcast an `fdc3.instrument` to the channel using: <br/> `testChannel.broadcast(<some instrument>)`|
| A   | 3.createChannel   |Get or create the same channel as B- called `test-channel` |
| A   | 4.Receive Context    | A gets the _current context_ of the user channel. Via: <br /> ![1.2](https://img.shields.io/badge/FDC3-1.2-green) `testChannel.getCurrentContext()` <br /> ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) `await testChannel.getCurrentContext()` <br /> It receives an `fdc3.instrument` identical to that sent by B.    |

-  `ACBasicUsage2` Perform above test.

## Filtered Context

| App | Step               | Details                                                         |
|-----|--------------------|-----------------------------------------------------------------|
| A   | 1.createChannel   |Get or create a user channel called `test-channel` |
| A   | 2.addContextListener | A creates a _typed_ context listener for `fdc3.instrument`s.  <br>Check that there is an `unsubscribe` function on the listener |
| B   | 3.createChannel        | Get or create the same named user channel as A- `test-channel`|
| B   | 4.Broadcast          | B broadcasts both the instrument context a contact context. |
| A   | 5.Receive Context    | Instrument object matches the one broadcast in 4 above.<br>Check that the contact is not received.                                                                   |

-  `ACFilteredContext1`: Perform above test 
-  `ACFilteredContext2`: Perform above test, but add listeners for both `fdc3.instrument` and `fdc3.contact` in `addContextListener` step.  Both should be received. 
-  `ACFilteredContext3`: Perform above test, except creating a _different_ channel in app B. Check that you _don't_ receive anything (as the channels don't match).
-  `ACUnsubscribe`: Perform above test, except that after creating the channel **A** then `unsubscribe()`s the listener it added to the channel. Check that **A** _doesn't_ receive anything.
-  `ACFilteredContext4`: Perform above test, except that after creating the channel **A** creates another channel with a further _different_ channel id and adds a further context listener to it.  Check that **A** is still able to receive context on the first channel (i.e. it is unaffected by the additional channel) and does *NOT* receive anything on the second channel.

### App Channel History

| App | Step               | Details                                                 |
|-----|--------------------|---------------------------------------------------------|
| A   | 1.createChannel   |Get or create a user channel called `test-channel` |
| B   | 2.createChannel        | Get or create the same named user channel as A- `test-channel`|
| B   | 3.Broadcast          | B broadcasts an `fdc3.instrument` context and an `fdc3.contact` context. |
| A   | 4. Receive Context    | A is able to retrieve the current context of the channel for each type, and the returned data matches that last broadcast by B.|                                                             |

- `ACContextHistoryTyped`: Perform above test.
- `ACContextHistoryMultiple`: **B** Broadcasts multiple history items of both types.  Only the last version of each type is received by **A**.
- `ACContextHistoryLast`: **A** asks for _untyped_ current context of the channel, and receives the very last broadcast context item _of any type_.
