# FDC3 1.2 Conformance Test Cases

## 1. Basic Tests

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `BasicCL1`: You can call the `fdc3.addContextListener` with the `fdc3.contact` context type. The returned listener object has an `unsubscribe` function.
- `BasicCL2`: You can call the `fdc3addContextListener` with no context type. The returned listener object has an `unsubscribe` function.
- `BasicIL1`: You can call the `fdc3.addIntentListener` on the `DesktopAgent` for an intent, and get back a `Listener` object with `unsubscribe` method.
- `BasicCH1`: A call to `fdc3.getCurrentChannel` on the `DesktopAgent` always returns a promise.
- `BasicCH2`: A call to `fdc3.getCurrentChannel()` returns a promise resolving to _null_ if called prior to any `joinChannel`.
- `BasicGI1`: A call to `fdc3.getInfo()` returns an object with `fdc3Version` and `provider` properties.
- `BasicAC1`: A call to `fdc3.getOrCreateChannel(<name>)` will return an promise resolving to an object matching the `Channel` interface, with properties of `id`, `type`, `broadcast`, `getCurrentContext` and `addContextListener`.
- `BasicUC1`: You can call the `fdc3.getSystemChannels()` function and receive a promise containing an array of more than 1 `Channel` objects, each with `type` and `id` set.
- `BasicJC1`: You can call `fdc3.joinChannel`, passing in the `id` of one of the system channels.  After the returned promise is resolved, `fdc3.getCurrentChannel` should then return that joined channel.
- `BasicLC1`: You can call `fdc3.leaveCurrentChannel` at any time without it throwing an exception.
- `BasicRI1`: You can call `fdc3.raiseIntentForContext`, passing in a context object with some `type` field.  

## 2. System / User Channels 

### User Channels Broadcast (Basic)

| App | Step               | Details                                                                                                                                                        |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. addContextListener |Call `fdc3.addContextListener(null, handler)`<br>Check listener object returned<br>Check that there is an `unsubscribe` function on the returned object  |
| A   | 2. joinChannel        |`fdc3.getSystemChannels()`<br>Check channels are returned.<br>Call `fdc3.joinChannel()` on first non-global channel                                      |
| B   | 3. joinChannel        | `fdc3.getSystemChannels()`<br>Check channels are returned.<br>Call `fdc3.joinChannel()` on first non-global channel                                      |
| B   | 4. Broadcast          | `fdc3.broadcast(<some instrument>)`                                                                   |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 4 above.                                                      |

-  `UC Basic Usage 1` Perform above test 
-  `UC Basic Usage 2` Perform above test, but join channel first and then `fdc3.addContextListener()`
-  `UC Basic Usage 3` Do the app B steps first to populate the channel with context, check that A will receive the context after joining

### User Channels Broadcast (Filtered Context)

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. addContextListener | Call `fdc3.addContextListener("fdc3.instrument", handler)`<br>Check listener object returned<br>Check that there is an `unsubscribe` function on the returned object |
| A   | 2. joinChannel        | `fdc3.getSystemChannels()`<br>Check channels are returned.<br>Call `fdc3.joinChannel()` on first non-global channel                                                  |
| B   | 3. joinChannel        | `fdc3.getSystemChannels()`<br>Check channels are returned.<br>Call `fdc3.joinChannel()` on first non-global channel                                                  |
| B   | 4. Broadcast          | `fdc3.broadcast()` the instrument context.<br>`fdc3.broadcast()` a contact context.                                                                                  |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 4 above.<br>Check that the contact is not received.                                                                   |

-  `UCFilteredContext1`: Perform above test 

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. addContextListener | Call `addContextListener (“fdc3.instrument”, handler)`<br>Check listener object returned<br>Check that there is an unsubscribe function on the returned object<br>Call `addContextListener (“fdc3.contact”, handler)`<br>Check listener object returned<br>Check that there is an unsubscribe function on the returned object                                                                                                                                                                                   |
| A   | 2. joinChannel        | `fdc3.getSystemChannels()`<br>Check channels are returned.<br>Call `fdc3.joinChannel()` on first non-global channel. Check that there is an unsubscribe function on the returned object                                                                                                                                                                                                                                                                                |
| B   | 3. joinChannel        | `fdc3.getSystemChannels()`<br>Check channels are returned.<br>Call `fdc3.joinChannel()` on first non-global channel                                                                                                                                                                                                                               |
| B   | 4. Broadcast          | `fdc3.broadcast()` the instrument context.<br>`fdc3.broadcast()` a contact context.                                                                                                                                                                                                                                                               |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 4 above.<br>Contact object matches the one broadcast in 4 above.          |

-  `UCFilteredContext2`: Perform above test
-  `UCFilteredContext3`: Perform above test, except joining a _different_ channel. Check that you _don't_ receive anything.
-  `UCUnsubscribe`: Perform above test, except that after joining, **A** then `unsubscribe()`s the context listener. Check that **A** _doesn't_ receive anything.
-  `UCFilteredContext4`: Perform above test, except that after joining, **A** changes channel with a further _different_ channel.  Check that **A** _doesn't_ receive anything.

## 3. App Channels 

### App Channels Broadcast (Basic)


| App | Step               | Details                                                                                                                                                        |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. createChannel        |`const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| A   | 2. addContextListener |Call `testChannel.addContextListener(null, handler)`<br>Check listener object returned<br>Check that there is an `unsubscribe` function on the returned object  |
| B   | 3. createChannel        | `const testChannel = fdc3. getOrCreateChannel("test-channel")`   |
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
-  `ACFilteredContext4`: Perform above test, except that after creating the channel **A** creates another channel with a further _different_ channel id.  Check that **A** _doesn't_ receive anything.

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

## 4. Open API 

### A Opens B

- `AOpensB1`:  **A** calls `fdc3.open(‘app B Name’)`, check app **B** opens
- `AOpensB2`:  **A** calls `fdc3.open({name: “<app B Name>”})`, check app **B** opens
- `AOpensB3`:  **A** calls `fdc3.open({name: “<app B Name>”, appId: “<app B ID”})`, check app **B** opens

### A Fails To Open B

- `AFailsToOpenB1-3`:  Run the above 4 tests again with a non-existent app name/app id.  Should return “App Not Found” Error from https://fdc3.finos.org/docs/api/ref/Errors#openerror

### A Opens B With Context

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App     | various open methods as in `AOpensB1-3` except with a `<context>` argument of type `fdc3.testReceiver` <br>check app opens    |
| B   | 2. Context present | `fdc3.addContextListener()`<br>- receives `<context>` from **A** |

-  `AOpensBWithContext1-3`: Perform above tests
-  `AOpensBWithSpecificContext`: Perform above but replace **B**s call with `fdc3.addContextListener('fdc3.testReceiver`)`


### Specific Context


| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | `fdc3.open(‘app Name’, <contact context>)` <br>check app opens                                                                |
| B   | 2. Context present | fdc3.addContextListener()<br>- receives <context> from A                                                                      |
| A   | 3. Promise         | - receives a rejection from the open promise with “App Timeout’ from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

-  `AOpensBWithWrongContext`: As above
-  `AOpensBNoListen`: Skip `fdc3.addContextListener()` above. 
-  `AOpensBMultipleListen`:  **B** performs `fdc3.addContextListener('fdc3.instrument') prior to the existing `addContextListener`.  The correct context listener should receive the context, and the promise resolves successfully
-  `AOpensBMalformedContext`: **A** tries to pass malformed context to **B**.  Context listener receives nothing, promise completes successfully.

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
-  `TargetedResolve2-3` Use the other ways of addressing apps (via ID, metadata) as described in `AOpensB2-3` 
-  `FailedResolve1-3` As above, but use `fdc3.raiseIntent(‘aTestingIntent’, {testContextY}, <A’s App Name>)` and variations.  You will receive `NoAppsFound` Error
-  `FailedResolve4` As above, but use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, <C’s App Name>)`.  You will receive `NoAppsFound` Error
