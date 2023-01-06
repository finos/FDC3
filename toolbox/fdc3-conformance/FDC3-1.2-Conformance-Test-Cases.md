# FDC3 1.2 Conformance Test Cases
.

## 3. App Channels 

### App Channels Broadcast (Basic)


| App | Step               | Details                                                                                                                                                        |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. createChannel        |`const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| A   | 2. addContextListener |Call `testChannel.addContextListener(null, handler)`<br>Check listener object returned<br>Check that there is an `unsubscribe` function on the returned object  |
| B   | 3. createChannel        | `const testChannel = fdc3.getOrCreateChannel("test-channel")`   |
| B   | 4. Broadcast          | `testChannel.broadcast(<some instrument>)`   |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 4 above.      |

-  `ACBasicUsage1` Perform above test 

| App | Step               | Details                                                                                                                                                        |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| B   | 1. createChannel        | `const testChannel = await fdc3.getOrCreateChannel("test-channel")`   |
| B   | 2. Broadcast          | `testChannel.broadcast(<some instrument>)`   |
| A   | 3. createChannel        |`const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| A   | 4. getCurrentContext |Call `testChannel.getCurrentContext()`<br>Check that the Context object returned is of the expected type.  |

-  `ACBasicUsage2` Perform above test.

### App Channels Broadcast (Filtered Context)

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. createChannel        |`const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| A   | 2. addContextListener | Call `testChannel.addContextListener("fdc3.instrument", handler)`<br>Check listener object returned<br>Check that there is an `unsubscribe` function on the returned object |
| B   | 3. createChannel        | `const testChannel = await fdc3. getOrCreateChannel("test-channel")`   |
| B   | 4. Broadcast          | `testChannel.broadcast()` the instrument context.<br>`testChannel.broadcast()` a contact context. |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 4 above.<br>Check that the contact is not received.                                                                   |

-  `ACFilteredContext1`: Perform above test 
-  `ACFilteredContext2`: Perform above test, but add listeners for both `fdc3.instrument` and `fdc3.contact` in `addContextListener` step.  Both should be received. 
-  `ACFilteredContext3`: Perform above test, except creating a _different_ channel in app B. Check that you _don't_ receive anything (as the channels don't match).
-  `ACUnsubscribe`: Perform above test, except that after creating the channel **A** then `unsubscribe()`s the listener it added to the channel. Check that **A** _doesn't_ receive anything.
-  `ACFilteredContext4`: Perform above test, except that after creating the channel **A** creates another channel with a further _different_ channel id and adds a further context listener to it.  Check that **A** is still able to receive context on the first channel (i.e. it is unaffected by the additional channel) and does *NOT* receive anything on the second channel.

### App Channel History

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. createChannel        |`fdc3.getOrCreateChannel("test-channel")`       |
| B   | 2. createChannel        | `fdc3.getOrCreateChannel("test-channel")`   |
| B   | 3. Broadcast          | `testChannel.broadcast()` the instrument context.<br>`testChannel.broadcast()` a contact context. |
| A   | 4. Receive Context    | `testChannel.getCurrentContext('fdc3.instrument')` returns the last broadcast instrument<br>`testChannel.getCurrentContext('fdc3.contact')` returns the last broadcast contact                                                              |

-  `ACContextHistoryTyped`: Perform above test.
-  `ACContextHistoryMultiple`: **B** Broadcasts multiple history items of both types.  Only the last version of each type is received by **A**.
-  `ACContextHistoryLast`: **A** calls `testChannel.getCurrentContext()` retrieves the last broadcast context item

## 5. Intents

### Setup

You will need to pre-populate the AppDirectory with the following items:

| App | Required Metadata                                                                                                                                    |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | A’s AppD Record contains: `aTestingIntent` (with context type `testContextX`, `testContextZ`) and `sharedTestingIntent1` (with context type `testContextX`)    |
| B   | B’s AppD Record contains `bTestingIntent` (with context type `testContextY`) and `sharedTestingIntent1` (with context types `testContextX` and `testContextY`) |
| C   | C’s AppD Record contains `cTestingIntent` (with context type `testContextX`)                                                                             |

Also we assume a fourth app **D** that is going to discover the intents in the other 3.

### Find Intent From AppD

-  `IntentAppD`: Calls `fdc3.findIntent(‘aTestingIntent’)`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** app metadata.
-  `WrongIntentAppD`: Calls `fdc3.findIntent(‘nonExistentIntent’)`. Rejects with no apps found error https://fdc3.finos.org/docs/api/ref/Errors#resolveerror
-  `IntentAppDRightContext`: Calls `fdc3.findIntent(‘aTestingIntent’, ‘fdc3.testContextX’)`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** app metadata.
-  `IntentAppDWrongContext`: Calls `fdc3.findIntent(‘aTestingIntent’, ‘fdc3.testContextY’)`.  Rejects with no apps found error https://fdc3.finos.org/docs/api/ref/Errors#resolveerror
-  `IntentAppDMultiple1`: Calls `fdc3.findIntent(‘sharedTestingIntent1’)`.  Receives promise containing an appIntent with metadata containing `sharedTestingIntent` and only **A** and **B** app metadata.
-  `IntentAppDMultiple2`: Calls `fdc3.findIntent(‘sharedTestingIntent1’, 'testContextX')`.  Receives promise containing an appIntent with metadata containing `sharedTestingIntent` and only **A** and **B** app metadata.
-  `IntentAppDMultiple3`: Calls `fdc3.findIntent(‘sharedTestingIntent1’, 'testContextY')`.  Receives promise containing an appIntent with metadata containing `sharedTestingIntent` and only **B** app metadata.

### Find Intents By Context

-  `SingleContext`: Call `fdc3.findIntentsByContext(‘fdc3.testContextX’)`.  Should return `aTestingIntent` (app **A**), `sharedTestingIntent1` (**A**, **B**) and `cTestingIntent` (**C**) AND nothing else.
-  `NoContext`: Call `fdc3.findIntentsByContext()`. Throws error of `NoAppsFound`

### Raise Intent

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| A   | 1. Raise          | `fdc3.raiseIntent(‘sharedTestingIntent1’, {testContextY})`<br>starts app B.                       |
| B   | 2. Gather Context | `fdc.addIntentListener(‘sharedTestingIntent1’)`<br>Receives testContextY, matching that sent by D |

-  `SingleResolve1`: Perform above test
-  `TargetedResolve1`: Use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, <A’s App Name>)` to start app A, otherwise, as above
-  `TargetedResolve2`: Use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, {name: "<A's App Name>"})` to start app A, otherwise, as above
-  `TargetedResolve3`: Use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, {name: “<app B Name>”, appId: “<app B ID>”})` to start app A, otherwise, as above
-  `FailedResolve1-3` As with `TargetedResolve1-3`, but use `fdc3.raiseIntent(‘aTestingIntent’, {testContextY}, <A’s App Name>)` and variations.  You will receive `NoAppsFound` Error
-  `FailedResolve4` As above, but use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, <C’s App Name>)`.  You will receive `NoAppsFound` Error
