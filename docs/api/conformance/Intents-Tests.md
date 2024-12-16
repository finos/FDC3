---
id: Intents-Tests
sidebar_label: Intents Tests
title: Intents Tests
hide_title: true
---

# Intents Tests
<!-- markdownlint-disable MD033 -->

_Please note that API calls (and associated test cases) relating to API calls based on the `name` property of an appD record (used to specify a target application) were deprecated in FDC3 2.0 in favour of those based on `AppIdentifier`. Hence, those API calls have become optional and test cases related to them have been removed._

## Setup

We assume 6 context types in the below tests (and associated AppD records):

- `testContextX`
- `testContextY`
- `testContextZ`
- `nonExistentContext` (context object with a unique type that does NOT appear in any of the apps (metadata or otherwise).
- `privateChannelDetails`
- `privateChannelIsPrivateResult`

These may be used in a test as a context object `{ "type": "<typeName>" }` or just the base type name.  Where the base type name is used it is surround with "quotes". If not wrapped in quotes assume it is an instance of that context type (generally just an object with a `type` field set to the type name - but occasionally with other data).

You will need to pre-populate the AppDirectory with the following items (some of which will never be started, but must be configured to confirm correct behavior from various API functions):

| App | Usage                                                 | ListensFor `(pattern: intent([context-types…]) (=> result-type)`)                               | On Startup                                                                   |
|-----|-------------------------------------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| A   | Raise Intent tests without results                    | `aTestingIntent(testContextX,testContextZ)`<br/>`sharedTestingIntent1(testContextX)` | addIntentListener() for given intents                                       |
| B   | Raise Intent tests with Context results               | `bTestingIntent(testContextY)`<br/>`sharedTestingIntent1(testContextX, testContextY) => testContextY` | addIntentListener() for given intents                                       |
| C   | Find Intent tests (never started)                     | `cTestingIntent(testContextX) => testContextZ`                                                  | addIntentListener() for given intents                                       |
| D   | Find Intent tests (never started)                     | `sharedTestingIntent2(testContextX) => testContextZ`                                            | addIntentListener() for given intents                                       |
| E   | Find Intent & Raise Intent with Channel result        | `sharedTestingIntent2(testContextY) => channel`                                                 | addIntentListener() for given intents                                       |
| F   | Find Intent & Raise Intent with PrivateChannel result | `sharedTestingIntent2(testContextY) => channel<testContextZ>` *                                 | addIntentListener() for given intents                                       |
| G   | Find Intent tests (never started)                     | `sharedTestingIntent2(testContextY)`                                                            | addIntentListener() for given intents                                       |
| H   | Raise Intent (bad config/behavior)                    | `sharedTestingIntent2(testContextY) => testContextZ`                                            | - no action                                                                   |
| I   | Raise Intent (bad config/behavior)                    | `sharedTestingIntent2(testContextY) => testContextZ`                                           | addIntentListener(‘MadeUpIntent’, handler)                          |
| J   | PrivateChannels are private                           | `privateChannelIsPrivate(privateChannelDetails) => privateChannelIsPrivateResult`                   | Tries to retrieve privateChannel sent in the privateChannelDetails context, fails |
| K   | PrivateChannel lifecycle events                       | `kTestingIntent(testContextX) => channel<testContextZ>`                                         | addIntentListener() for given intents                                       |

NB:

- There is no way to indicate in the app directory the difference between a private channel and app channel.
- We assume a final test app `Test` that will discover the Intent support in the others using the API.

Finally, please note that this is a larger set of apps than were required for 1.2 tests. This is due to an increased number of parameters to API calls and AppD records, which multiplies the number of apps required. The apps are all specified here (rather than broken down over multiple issues) to ensure that clashes between test case sets can be worked out here. For example, adding one additional app that works with a particular intent/context pair might corrupt the results of multiple `findIntent` or `raiseIntent` tests. Hence, please stick to the defined type and report any issues you find so that they can be rectified in these definitions.

## Find Intent basic usage

- `2.0-FindIntentAppD`: Calls `fdc3.findIntent("aTestingIntent")`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** `AppMetadata`.
- `2.0-FindNonExistentIntentAppD`: Calls `fdc3.findIntent("nonExistentIntent")`. Rejects with an Error whose `message` is [`ResolveError.NoAppsFound`](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror)
- `2.0-FindIntentAppDRightContext`: Calls `fdc3.findIntent("aTestingIntent","testContextX")`.  Receives promise containing an `AppIntent` with metadata containing `aTestingIntent` and only metadata for app **A**.
- `2.0-FindIntentAppDWrongContext`: Calls `fdc3.findIntent("aTestingIntent","testContextY")`.  Rejects with an Error whose `message` is [`ResolveError.NoAppsFound`](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror)
- `2.0-FindIntentAppDMultiple1`: Calls `fdc3.findIntent("sharedTestingIntent2")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and metadata for apps  **D**, **E**, **F**, **G**, **H**  and **I** only.
- `2.0-FindIntentAppDMultiple2`: Calls `fdc3.findIntent("sharedTestingIntent2","testContextY")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and `AppMetadata` for apps  **E**, **F**, **G**, **H**  and **I** only.

## Find Intents By Context

- `2.0-FindIntentByContextSingleContext`: Call `fdc3.findIntentsByContext(testContextX)`.  Should return:
  - `aTestingIntent` (app **A**),
  - `sharedTestingIntent1` (**A**, **B**)
  - `cTestingIntent` (**C**),
  - `sharedTestingIntent2` (**D**)
  - `kTestingIntent` (**K**),
  - AND nothing else.
- `2.0FindIntentByContextWrongIntentAppD`: Calls `fdc3.findIntentsByContext(nonExistentContext)`. Rejects with an Error whose `message` is [`ResolveError.NoAppsFound`](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror)

## Find Intents By Result Type

- `2.0-FindIntentAppDByResultSingle`: Calls `fdc3.findIntent("cTestingIntent",testContextX,"testContextZ")`.  Receives promise containing an `AppIntent` with metadata containing `cTestingIntent` and only **C** app metadata.
- `2.0-FindIntentAppDByResultSingleNullContext`: Calls `fdc3.findIntent("cTestingIntent",null,"testContextZ")`.  Receives promise containing an `AppIntent` with metadata containing `cTestingIntent` and only **C** app metadata.
- `2.0-FindIntentAppDByResultMultiple`: Calls `fdc3.findIntent("sharedTestingIntent1",testContextX,"testContextY")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent1` and only **B** app metadata.
- `2.0-FindIntentAppDByResultChannel1`: Calls `fdc3.findIntent("sharedTestingIntent2",testContextY,"channel")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and only **E** and **F** app metadata.
- `2.0-FindIntentAppDByResultChannel2`: Calls `fdc3.findIntent("sharedTestingIntent2",testContextY,"channel<testContextZ>")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent1` and only **F** app metadata.

## Raise Intent (Ignoring any result)

| App   | Step                        | Details                                                                                           |
|-------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test  | 1. Raise                    | `fdc3.raiseIntent("aTestingIntent",testContextX)`<br />starts app A.                       |
| A     | 2. Receive Intent & Context | After starting up, A runs `fdc3.addIntentListener("aTestingIntent1")` to register its listener.<br />It then receives `testContextX`, matching that sent by Test |
| Test  | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App A's `appId` and `instanceId` set.**                       |

- `2.0-RaiseIntentSingleResolve`: Perform above test
- `2.0-RaiseIntentTargetedAppResolve`: Repeat the above test, but:
  - In the first step use `fdc3.raiseIntent("sharedTestingIntent1",testContextX,{"appID":"<B’s-appId>"})` to start app B,
  - Otherwise, as above.
- `2.0-RaiseIntentTargetedInstanceResolveOpen`: Repeat the above test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId:"<A's-appId>"})` to start A and retrieve its `AppIdentifier` with instance details.
  - Then in the first step, use `fdc3.raiseIntent("aTestingIntent",testContextX,appIdentifier)` to target the running instance of app A.
  - Confirm that the intent is delivered to the correct instance and that another instance is NOT started. Otherwise, as above.
- `2.0-RaiseIntentTargetedInstanceResolveFindInstances`: Repeat the above test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId:"<A's-appId>"})` to start A.
  - Then use `const instances = await fdc3.findInstances({appId:"<A's-appId>"})` to retrieve a list of instances of app A. Confirm that only one is present and retrieve its `AppIdentifier`, confirming that it contains an `instanceId` field that matches that returned by the `fdc3.open` call.
  - Then in the first step, use `fdc3.raiseIntent("aTestingIntent",testContextX,appIdentifier)` to target the running instance of app A.
  - Confirm that the intent is delivered to the correct instance and that another instance is NOT started. Otherwise, as above.
- `2.0-RaiseIntentFailedResolve`: Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextY)`.  Note that no app supports this intent and context combination.**
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound`.
- `2.0-RaiseIntentFailTargetedAppResolve1`: Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextY,{appId:"<A's-appId>"})`.
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound`.
- `2.0-RaiseIntentFailTargetedAppResolve2`: Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextX,{appId:"NonExistentApp"})`.
  - You should receive a JavaScript Error with the message `ResolveError.TargetAppUnavailable`.
- `2.0-RaiseIntentFailTargetedAppResolve3`: Perform above test, but:
  - Use `fdc3.raiseIntent("sharedTestingIntent2",testContextY,{appId:"<H's-appId>"})`.
  - You should receive a JavaScript Error with the message `ResolveError.IntentDeliveryFailed` (as this app is configured for the intent and context pair, but does not add any intent listeners).
  - **Note:  Test will need an extended timeout to allow for this to be returned in time by the desktop agent, which will have a vendor-defined timeout.**
- `2.0-RaiseIntentFailTargetedAppResolve4`: Perform above test, but:
  - `fdc3.raiseIntent("sharedTestingIntent2",testContextY,{appId:"<I's-appId>"})`
  - You should receive a JavaScript Error with the message `ResolveError.IntentDeliveryFailed` (as this app is configured for the intent and context pair, but adds intent listeners of the wrong type.
  - **Note:  Test will need an extended timeout to allow for this to be returned in time by the desktop agent, which will have a vendor-defined timeout.**
- `2.0-RaiseIntentFailTargetedAppInstanceResolve1`: Perform above test, but:
  - First spawn an instance of App **A** and collect its `AppIdentifier` with `const appIdentifier = await fdc3.open({appId:"<A's-appId>"})`.
  - Then use `fdc3.raiseIntent("aTestingIntent",testContextY,appIdentifier)` to target that instance.  
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound` (since A doesn't support this context type).
- `2.0-RaiseIntentFailTargetedAppInstanceResolve2`: Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextX, {appId:"<A's-appId>",instanceId:"NonExistentInstanceId"})`.  
  - You should receive a JavaScript Error with the message `ResolveError.TargetInstanceUnavailable`.

## Raise Intent Result (void result)

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise          | `fdc3.raiseIntent("aTestingIntent",testContextX)`<br />starts app A.                       |
| A      | 2. Receive Intent & Context | After starting up, A runs `fdc3.addIntentListener("aTestingIntent")` to register its listener.<br />It then receives `testContextX`, matching that sent by Test |
| Test   | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App A's `appId` and `instanceId` set.                     |
| Test   | 4. await results            | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.                        |
| A      | 5. return void              | A should return `void` after a short delay (e.g. 5 seconds).                        |
| Test   | 6. receive void result      | The promise received by Test from `resolution.getResult()` should resolve to void. Confirm that the promise could be retrieved before the handler function returned and that the result was received _after_ the result was returned by A, NOT before. I.e. confirm that `resolution.getResult()` does NOT block until the result is returned, but rather returns a promise that can be awaited.                      |

- `2.0-RaiseIntentVoidResult5secs`: Perform above test
- `2.0-RaiseIntentVoidResult0secs`: Perform above test, but A should return its result immediately (no delay). Ignore test step 6 (as there is too little time between the IntentResolution and IntentHandler completing).
- `2.0-RaiseIntentVoidResult61secs`: Perform above test, but A should return its result **after 61 seconds** (arbitrary delay to test timeout does NOT occur)

## Raise Intent Result (Context result)

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise                    | `fdc3.raiseIntent("sharedTestingIntent1",testContextY)`<br />starts app **B**. |
| B      | 2. Receive Intent & Context | After starting up, B runs `fdc3.addIntentListener("sharedTestingIntent1")` to register its listener.<br />It then receives `testContextY`, matching that sent by Test |
| Test   | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App B's `appId` and `instanceId` set. |
| Test   | 4. await results            | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly. |
| B      | 5. return `testContextY`    | B should return a `testContextY` instance after a short delay (e.g. 5 seconds). |
| Test   | 6. receive context result   | The promise received by Test from `resolution.getResult()` should resolve to the `testContextY` instance. Confirm that the promise could be retrieved before the handler function returned and that the result was received _after_ the result was returned by B, NOT before. I.e. confirm that `resolution.getResult()` does NOT block until the result is returned, but rather returns a promise that can be awaited. |

- `2.0-RaiseIntentContextResult5secs`: Perform the above test.
- `2.0-RaiseIntentContextResult0secs`: Perform the previous test but B should return its result immediately (no delay).
- `2.0-RaiseIntentContextResult61secs`: As above, but B should return its result **after 61 seconds** (arbitrary delay to test timeout does NOT occur)

## Raise Intent Result (Channel results)

| App  | Step                        | Details                                                                                           |
|------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Raise Intent             | Test raises an intent with `fdc3.raiseIntent("sharedTestingIntent2",testContextY,{appId:"<E's-appId>"})`<br />starts app E. |
| E    | 2. Receive Intent & Context | After starting up, E runs `fdc3.addIntentListener("sharedTestingIntent2")` to register its listener.<br />It them receives `testContextY`, matching that sent by Test |
| Test | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App E's `appId` and `instanceId` set.   |
| Test | 4. await results            | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.  |
| E    | 5. return Channel           | E should retrieve a Channel object via `fdc3.getOrCreateChannel("someChannelName")` and return it immediately. |
| Test | 6. receive Channel result   | The promise received by Test from `resolution.getResult()` should resolve to a `Channel` object with the expected id. Confirm that the `type` of the Channel object is "app". |
| Test | 7. addContextListener       | Add a context listener to the Channel object via `channelObj.addContextListener("testContextZ",handler)` |
| E    | 8. broadcast context        | After a short delay (of a few seconds) E should broadcast a `testContextZ` context object over the channel, including an `id` field with a unique identifier set (e.g. a uuid). |
| Test | 9. receive context          | Test should receive the context broadcast by E and confirm that it contains the expected `id` value. |

- `2.0-RaiseIntentChannelResult`: Perform the above test
- `2.0-RaiseIntentPrivateChannelResult`: Perform the above test, but:
  - Substitute app F throughout - which returns a PrivateChannel result instead of channel.
  - At step 5, the PrivateChannel should be created via`fdc3.createPrivateChannel()`.
  - At step 6 confirm that the type of the channel is "private".

## PrivateChannels cannot be accessed as app channels

| App  | Step                                      | Details                                                                                           |
|------|-------------------------------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Create a private channel               | Test creates a PrivateChannel with `const privChan = await fdc3.createPrivateChannel()`. Confirm that the Channel has an `id`. |
| Test | 2. Confirm private channel `id` is unique | Test creates a second PrivateChannel with `const privChan = await fdc3.createPrivateChannel();`. Confirm that the Channel has an `id` and that it is distinct from the first channel created. |
| Test | 3. Retrieve as app channel                | Attempt to retrieve the channels as App Channels with `const appChan = await fdc3.getOrCreateChannel(privChan.id)` this should fail with `ChannelError.AccessDenied`  |
| Test | 4. Raise Intent & await result            | Start app J and pass it the id of the second PrivateChannel with `fdc3.raiseIntent("privateChannelIsPrivate", privateChannelDetails)`, where the context object contains the id of the channel to attempt to retrieve. An IntentResolution should be returned and App J should start. Wait for a result to be returned via `await resolution.getResult()`. |
| J    | 5. Receive Intent & Context               | J should add an Intent Listener and receive the context with `fdc3.addIntentListener("privateChannelIsPrivate",handler)` |
| J    | 6. Retrieve as app channel                | J should attempt to retrieve the channel as an App Channel by `id` with `const appChan = await fdc3.getOrCreateChannel("<idPassedInContext>")` this should fail with `ChannelError.AccessDenied`. Return a `privateChannelIsPrivateResult` back to Test to complete the test. |
| Test | 7. Receive result                         | Test receives the result back from J and confirms that the test was passed. |

- `2.0-PrivateChannelsAreNotAppChannels`: Perform the above test

## PrivateChannel Lifecycle Events

| App  | Step                                  | Details                                                                                                                                    |
|------|---------------------------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Raise intent                       | Test raises an intent with `fdc3.raiseIntent(‘"kTestingIntent",testContextX,{appId:"<K's appId>"})`<br />starts app K. |
| K    | 2. Receive Intent & Context           | After starting up, K runs `fdc3.addIntentListener("kTestingIntent")` to register its listener.<br />It them receives `testContextX`, matching that sent by Test |
| Test | 3. IntentResolution                   | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App K's `appId` and `instanceId` set.   |
| Test | 4. await results                      | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.  |
| K    | 5. Create PrivateChannel and setup event listeners | K should create a `PrivateChannel` object via `const privChan = await fdc3.createPrivateChannel()`,<br />it should then add listeners for the 3 events offered + a context listener via:<br />- `const listener1 = await privChan.onAddContextListener(handler1);`<br />- `const listener2 = await privChan.onUnsubscribe(handler2);`<br />- `const listener3 = await privChan.onDisconnect(handler3);`<br />- `const listener4 = await privChan.addContextListener("testContextX", handler4)`<br />it should then return the `PrivateChannel`. |
| Test | 6. receive PrivateChannel             | The promise received by Test from `resolution.getResult()` should resolve to a `PrivateChannel` object. Confirm that the `type` of the Channel object is "private". |
| Test | 7. addContextListener                 | Test should add a context listener to the PrivateChannel object via `const listener1 = privChan.addContextListener("testContextZ",handler)` |
| K    | 8. Receive event & broadcast context  | The `onAddContextListener` handler (`listener1`) added in step 5 should fire after Test adds its listener. Once it has, K should broadcast a short stream of `testContextZ` objects, with consecutive integer values in them (e.g. 1-5). |
| Test | 9. Unsubscribe listener               | Test should confirm receipt of the expected context objects, in the expected order, broadcast by K. It should then remove its context listener with `listener1.unsubscribe().` |
| K    | 10. Receive unsubscribe event         | The event handler registered by K via `onUnsubscribe` should fire. If it does not and the test moves to a subsequent step, K should indicate this to the test runner (failing the test).|
| Test | 11. Broadcast context                 | Test should broadcast at least one `testContextX` object via the PrivateChannel (back to K). |
| K    | 12. Receive context                   | K should confirm receipt of the expected context. If it does not and the test moves to a subsequent step K should indicate this to the test runner (failing the test).|
| Test | 13. re-run addContextListener         | Test should (again) add a context listener to the PrivateChannel object via `const listener2 = privChan.addContextListener("testContextZ",handler)` |
| K    | 14. Receive event & broadcast context | The `onAddContextListener` handler added in step 5 should (again) fire after Test adds its listener. Once it has, K should again broadcast a short stream of `testContextZ` objects, with consecutive integer values in them (e.g. 6-10). |
| Test | 15. Disconnect                        | Test should (again) confirm receipt of the expected context objects, in the expected order, broadcast by K. It should then disconnect from the channel with [`privChan.disconnect().`](https://fdc3.finos.org/docs/api/ref/PrivateChannel#disconnect) |
| K    | 16. Receive events & cleanup          | The `onUnsubscribe` handler added in step 5 should (again) fire after Test calls `privChan.disconnect()`. Subsequently, the `onDisconnect` handler also added in step 5 should fire. Once it has, K can unsubscribe its listeners, indicate to the test runner that all steps were completed and close. |

- `2.0-PrivateChannelsLifecycleEvents`: Perform the above test.

## Resolving Ambiguous Intents

FDC3 Desktop Agent MUST provide a method of resolving ambiguous intents (i.e. those that might be resolved by multiple applications) or unspecified intents (calls to raiseIntentForContext that return multiple options). This is often accomplished by providing a user interface allowing the user to select the desired target application or intent and application.

As the methods of resolving ambiguous intents are often user interactive, it is either difficult or impossible to implement an automated test for this. Hence, manual tests should be performed as a final step in a conformance test. These tests are based on the same applications defined for and used in other intent tests - however a separate manual test app should be provided to enable the test.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Raise Ambiguous Intent | `fdc3.raiseIntent("sharedTestingIntent2",testContextY)` |
| User | 2. Chooser Interaction    | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E`,`F`,`G`,`H` and `I`. |

- `2.0-ResolveAmbiguousIntentTarget`: Perform above steps to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Raise Ambiguous Intent | `fdc3.raiseIntentForContext(testContextY)` |
| User | 2.  Chooser Interaction   | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E`,`F`,`G`,`H` and `I`. |

- `2.0-ResolveAmbiguousContextTarget`:  Perform above steps  to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Open 4 Apps | Use `fdc3.open()` to open 2 instances of App `E` and 2 instances of `F`. |
| Test | 2. Raise Ambiguous Intent | `fdc3.raiseIntent("sharedTestingIntent2",testContextY)` |
| User | 3. Chooser Interaction    | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E (1)`,`F (1)`,`E (2)`,`F (2)` and options to open `G`, `H` and `I` |

- `2.0-ResolveAmbiguousIntentTargetMultiInstance`:  Perform above steps  to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Open 4 Apps            | Use `fdc3.open()` to open 2 instances of App `E` and 2 instances of `F`. |
| Test | 2. Raise Ambiguous Intent | `fdc3.raiseIntentForContext(testContextY)` |
| User | 3.  Chooser Interaction   | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E (1)`,`F (1)`,`E (2)`,`F (2)` and options to open `G`, `H` and `I` |

- `2.0-ResolveAmbiguousContextTargetMultiInstance`: Perform above steps  to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.
