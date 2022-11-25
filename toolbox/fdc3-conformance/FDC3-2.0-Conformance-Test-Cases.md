# FDC3 2.0 Conformance Test Cases

## 1. Basic Tests

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `2.0-BasicCL1`: You can call the `fdc3.addContextListener` with the `fdc3.contact` context type. The returned promise's listener object has an `ubsubscribe` function.
- `2.0-BasicCL2`: You can call the `fdc3.addContextListener` with a `null` context type. The returned promise's listener object has an `unsubscribe` function.
- `2.0-BasicIL1`: You can call the `fdc3.addIntentListener` on the `DesktopAgent` for an intent, and get back promise resolving a `Listener` object with `unsubscribe` method.
- `2.0-BasicCH1`: A call to `fdc3.getCurrentChannel()` on the `DesktopAgent` always returns a promise, resolving to either a `Channel` or `null`.
- `2.0-BasicCH2`: A call to `fdc3.getCurrentChannel()` returns a promise resolving to _null_ if called prior to any `joinChannel`.
- `2.0-BasicGI1`: A call to `fdc3.getInfo()` returns a promise resolving to an `ImplementationMetadata` object with `fdc3Version` and `provider` properties.
- `2.0-BasicAC1`: A call to `fdc3.getOrCreateChannel(<name>)` will return a promise resolving an object matching the `Channel` interface, with properties of `id`, `type`, `broadcast`, `getCurrentContext` and `addContextListener`.
- `2.0-BasicUC1`: You can call the `fdc3.getUserChannels()` function and receive a promise resolving an array of more than 1 `Channel` objects, each with type and id set.
- `2.0-BasicJC1`: You can call `fdc3.joinUserChannel()`, passing in the `id` of one of the system channels.  After the returned promise is resolved, `fdc3.getCurrentChannel()` should then return a promise resolving to the joined `Channel`.
- `2.0-BasicLC1`: You can call `fdc3.leaveCurrentChannel()` at any time without an exception being thrown.
- `2.0-BasicRI1`: You can call `fdc3.raiseIntentForContext()`, passing in a context object with some `type` field.  

## 2. User Channels

### Broadcast (Basic)

| App | Step               | Details                                                                                                                                                        |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   |1.  addContextListener |Call `fdc3.addContextListener(null, handler)`<br>Check **promise** resolving a **listener**  object is returned<br>Check that there is an `unsubscribe` function on the **listener object**   |
| A   | 2. joinUserChannel        |`fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on first **user** channel                                      |
| B   | 3. joinUserChannel        | `fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on first **user** channel                                      |
| B   | 4. Broadcast          | `fdc3.broadcast(<some instrument>)` <br> **Check promise of `void` is returned**                                                                                                                         |
| A   |5.  Receive Context    | Instrument object matches the one broadcast in 2 above.                                                                                                    |

- `2.0-UCBasicUsage1` Perform above test 
- `2.0-UCBasicUsage2` Perform steps in order: 2,1,3,4,5
- `2.0-UCBasicUsage3` 3,4,1,2,5
- `2.0-UCBasicUsage4` 3,4,2,1,5

### Broadcast (Filtered Context)

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. addContextListener | Call `fdc3.addContextListener("fdc3.instrument", handler)`<br>Check **promise** resolving a **listener**  object is returned<br>Check that there is an `unsubscribe` function on the **listener object**  |
| A   | 2. joinUserChannel        |`fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on first **user** channel                                      |
| B   | 3. joinUserChannel        | `fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on first **user** channel                                      |
| B   | 4. Broadcast          | `fdc3.broadcast(<some instrument>)` <br> `fdc3.broadcast()` a contact context.   <br> **Check promise of `void` is returned in both cases**                 |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 2 above.<br>Check that the contact is not received.                                                                   |

- `2.0-UCFilteredUsage1` Perform above test 
- `2.0-UCFilteredUsage2` Perform steps in order: 2,1,3,4,5
- `2.0-UCFilteredUsage3` 3,4,1,2,5
- `2.0-UCFilteredUsage4` 3,4,2,1,5

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. addContextListeners | Call `addContextListener (“fdc3.instrument”, handler)`<br>Check **promise** resolving a **listener**  object is returned<br>Check that there is an `unsubscribe` function on the **listener object**<br>Call `addContextListener (“fdc3.contact”, handler)`<br>Check **promise** resolving a **listener**  object is returned<br>Check that there is an `unsubscribe` function on the **listener object**     |
| A   | 2. joinUserChannel        |`fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on first **user** channel                                      |
| B   | 3. joinUserChannel        | `fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on first **user** channel                                      |
| B   | 4. Broadcast          | `fdc3.broadcast()` the instrument context. <br> `fdc3.broadcast()` a contact context.                                                                                                                                                                                                                                                               |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 2 above.<br>Contact object matches the one broadcast in 2 above.                                                                                                                                                                                                                                   |

 - `2.0-UCFilteredUsage5`: Perform above test
 - `2.0-UCFilteredUsage6`: Perform above test, except B will join a _different_ channel to A. Check that you _don't_ receive anything.
 - `2.0-UCFilteredUsageUnsubscribe`: Perform above test, except that after joining, **A** then `unsubscribe()`s from the channel using the `listener.unsubscribe` function. Check that **A** _doesn't_ receive anything.
 - `2.0-UCFilteredUsageChange`: Perform above test, except that after joining, **A** changes channel to a _different_ channel via a further call to `fdc3.joinUserChannel`.  Check that **A** _doesn't_ receive anything.
 - `2.0-UCFilteredUsageLeave`: Perform above test, except that after joining, **A** calls `fdc3.leaveCurrentChannel()` and receives a promise resolving to `void`.

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. joinUserChannel        |`fdc3.getUserChannels()`<br>Check **user** channels are returned.<br>Call `fdc3.joinUserChannel()` on the _third_ **user** channel                                      |
| A   | 2. getCurrentChannel        |`fdc3.getCurrentChannel()`<br>Check *that the channel returned matches the joined in the previous step                                      |

- `2.0-UCFilteredUsageJoin`: **Perform the above test**.
- `2.0-UCFilteredUsageNoJoin`: Perform the above test, but skip the first step so that the app is not on a channel. Config that that `fdc3.getCurrentChannel()` returns `null`.

## 3. App Channels

### Broadcast (Basic)

| App | Step               | Details                                                                                                                                                        |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. getOrCreateChannel        | `const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| A   | 2. addContextListener |Call `const listener = await testChannel.addContextListener(null, handler)`<br>Check listener object returned<br>Check that there is an `unsubscribe` function on the returned object  |
| B   | 3. getOrCreateChannel        | `const testChannel = await fdc3. getOrCreateChannel("test-channel")`   |
| B   | 4. Broadcast          | `testChannel.broadcast(<some instrument>)`   |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 2 above.      |

- `2.0-ACBasicUsage1`: Perform above test 
- `2.0-ACBasicUsage2`: Perform above test, but perform steps in order 3,4,1,2,5**

### Broadcast (Filtered Context)

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. getOrCreateChannel  |`const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| A   | 2. addContextListener | Call `const listener = await testChannel.addContextListener("fdc3.instrument", handler)`<br>Check `listener` object returned<br>Check that there is an `unsubscribe` function on the returned object |
| B   | 3. getOrCreateChannel  | `const testChannel = await fdc3. getOrCreateChannel("test-channel")`   |
| B   | 4. Broadcast          | `testChannel.broadcast()` the instrument context.<br>`testChannel.broadcast()` a contact context. |
| A   | 5. Receive Context    | Instrument object matches the one broadcast in 2 above.<br>Check that the contact is not received.                                                                   |

- `2.0-ACFilteredContext1`: Perform above test 
- `2.0-ACFilteredContext2`: Perform above test, except B retrieves a _different_ channel. Check that you _don't_ receive any context via that channel.
- `2.0-ACUnsubscribe`: Perform above test, except that after retrieving the channel and adding a context listener, **A** then calls `listener.unsubscribe() via the listener object that was returned. Check that **A** _doesn't_ receive anything via that channel afterwards.
- `2.0-ACFilteredContext3`: Perform above test, except that after retrieving the channel, **A** repeats steps 1 and 2, retrieving a second channel with a different name and adds a listener to it.  Check that **A** still receives context on the first channel (i.e. it is unaffected by retrieving a second channel).**

### App Channel History

| App | Step               | Details                                                                                                                                                              |
|-----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. getOrCreateChannel  | `const testChannel = await fdc3.getOrCreateChannel("test-channel")`       |
| B   | 2. getOrCreateChannel  | `const testChannel = await fdc3. getOrCreateChannel("test-channel")`   |
| B   | 3. Broadcast          | `testChannel.broadcast()` the instrument context.<br>`testChannel.broadcast()` a contact context. |
| A   | 4. Receive Context    | **`const contextInst = await testChannel.getCurrentContext('fdc3.instrument')` returns the last instrument<br>`const contextCont = await testChannel.getCurrentContext('fdc3.contact')` returns the last contact<br>`const contextLatest = await testChannel.getCurrentContext()` returns the last broadcast chronologically (contact type)**                                                             |

- `2.0-ACContextHistoryTyped`: Perform above test.
- `2.0-ACContextHistoryMultiple`: **B** Broadcasts multiple history items of both types.  Only the last version of each type is received by **A**.
- `2.0-ACContextHistoryLast`: **A** calls testChannel.getCurrentContext() retrieves the last broadcast context item

## 4. Open API

### A Opens B

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App     |`let appIdentifier = await fdc3.open({appId: “<app B ID>”})`   |
| B   | 2. B opens and retrieves own metadata | `const implementationMetadata = await fdc3.getInfo();`<br>`const {appId, instanceId} = implementationMetadata.appMetadata;`<br>Confirm appId matches what was opened |

- `2.0-AOpensB1`:  Run above test
- **Note** there were many more variations in FDC3 1.2 but 2.0 standardizes on this one signature (that is now async with a return type)

### A Fails To Open B

- `2.0-AFailsToOpenB`:  Run the above test again with a non-existent app name/app id.  Should return an error with message “App Not Found” Error from https://fdc3.finos.org/docs/api/ref/Errors#openerror

### A Opens B With Context

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App     | Open method as in `AOpensB1` except with a `<context>` argument of type `fdc3.instrument` <br>check app opens    |
| B   | 2. Context present | `fdc3.addContextListener(null, handler)`<br>- receives `<context>` from **A** with type `fdc3.instrument` |

- `2.0-AOpensBWithContext`: Perform above test
- `2.0-AOpensBWithSpecificContext`: Perform above but replace **B**s call with `fdc3.addContextListener('fdc3.instrument', handler)`
- `2.0-AOpensBMultipleListen`:  Perform `AOpensBWithSpecificContext` but **B** should perform an additional `fdc3.addContextListener('fdc3.contact', handler)` prior to the existing `addContextListener` for `fdc3.instrument`.  The correct context listener should receive the context, and the promise completes successfully. 

### Specific Context

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | Open method as in `AOpensBWithContext` but pass a context type that app B is NOT going to add a listener for (including NOT adding a listener for type `null`)                                                                |
| B   | 2. Context not received | App B calls `fdc3.addContextListener(type, handler)` for the type's it is listening for but NOT for the type A is sending in this case. Confirm that NO context is received.                         |
| A   | 3. Promise         | Receives a rejection from the open promise with `AppTimeout` from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

- `2.0-AOpensBWithWrongContext`: Perform above test
- `2.0-AOpensBNoListen`: Skip `fdc3.addContextListener()` above (i.e. no listener was added).  `AppTimeout` should still occur as in 3. 

## 5. Metadata & Instance Test Cases

You will need to pre-populate the AppDirectory with the following items:

| App | Required Metadata                        |
|-----|------------------------------------------|
| A   | Generic AppD Record which contains at least the following fields:<br>- `name`<br>- `version`<br>- `title`<br>- `tooltip`<br>- `description`<br>- `icons` (`Array<Icon>`)<br>- `screenshots` (`Array<Image>`)<br>- `interop.intents.listensFor` (`aTestingIntent` with at least context type `testContextX`)  |


| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. getAppMetadata    | Retrieve metadata for the configured app with `const metadata1 = fdc3.getAppMetadata({appId: "<A's appId>"})`  |
| Test   | 2. Confirm AppMetadata    | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. An `instanceId` should NOT be set  |

- `2.0-GetAppMetadata`: perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Open1    | `const appIdentifier1 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.  |
| Test   | 2. Open2    | `const appIdentifier2 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.  Confirm that the `instanceId` differs from the first instance.  |
| Test   | 3. getAppMetadata1    | Retrieve metadata for the first instance of the app with `const metadata1 = fdc3.getAppMetadata(appIdentifier1)`  |
| Test   | 4. Confirm Instance AppMetadata1    | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. An `instanceId` should be provided, confirm that it matches the one in `appIdentifier1`  |
| Test   | 5. getAppMetadata2    | Retrieve metadata for the first instance of the app with `const metadata2 = fdc3.getAppMetadata(appIdentifier2)`  |
| Test   | 6. Confirm Instance AppMetadata2    | An `instanceId` should be provided, confirm that it matches the one in `appIdentifier2`  |

- `2.0-AppInstanceMetadata`: Perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. OpenFindInstances1    | `let appIdentifier1 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.  |
| Test   | 2. OpenFindInstances2 | `let appIdentifier2 = await fdc3.open({appId: "<A's appId>"})` to start A again and retrieve another `AppIdentifier` with instance details. Confirm that the `instanceId` differs from the first instance.  |
| Test   | 3. FindInstances    | Retrieve details of open instances with `let instances = await fdc3.findInstances({appId: "<A's appId>"})` confirm that both `appIdentifier1` and `appIdentifier2` are both present in the array.  |
| Test   | 4. RaiseIntent   | Use appIdentifier1 to raise an intent and target that instance, with: `const resolution = fdc3.raiseIntent("aTestingIntent", {"type": "testContextX"}, appIdentifier1)` |
| Test   | 5. ConfirmInstanceMetadata1 | Check that `resolution.source` matches `appIdentifier1` |
| A | 6. ConfirmInstanceMetadata1 | Ensure that the instance of app A represented by `appIdentifier1` received the raised intent |

- `2.0-FindInstances`: Perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. getInfo    | Call `fdc3.getInfo().then((implMetadata) => {  ... subsequent steps ...}` to retrieve the `ImplementationMetadata` for the DesktopAgent<br>**Note that the use of `then` is deliberate and intended to confirm that a promise returned (as this function switched from synchronous to asynchronous in 2.0)**  |
| Test   | 2. ConfirmImplementationMetadata_fdc3Version  | Check that the `fdc3Version` variable is present and at or greater than 2.0 (which you can do with the [`versionIsAtLeast` function from FDC3's Methods.ts](https://github.com/finos/FDC3/blob/add64f8302c6dcdc8437cf0e245101e927b69ec2/src/api/Methods.ts#L207):<br>`const isFDC3v2 = versionIsAtLeast(implMetadata, "2.0")`  |
| Test   | 3. ConfirmImplementationMetadata_provider  | Check that the `provider` variable is present and not an empty string  |
| Test   | 4. ConfirmImplementationMetadata_optionalFeatures  | Check that the `optionalFeatures`, `optionalFeatures.OriginatingAppMetadata` and `optionalFeatures.UserChannelMembershipAPIs` variables are all present and that the latter two provide boolean values  |

- `2.0-GetInfo1`: Perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Open1    | `const appIdentifier1 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details. Confirm that the `AppIdentifier` contains both an `appId` and `instanceId` |
| A | 2. getInfo     |   Call `fdc3.getInfo().then((implMetadata) => {  ... subsequent steps ...}` to retrieve the `ImplementationMetadata` for the DesktopAgent - which should include `AppMetadata` for the retrieving app. |
| A + Test | 3. ConfirmImplementationMetadata_appMetadata  | Check that `implMetadata.appMetadata` contains an `appId` and `instanceId` matching that retrieved in the first step (will require transmission of the details from A to Test or vice-versa). Also compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. |

- `2.0-GetInfo2`: Perform the above steps.

## 6. Intents

_Please note that API calls (and associated test cases) relating to API calls based on the `name` property of an appD record (used to specify a target application) were deprecated in FDC3 2.0 in favour of those based on `AppIdentifier`. Hence, those API calls have become optional and test cases related to them have been removed._

### Setup

We assume 6 context types in the below tests (and associated AppD records):
- `testContextX`
- `testContextY`
- `testContextZ`
- `nonExistentContext` (context object with a unique type that doesn't appear in any of the apps (metadata or otherwise).
- `privateChannelDetails`
- `privateChannelisPrivateResult`

These may be used in a test as a context object `{ "type": "<typeName>" }` or just the base type name.  Where the base type name is used it is surround with "quotes". If not wrapped in quotes assume it is an instance of that context type (generally just an object with a `type` field set to the type name - but occasionally with other data).

You will need to pre-populate the AppDirectory with the following items (some of which will never be started, but must be configured to confirm correct behavior from various API functions):

| App | Usage                                                 | ListensFor `(pattern: intent([context-types…]) (=> result-type)`)                               | On Startup                                                                   |
|-----|-------------------------------------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| A   | Raise Intent tests without results                    | `aTestingIntent(testContextX,testContextZ)`<br/>`sharedTestingIntent1(testContextX) => testContextY` | addContextListener() for given intents                                       |
| B   | Raise Intent tests with Context results               | `bTestingIntent(testContextY)`<br/>`sharedTestingIntent1(testContextX, testContextY) => testContextY` | addContextListener() for given intents                                       |
| C   | Find Intent tests (never started)                     | `cTestingIntent(testContextX) => testContextZ`                                                  | addContextListener() for given intents                                       |
| D   | Find Intent tests (never started)                     | `sharedTestingIntent2(testContextX) => testContextZ`                                            | addContextListener() for given intents                                       |
| E   | Find Intent & Raise Intent with Channel result        | `sharedTestingIntent2(testContextY) => channel`                                                 | addContextListener() for given intents                                       |
| F   | Find Intent & Raise Intent with PrivateChannel result | `sharedTestingIntent2(testContextY) => channel<testContextZ>` *                                 | addContextListener() for given intents                                       |
| G   | Find Intent tests (never started)                     | `sharedTestingIntent2(testContextY)`                                                            | addContextListener() for given intents                                       |
| H   | Raise Intent (bad config/behavior)                    | `sharedTestingIntent2(testContextY) => testContextZ`                                            | -no action                                                                   |
| I   | Raise Intent (bad config/behavior)                    | `sharedTestingIntent2(testContextY) => testContextZ`                                           | addContextListener(‘MadeUpIntent’, ‘MadeUpContext’)                          |
| J   | PrivateChannels are private                           | `privateChannelIIsPrivate(privateChannelId) => privateChannelIsPrivateResult`                   | Tries to retrieve privateChannel sent in the privateChannelId context, fails |
| K   | PrivateChannel lifecycle events                       | `kTestingIntent(testContextX) => channel<testContextZ>`                                         | addContextListener() for given intents                                       |

NB:
- There is no way to indicate in the app directory the difference between a private channel and app channel.
- We assume a final test app `Test` that will discover the Intent support in the others using the API.

Finally, please note that this is a larger set of apps than were required for 1.2 tests. This is due to an increased number of parameters to API calls and AppD records, which multiplies the number of apps required. The apps are all specified here (rather than broken down over multiple issues) to ensure that clashes between test case sets can be worked out here. For example, adding one additional app that works with a particular intent/context pair might corrupt the results of multiple `findIntent` or `raiseIntent` tests. Hence, please stick to the defined type and report any issues you find so that they can be rectified in these definitions.

### Find Intent basic usage

- `2.0-FindIntentAppD`: Calls `fdc3.findIntent(‘aTestingIntent’)`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** `AppMetadata`.
- `2.0-FindNonExistentIntentAppD`: Calls `fdc3.findIntent(‘nonExistentIntent’)`. Rejects with an Error whose `message` is `ResolveError.NoAppsFound` https://fdc3.finos.org/docs/api/ref/Errors#resolveerror
- `2.0-FindIntentAppDRightContext`: Calls `fdc3.findIntent(‘aTestingIntent’, ‘fdc3.testContextX’)`.  Receives promise containing an `AppIntent` with metadata containing `aTestingIntent` and only metadata for app **A**.
- `2.0-FindIntentAppDWrongContext`: Calls `fdc3.findIntent(‘aTestingIntent’, ‘fdc3.testContextY’)`.  Rejects with an Error whose `message` is `ResolveError.NoAppsFound` https://fdc3.finos.org/docs/api/ref/Errors#resolveerror
- `2.0-FindIntentAppDMultiple1`: Calls `fdc3.findIntent(‘sharedTestingIntent2’)`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and metadata for apps  **D**, **E**, **F**, **G**, **H**  and **I** only.
- `2.0-FindIntentAppDMultiple2`: Calls `fdc3.findIntent(‘sharedTestingIntent2’, testContextY)`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and `AppMetadata` for apps  **E**, **F**, **G**, **H**  and **I** only.

### Find Intents By Context

- `2.0-FindIntentByContextSingleContext`: Call `fdc3.findIntentsByContext(testContextX)`.  Should return:
  - `aTestingIntent` (app **A**),
  - `sharedTestingIntent1` (**A**, **B**)
  - `cTestingIntent` (**C**),
  - `sharedTestingIntent2` (**D**)
  - `kTestingIntent` (**K**),
  - AND nothing else.
- `2.0FindIntentByContextWrongIntentAppD`: Calls `fdc3.findIntentsByContext(nonExistentContext)`. Rejects with an Error whose `message` is `ResolveError.NoAppsFound` https://fdc3.finos.org/docs/api/ref/Errors#resolveerror**

### Find Intents By Result Type

- `2.0-FindIntentAppDByResultSingle`: Calls `fdc3.findIntent(‘cTestingIntent’, testContextX, "testContextZ")`.  Receives promise containing an `AppIntent` with metadata containing `cTestingIntent` and only **C** app metadata.
- `2.0-FindIntentAppDByResultSingleNullContext`: Calls `fdc3.findIntent(‘cTestingIntent’, null, "testContextZ")`.  Receives promise containing an `AppIntent` with metadata containing `cTestingIntent` and only **C** app metadata.
- `2.0-FindIntentAppDByResultMultiple`: Calls `fdc3.findIntent("sharedTestingIntent1", testContextX, "testContextY")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent1` and only **B** app metadata.
- `2.0-FindIntentAppDByResultChannel1`: Calls `fdc3.findIntent("sharedTestingIntent2", testContextY, "channel")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and only **E** and **F** app metadata.
- `2.0-FindIntentAppDByResultChannel2`: Calls `fdc3.findIntent("sharedTestingIntent2", testContextY, "channel<testContextZ>")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent1` and only **F** app metadata.

### Raise Intent (Ignoring any result)

| App   | Step           | Details                                                                                           |
|-------|----------------|---------------------------------------------------------------------------------------------------|
| Test  | 1. Raise        | `fdc3.raiseIntent(‘aTestingIntent1’, testContextX)`<br>starts app A.                       |
| A     | 2. Receive Intent & Context | After starting up, A runs `fdc3.addIntentListener(‘aTestingIntent1’)` to register its listener.<br>It then receives `testContextY`, matching that sent by Test |
| Test  | 3. IntentResolution          | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifer` as the `source field` with App A's `appId` and `instanceId` set.**                       |

- `2.0-RaiseIntentSingleResolve`: Perform above test
- `2.0-RaiseIntentTargetedAppResolve`: Repeat the above test, but: 
  - In the first step use `fdc3.raiseIntent(‘aTestingIntent’, testContextY, {"appID": "<Y’s appId>"})` to start app A, 
  - Otherwise, as above.
- `2.0-RaiseIntentTargetedInstanceResolveOpen`: Repeat the above test, but:** 
  - Before the first step, use `let appIdentifier = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.
  - Then in the first step, use `fdc3.raiseIntent(‘aTestingIntent’, testContextX, appIdentifier)` to target the running instance of app A, otherwise, as above.
- `2.0-RaiseIntentTargetedInstanceResolveFindInstances`: Repeat the above test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.
  - Then in the first step, use `fdc3.raiseIntent(‘aTestingIntent’, testContextX, appIdentifier)` to target the running instance of app A, otherwise, as above.
- `2.0-RaiseIntentFailedResolve`: Perform above test, but:
  - Use `fdc3.raiseIntent(‘aTestingIntent’, testContextY)`.  Note that no app supports this intent and context combination.**
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound`.
- `2.0-RaiseIntentFailTargetedAppResolve1`: Perform above test, but:** 
  - Use `fdc3.raiseIntent(‘aTestingIntent’, testContextY, {appId: "<A's appId>"})`.
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound`.
- `2.0-RaiseIntentFailTargetedAppResolve2`: Perform above test, but:
  - Use `fdc3.raiseIntent(‘aTestingIntent’, testContextY, {appId: "NonExistentApp"})`.
  - You should receive a JavaScript Error with the message `ResolveError.TargetAppUnavailable `.
- `2.0-RaiseIntentFailTargetedAppResolve3`: Perform above test, but: 
  - Use `fdc3.raiseIntent(‘sharedTestingIntent2’, testContextY, {appId: "<H's appId>"})`.
  - You should receive a JavaScript Error with the message `ResolveError.IntentDeliveryFailed` (as this app is configured for the intent and context pair, but does not add any intent listeners). 
  - **Note:  Test will need an extended timeout to allow for this to be returned in time by the desktop agent, which will have a vendor-defined timeout.**
- `2.0-RaiseIntentFailTargetedAppResolve4`: Perform above test, but: 
  - `fdc3.raiseIntent(‘sharedTestingIntent2’, testContextY, {appId: "<I's appId>"})`
  - You should receive a JavaScript Error with the message `ResolveError.IntentDeliveryFailed` (as this app is configured for the intent and context pair, but adds intent listeners of the wrong type.
  - **Note:  Test will need an extended timeout to allow for this to be returned in time by the desktop agent, which will have a vendor-defined timeout.**
- `2.0-RaiseIntentFailTargetedAppInstanceResolve1`: Perform above test, but:
  - First spawn an instance of App **A** and collect its `AppIdentifier` with `const appIdentifier = await fdc3.open({appId: "<A's appId>"})`.
  - Then use `fdc3.raiseIntent(‘aTestingIntent’, testContextY, appIdentifier )` to target that instance.  
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound` (since A doesn't support this context type).
- `2.0-RaiseIntentFailTargetedAppInstanceResolve2`: Perform above test, but:
  - Use `fdc3.raiseIntent(‘aTestingIntent’, testContextY, {appId: "<A's appId>", instanceId "NonExistentInstanceId"})`.  
  - You should receive a JavaScript Error with the message `ResolveError.TargetInstanceUnavailable `.

### Raise Intent Result (void result)

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise          | `fdc3.raiseIntent(‘sharedTestingIntent1’, testContextY)`<br>starts app B.                       |
| B       | 2. Receive Intent & Context | After starting up, B runs `fdc3.addIntentListener(‘sharedTestingIntent1’)` to register its listener.<br>It then receives `testContextY`, matching that sent by Test |
| Test   | 3. IntentResolution          | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifer` as the `source field` with App B's `appId` and `instanceId` set.                     |
| Test   | 4. await results          | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.                        |
| B       | 5. return void          | B should return void after a short delay (e.g. 5 seconds).                        |
| Test   | 6. receive void result          | The promise received by Test from `resolution.getResult()` should resolve to void. Confirm that the promise could be retrieved before the handler function returned and that the result was received *after* the result was returned by B, not before. I.e. confirm that `resolution.getResult() does not block until the result is returned, but rather returns a promise that can be awaited.`                      |

- `2.0-RaiseIntentVoidResult5secs`: Perform above test
- `2.0-RaiseIntentVoidResult0secs`: Perform above test, but A should return its result immediately (no delay). Ignore test step 6 (as there is too little time between the IntentResolution and IntentHandler completing).
- `2.0-RaiseIntentVoidResult61secs`: Perform above test, but A should return its result **after 61 seconds** (arbitrary delay to test timeout doesn't occur)

### Raise Intent Result (Context result)

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise          | `fdc3.raiseIntent(‘sharedTestingIntent1’, testContextX)`<br>starts app **B**. |
| B      | 2. Receive Intent & Context | After starting up, B runs `fdc3.addIntentListener(‘sharedTestingIntent1’)` to register its listener.<br>It then receives `testContextX`, matching that sent by Test |
| Test   | 3. IntentResolution          | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifer` as the `source field` with App B's `appId` and `instanceId` set. |
| Test   | 4. await results          | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly. |
| B      | 5. return `testContextY`          | B should return a `testContextY` instance after a short delay (e.g. 5 seconds). |
| Test   | 6. receive context result          | The promise received by Test from `resolution.getResult()` should resolve to the `testContextY` instance. Confirm that the promise could be retrieved before the handler function returned and that the result was received *after* the result was returned by B, not before. I.e. confirm that `resolution.getResult() does not block until the result is returned, but rather returns a promise that can be awaited.`** |

- `2.0-RaiseIntentContextResult5secs`: Perform the above test.
- `2.0-RaiseIntentContextResult0secs`: Perform the previous test but B should return its result immediately (no delay).
- `2.0-RaiseIntentContextResult61secs`: As above, but A should return its result **after 61 seconds** (arbitrary delay to test timeout doesn't occur)

### Raise Intent Result (Channel results)
| App   | Step                          | Details                                                                                           |
|-------|-----------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise Intent          | Test raises an intent with `fdc3.raiseIntent(‘sharedTestingIntent2’, testContextY, {appId: "<E's appId>"})`<br>starts app E. |
| E       | 2. Receive Intent & Context     | After starting up, E runs `fdc3.addIntentListener(‘sharedTestingIntent2’)` to register its listener.<br>It them receives `testContextY`, matching that sent by Test |
| Test   | 3. IntentResolution   | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifer` as the `source field` with App E's `appId` and `instanceId` set.   |
| Test   | 4. await results          | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.  |
| E       | 5. return Channel | E should retrieve a Channel object via `fdc3.getOrCreateChannel("someChannelName")` and return it immediately. |
| Test   | 6. receive Channel result | The promise received by Test from `resolution.getResult()` should resolve to a `Channel` object with the expected id. Confirm that the `type` of the Channel object is "app".
| Test   | 7. addContextListener | Add a context listener to the Channel object via `channelObj.addContextListener("testContextZ", handler)` |
| E       | 8. broadcast context | After a short delay (of a few seconds) E should broadcast a testContextZ context object over the channel, including an id field with a unique identifier set (e.g. a uuid). |
| Test  | 9. receive context | Test should receive the context broadcast by E and confirm that it contains the expected id value. | 

- `2.0-RaiseIntentChannelResult`: Perform the above test
- `2.0-RaiseIntentPrivateChannelResult`: Perform the above test, but:
  - Substitute app F through out - which returns a PrivateChannel result instead of channel.
  - At step 5, the PrivateChannel should be created via`fdc3.createPrivateChannel()`.
  - At step 6 confirm that the type of the channel is "private".

### PrivateChannels cannot be accessed as app channels

| App  | Step                | Details                                                                                                                                    |
|-------|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Create a private channel | Test creates a PrivateChannel with `const privChan = await fdc3.createPrivateChannel();`. Confirm that the Channel has an id.
| Test   | 2. Confirm private channel id is unique | Test creates a second PrivateChannel with `const privChan = await fdc3.createPrivateChannel();`. Confirm that the Channel has an id and that it is distinct from the first channel created . |
| Test   | 3. Retrieve as app channel | Attempt to retrieve the channels as App Channels with `const appChan = await fdc3.getOrCreateChannel(privChan.id)` this should fail with `ChannelError.AccessDenied`  |
| Test   | 4. Raise Intent & await result | Start app J and pass it the id of the second PrivateChannel with `fdc3.raiseIntent("privateChanneliIsPrivate", privateChannelDetails)`, where the context object contains the id of the channel to attempt to retrieve. An IntentResolution should be returned and App J should start. Wait for a result to be returned via `await resolution.getResult()`.
| J | 5. Receive Intent & Context | J should add an Intent Listener and receive the context with `fdc3.addIntentListener("privateChanneliIsPrivate", handler)` |
| J | 6. Retrieve as app channel | J should attempt to retrieve the channel as an App Channel by id with `const appChan = await fdc3.getOrCreateChannel("<idPassedInContext>")` this should fail with `ChannelError.AccessDenied`. Return a privateChannelisPrivateResult back to Test to complete the test. |
| Test   | 7. Receive result | Test receives the result back from J and confirms that the test was passed. | 

- `2.0-PrivateChannelsAreNotAppChannels`: Perform the above test

### PrivateChannel Lifecycle Events

| App  | Step                 | Details                                                                                                                                    |
|-------|-----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise intent | Test raises an intent with `fdc3.raiseIntent(‘kTestingIntent’, testContextX, {appId: "<K's appId>"})`<br>starts app K. |
| K       | 2. Receive Intent & Context     | After starting up, K runs `fdc3.addIntentListener(‘kTestingIntent’)` to register its listener.<br>It them receives `testContextX, matching that sent by Test |
| Test   | 3. IntentResolution   | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifer` as the `source field` with App K's `appId` and `instanceId` set.   |
| Test   | 4. await results          | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.  |
| K       | 5. Create PrivateChannel and setup event listeners | K should create a PrivateChannel object via `const privChan = await fdc3.createPrivateChannel()`,<br>it should then add listeners for the 3 events offered + a context listener via:<br>- `const listener1 = await privChan.onAddContextListener(handler1);`<br>- `const listener2 = await privChan.onUnsubscribe(handler2);`<br>- `const listener3 = await privChan.onDisconnect(handler3);`<br>- `const listener4 = await privChan.addContextListener("testContextX", handler4)`<br>it should then return the PrivateChannel |
| Test   | 6. receive PrivateChannel  | The promise received by Test from `resolution.getResult()` should resolve to a `PrivateChannel` object. Confirm that the `type` of the Channel object is "private".
| Test   | 7. addContextListener | Test should add a context listener to the PrivateChannel object via `const listener1 = privChan.addContextListener("testContextZ", handler)` |
| K       | 8. Receive event & broadcast context | The `onAddContextListener` handler added in step 5 should fire after Test adds its listener. Once it has, K should broadcast a short stream of `testContextZ` objects, with consecutive integer values in them (e.g. 1-5). |
| Test   | 9. Unsubscribe listener | Test should confirm receipt of the expected context objects, in the expected order, broadcast by K. It should then remove its context listener with `listener1.unsubscribe().` |
| K       | 10. Receive unsubscribe event | The event handler registered by K via `onUnsubscribe` should fire. If it does not and the test moves to a subsequent step K should indicate this to the test runner (failing the test).|
| Test   | 11. Broadcast context | Test should broadcast at least one `testContextX` object via the PrivateChannel. |
| K       | 12. Receive context | K should confirm receipt of the expected context. If it does not and the test moves to a subsequent step K should indicate this to the test runner (failing the test).|
| Test   | 13. re-run addContextListener  | Test should (again) add a context listener to the PrivateChannel object via `const listener2 = privChan.addContextListener("testContextZ", handler)` |
| K       | 14. Receive event & broadcast context | The `onAddContextListener` handler added in step 5 should (again) fire after Test adds its listener. Once it has, K should broadcast a short stream of `testContextZ` objects, with consecutive integer values in them (e.g. 6-10). |
| Test   | 15. Disconnect | Test should (again) confirm receipt of the expected context objects, in the expected order, broadcast by K. It should then disconnect from the channel with [`privChan.disconnect().`](https://fdc3.finos.org/docs/api/ref/PrivateChannel#disconnect) |
| K       | 16. Receive events & cleanup | The `onUnsubscribe` handler added in step 5 should (again) fire after Test calls `privChan.disconnect()`. Subsequently, the `onDisconect` handler also added in step 5 should fire. Once it has, K can unsubscribe its listeners, indicate to the test runner that all steps were completed and close. |

- `2.0-PrivateChannelsLifecycleEvents`: Perform the above test**