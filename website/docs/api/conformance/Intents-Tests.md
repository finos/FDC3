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
| A   | Raise Intent tests without results                    | `aTestingIntent(testContextX,testContextZ)`<br />`sharedTestingIntent1(testContextX)`           | `addIntentListener()` for given intents                                       |
| B   | Raise Intent tests with Context results               | `bTestingIntent(testContextY)`<br />`sharedTestingIntent1(testContextX, testContextY) => testContextY` | `addIntentListener()` for given intents                                       |
| C   | Find Intent tests (never started)                     | `cTestingIntent(testContextX) => testContextZ`                                                  | `addIntentListener()` for given intents                                       |
| D   | Find Intent tests (never started)                     | `sharedTestingIntent2(testContextX) => testContextZ`                                            | `addIntentListener()` for given intents                                       |
| E   | Find Intent & Raise Intent with Channel result        | `sharedTestingIntent2(testContextY) => channel`                                                 | `addIntentListener()` for given intents                                       |
| F   | Find Intent & Raise Intent with PrivateChannel result | `sharedTestingIntent2(testContextY) => channel<testContextZ>` *                                 | `addIntentListener()` for given intents                                       |
| G   | Find Intent tests (never started)                     | `sharedTestingIntent2(testContextY)`                                                            | `addIntentListener()` for given intents                                       |
| H   | Raise Intent (bad config/behavior)                    | `sharedTestingIntent2(testContextY) => testContextZ`                                            | - no action                                                                   |
| I   | Raise Intent (bad config/behavior)                    | `sharedTestingIntent2(testContextY) => testContextZ`                                           | `addIntentListener("MadeUpIntent", handler)`                          |
| J   | PrivateChannels are private                           | `privateChannelIsPrivate(privateChannelDetails) => privateChannelIsPrivateResult`                   | Tries to retrieve privateChannel sent in the privateChannelDetails context, fails |
| K   | PrivateChannel lifecycle events                       | `kTestingIntent(testContextX) => channel<testContextZ>`                                         | `addIntentListener()` for given intents                                       |
| L   | Intent Context Metadata tests                         | `lTestingIntent(testContextX)`                                                                  | `addIntentListener()` for given intents                                       |

NB:

- There is no way to indicate in the app directory the difference between a private channel and app channel.
- We assume a final test app `Test` that will discover the Intent support in the others using the API.

Finally, please note that this is a larger set of apps than were required for 1.2 tests. This is due to an increased number of parameters to API calls and AppD records, which multiplies the number of apps required. The apps are all specified here (rather than broken down over multiple issues) to ensure that clashes between test case sets can be worked out here. For example, adding one additional app that works with a particular intent/context pair might corrupt the results of multiple `findIntent` or `raiseIntent` tests. Hence, please stick to the defined type and report any issues you find so that they can be rectified in these definitions.

## Find Intent basic usage

- `FindIntentAppD` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("aTestingIntent")`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** `AppMetadata`.
- `FindNonExistentIntentAppD` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("nonExistentIntent")`. Rejects with an Error whose `message` is [`ResolveError.NoAppsFound`](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror)
- `FindIntentAppDRightContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("aTestingIntent","testContextX")`.  Receives promise containing an `AppIntent` with metadata containing `aTestingIntent` and only metadata for app **A**.
- `FindIntentAppDWrongContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("aTestingIntent","testContextY")`.  Rejects with an Error whose `message` is [`ResolveError.NoAppsFound`](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror)
- `FindIntentAppDMultiple1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("sharedTestingIntent2")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and metadata for apps  **D**, **E**, **F**, **G**, **H**  and **I** only.
- `FindIntentAppDMultiple2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("sharedTestingIntent2","testContextY")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and `AppMetadata` for apps  **E**, **F**, **G**, **H**  and **I** only.

## Find Intents By Context

- `FindIntentByContextSingleContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Call `fdc3.findIntentsByContext(testContextX)`.  Should return:
  - `aTestingIntent` (app **A**),
  - `sharedTestingIntent1` (**A**, **B**)
  - `cTestingIntent` (**C**),
  - `sharedTestingIntent2` (**D**)
  - `kTestingIntent` (**K**),
  - `lTestingIntent` (**L**),
  - AND nothing else.
- `FindIntentByContextWrongIntentAppD` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntentsByContext(nonExistentContext)`. Rejects with an Error whose `message` is [`ResolveError.NoAppsFound`](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror)

## Find Intents By Result Type

- `FindIntentAppDByResultSingle` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("cTestingIntent",testContextX,"testContextZ")`.  Receives promise containing an `AppIntent` with metadata containing `cTestingIntent` and only **C** app metadata.
- `FindIntentAppDByResultSingleNullContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("cTestingIntent",null,"testContextZ")`.  Receives promise containing an `AppIntent` with metadata containing `cTestingIntent` and only **C** app metadata.
- `FindIntentAppDByResultMultiple` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("sharedTestingIntent1",testContextX,"testContextY")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent1` and only **B** app metadata.
- `FindIntentAppDByResultChannel1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("sharedTestingIntent2",testContextY,"channel")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent2` and only **E** and **F** app metadata.
- `FindIntentAppDByResultChannel2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Calls `fdc3.findIntent("sharedTestingIntent2",testContextY,"channel<testContextZ>")`.  Receives promise containing an `AppIntent` with metadata containing `sharedTestingIntent1` and only **F** app metadata.

## Raise Intent (Ignoring any result)

| App   | Step                        | Details                                                                                           |
|-------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test  | 1. Raise                    | `fdc3.raiseIntent("aTestingIntent",testContextX)`<br />starts app A.                       |
| A     | 2. Receive Intent & Context | After starting up, A runs `fdc3.addIntentListener("aTestingIntent1")` to register its listener.<br />It then receives `testContextX`, matching that sent by Test |
| Test  | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App A's `appId` and `instanceId` set.**                       |

- `RaiseIntentSingleResolve` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test
- `RaiseIntentTargetedAppResolve` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Repeat the above test, but:
  - In the first step use `fdc3.raiseIntent("sharedTestingIntent1",testContextX,{"appID":"<B’s-appId>"})` to start app B,
  - Otherwise, as above.
- `RaiseIntentTargetedInstanceResolveOpen` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Repeat the above test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId:"<A's-appId>"})` to start A and retrieve its `AppIdentifier` with instance details.
  - Then in the first step, use `fdc3.raiseIntent("aTestingIntent",testContextX,appIdentifier)` to target the running instance of app A.
  - Confirm that the intent is delivered to the correct instance and that another instance is NOT started. Otherwise, as above.
- `RaiseIntentTargetedInstanceResolveFindInstances` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Repeat the above test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId:"<A's-appId>"})` to start A.
  - Then use `const instances = await fdc3.findInstances({appId:"<A's-appId>"})` to retrieve a list of instances of app A. Confirm that only one is present and retrieve its `AppIdentifier`, confirming that it contains an `instanceId` field that matches that returned by the `fdc3.open` call.
  - Then in the first step, use `fdc3.raiseIntent("aTestingIntent",testContextX,appIdentifier)` to target the running instance of app A.
  - Confirm that the intent is delivered to the correct instance and that another instance is NOT started. Otherwise, as above.
- `RaiseIntentFailedResolve` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextY)`.  Note that no app supports this intent and context combination.**
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound`.
- `RaiseIntentFailTargetedAppResolve1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextY,{appId:"<A's-appId>"})`.
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound`.
- `RaiseIntentFailTargetedAppResolve2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextX,{appId:"NonExistentApp"})`.
  - You should receive a JavaScript Error with the message `ResolveError.TargetAppUnavailable`.
- `RaiseIntentFailTargetedAppResolve3` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - Use `fdc3.raiseIntent("sharedTestingIntent2",testContextY,{appId:"<H's-appId>"})`.
  - You should receive a JavaScript Error with the message `ResolveError.IntentDeliveryFailed` (as this app is configured for the intent and context pair, but does not add any intent listeners).
  - **Note:  Test will need an extended timeout to allow for this to be returned in time by the desktop agent, which will have a vendor-defined timeout.**
- `RaiseIntentFailTargetedAppResolve4` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - `fdc3.raiseIntent("sharedTestingIntent2",testContextY,{appId:"<I's-appId>"})`
  - You should receive a JavaScript Error with the message `ResolveError.IntentDeliveryFailed` (as this app is configured for the intent and context pair, but adds intent listeners of the wrong type.
  - **Note:  Test will need an extended timeout to allow for this to be returned in time by the desktop agent, which will have a vendor-defined timeout.**
- `RaiseIntentFailTargetedAppInstanceResolve1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - First spawn an instance of App **A** and collect its `AppIdentifier` with `const appIdentifier = await fdc3.open({appId:"<A's-appId>"})`.
  - Then use `fdc3.raiseIntent("aTestingIntent",testContextY,appIdentifier)` to target that instance.  
  - You should receive a JavaScript Error with the message `ResolveError.NoAppsFound` (since A doesn't support this context type).
- `RaiseIntentFailTargetedAppInstanceResolve2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but:
  - Use `fdc3.raiseIntent("aTestingIntent",testContextX, {appId:"<A's-appId>",instanceId:"NonExistentInstanceId"})`.  
  - You should receive a JavaScript Error with the message `ResolveError.TargetInstanceUnavailable`.

## Raise Intent (`newInstance` preference)

The optional `newInstance` argument to `raiseIntent` lets a calling application express whether it requires a brand-new instance of the target application to be launched (`true`) or that an existing, running instance must be used (`false`). When the argument is omitted the Desktop Agent applies its default resolution behavior. As resolution always remains the purview of the Desktop Agent, a `newInstance` preference is a request that the Desktop Agent MUST honor where possible, but MAY reject according to its own policy.

- `RaiseIntentNewInstanceForced` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the `RaiseIntentSingleResolve` test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId:"<A's-appId>"})` to start an instance of app A, and confirm via `fdc3.findInstances({appId:"<A's-appId>"})` that exactly one instance is running.
  - Then in the first step, use `fdc3.raiseIntent("aTestingIntent",testContextX,{appId:"<A's-appId>"},true)` to request that a **new instance** be launched.
  - Confirm via `fdc3.findInstances({appId:"<A's-appId>"})` that a **second** instance has been started, and that the `instanceId` in the `IntentResolution`'s `source` does NOT match the instance opened in the first step.
- `RaiseIntentExistingInstanceRequired` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the `RaiseIntentSingleResolve` test, but:
  - Before the first step, use `let appIdentifier = await fdc3.open({appId:"<A's-appId>"})` to start an instance of app A, and confirm via `fdc3.findInstances({appId:"<A's-appId>"})` that exactly one instance is running.
  - Then in the first step, use `fdc3.raiseIntent("aTestingIntent",testContextX,{appId:"<A's-appId>"},false)` to require that an **existing instance** be used.
  - Confirm that the intent is delivered to the existing instance (the `instanceId` in the `IntentResolution`'s `source` matches `appIdentifier.instanceId`) and that NO new instance is started (`fdc3.findInstances` still returns exactly one instance).
- `RaiseIntentFailExistingInstanceRequired` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the `RaiseIntentSingleResolve` test, but:
  - Ensure that no instance of app A is running.
  - Use `fdc3.raiseIntent("aTestingIntent",testContextX,{appId:"<A's-appId>"},false)` to require that an existing instance be used.
  - You should receive a JavaScript Error with the message `ResolveError.TargetInstanceUnavailable` (as there is no running instance to deliver the intent to and a new instance must not be launched).

## Raise Intent Result (void result)

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise          | `fdc3.raiseIntent("aTestingIntent",testContextX)`<br />starts app A.                       |
| A      | 2. Receive Intent & Context | After starting up, A runs `fdc3.addIntentListener("aTestingIntent")` to register its listener.<br />It then receives `testContextX`, matching that sent by Test |
| Test   | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App A's `appId` and `instanceId` set.                     |
| Test   | 4. await results            | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.                        |
| A      | 5. return void              | A should return `void` after a short delay (e.g. 5 seconds).                        |
| Test   | 6. receive void result      | The promise received by Test from `resolution.getResult()` should resolve to void. Confirm that the promise could be retrieved before the handler function returned and that the result was received _after_ the result was returned by A, NOT before. I.e. confirm that `resolution.getResult()` does NOT block until the result is returned, but rather returns a promise that can be awaited.                      |

- `RaiseIntentVoidResult5secs` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test
- `RaiseIntentVoidResult0secs` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but A should return its result immediately (no delay). Ignore test step 6 (as there is too little time between the IntentResolution and IntentHandler completing).
- `RaiseIntentVoidResult61secs` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test, but A should return its result **after 61 seconds** (arbitrary delay to test timeout does NOT occur)

## Raise Intent Result (Context result)

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise                    | `fdc3.raiseIntent("sharedTestingIntent1",testContextY)`<br />starts app **B**. |
| B      | 2. Receive Intent & Context | After starting up, B runs `fdc3.addIntentListener("sharedTestingIntent1")` to register its listener.<br />It then receives `testContextY`, matching that sent by Test |
| Test   | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App B's `appId` and `instanceId` set. |
| Test   | 4. await results            | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly. |
| B      | 5. return `testContextY`    | B should return a `testContextY` instance after a short delay (e.g. 5 seconds). |
| Test   | 6. receive context result   | The promise received by Test from `resolution.getResult()` should resolve to the `testContextY` instance. Confirm that the promise could be retrieved before the handler function returned and that the result was received _after_ the result was returned by B, NOT before. I.e. confirm that `resolution.getResult()` does NOT block until the result is returned, but rather returns a promise that can be awaited. |

- `RaiseIntentContextResult5secs` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above test.
- `RaiseIntentContextResult0secs` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the previous test but B should return its result immediately (no delay).
- `RaiseIntentContextResult61secs` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): As above, but B should return its result **after 61 seconds** (arbitrary delay to test timeout does NOT occur)

## Raise Intent Result Metadata

### `getResultMetadata` with a context result

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise                    | `fdc3.raiseIntent("sharedTestingIntent1", testContextY)` starts app **B**. |
| B      | 2. Receive Intent & Context | B runs `fdc3.addIntentListener("sharedTestingIntent1")` and receives `testContextY`. |
| Test   | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` object. |
| B      | 4. Return plain Context     | B returns a plain `testContextY` instance (no metadata). |
| Test   | 5. await getResultMetadata  | Test calls `await resolution.getResultMetadata()`. |
| Test   | 6. Verify DA metadata       | The returned `ContextMetadata` MUST include `source` (with B's `appId` and `instanceId`), `timestamp` and `traceId` fields generated by the Desktop Agent. |

- `RaiseIntentContextResultMetadata` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the above test.

### `getResultMetadata` with a `ContextWithMetadata` result

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise                    | `fdc3.raiseIntent("sharedTestingIntent1", testContextY)` starts app **B**. |
| B      | 2. Receive Intent & Context | B runs `fdc3.addIntentListener("sharedTestingIntent1")` and receives `testContextY`. |
| Test   | 3. IntentResolution         | The `raiseIntent` call returns an `IntentResolution` object. |
| B      | 4. Return ContextWithMetadata | B returns a `ContextWithMetadata` object: `{ context: testContextY, metadata: { traceId: "app-trace-id", signature: "app-sig", custom: { key: "value" } } }`. |
| Test   | 5. await getResult          | Test calls `await resolution.getResult()`. The result MUST be the plain `testContextY` context, not the `ContextWithMetadata` wrapper. |
| Test   | 6. await getResultMetadata  | Test calls `await resolution.getResultMetadata()`. |
| Test   | 7. Verify merged metadata   | The returned `ContextMetadata` MUST include `source` (B's identity), `timestamp` and `traceId` from the Desktop Agent, AND the app-provided `signature` and `custom` fields. The Desktop Agent's `traceId` MUST take precedence over the app-provided one. |

- `RaiseIntentContextWithMetadataResult` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the above test.

### `getResultMetadata` with a channel or void result

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise                    | `fdc3.raiseIntent("sharedTestingIntent2", testContextY)` starts app **E**. |
| E      | 2. Receive & return Channel | E returns a Channel (or void). |
| Test   | 3. await getResultMetadata  | Test calls `await resolution.getResultMetadata()`. |
| Test   | 4. Verify DA-only metadata  | The returned `ContextMetadata` MUST include `source`, `timestamp` and `traceId` generated by the Desktop Agent. No app-provided `signature` or `custom` fields should be present. |

- `RaiseIntentChannelResultMetadata` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the above test with a Channel result.
- `RaiseIntentVoidResultMetadata` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the above test with a void result.


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

- `RaiseIntentChannelResult` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above test
- `RaiseIntentPrivateChannelResult` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above test, but:
  - Substitute app F throughout - which returns a PrivateChannel result instead of channel.
  - At step 5, the PrivateChannel should be created via`fdc3.createPrivateChannel()`.
  - At step 6 confirm that the type of the channel is "private".

## PrivateChannels cannot be accessed as app channels

| App  | Step                                      | Details                                                                                           |
|------|-------------------------------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Create a private channel               | Test creates a PrivateChannel with `const privChan = await fdc3.createPrivateChannel()`. Confirm that the Channel has an `id`. |
| Test | 2. Confirm private channel `id` is unique | Test creates a second PrivateChannel with `const privChan2 = await fdc3.createPrivateChannel();`. Confirm that the Channel has an `id` and that it is distinct from the first channel created. |
| Test | 3. Retrieve as app channel                | Attempt to retrieve the channels as App Channels with `const appChan = await fdc3.getOrCreateChannel(privChan.id)` this should fail with `ChannelError.AccessDenied`  |
| Test | 4. Raise Intent & await result            | Start app J and pass it the id of the second PrivateChannel with `fdc3.raiseIntent("privateChannelIsPrivate", privateChannelDetails)`, where the context object contains the id of the channel to attempt to retrieve. An IntentResolution should be returned and App J should start. Wait for a result to be returned via `await resolution.getResult()`. |
| J    | 5. Receive Intent & Context               | J should add an Intent Listener and receive the context with `fdc3.addIntentListener("privateChannelIsPrivate",handler)` |
| J    | 6. Retrieve as app channel                | J should attempt to retrieve the channel as an App Channel by `id` with `const appChan = await fdc3.getOrCreateChannel("<idPassedInContext>")` this should fail with `ChannelError.AccessDenied`. Return a `privateChannelIsPrivateResult` back to Test to complete the test. |
| Test | 7. Receive result                         | Test receives the result back from J and confirms that the test was passed. |

- `PrivateChannelsAreNotAppChannels` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above test

## PrivateChannel Lifecycle Events

| App  | Step                                       | Details                                                                                                                                    |
|------|--------------------------------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Raise intent                            | Test raises an intent with `fdc3.raiseIntent("kTestingIntent", testContextX, {appId: "<K's appId>"})`<br />starts app K. |
| K    | 2. Receive Intent & Context                | After starting up, K runs `fdc3.addIntentListener("kTestingIntent")` to register its listener.<br />It them receives `testContextX`, matching that sent by Test |
| Test | 3. IntentResolution                        | The `raiseIntent` call returns an `IntentResolution` Object with an `AppIdentifier` as the `source field` with App K's `appId` and `instanceId` set.   |
| Test | 4. await results                           | Test should `await resolution.getResult()` on the `IntentResolution` object returned in the previous step. A promise should be returned quickly.  |
| K    | 5. Create PrivateChannel & event listeners | K should create a `PrivateChannel` object via `const privChan = await fdc3.createPrivateChannel()`,<br />it should then add listeners for the 3 events offered + a context listener via:<br />- `const listener1 = await privChan.addEventListener("addContextListener", handler1);`<br />- `const listener2 = await privChan.addEventListener("unsubscribe", handler2);`<br />- `const listener3 = await privChan.addEventListener("disconnect", handler3);`<br />- `const listener4 = await privChan.addEventListener(null, handler4);`<br />- `const listener5 = await privChan.addContextListener("testContextX", handler5)`<br />it should then return the `PrivateChannel`. |
| Test | 6. receive PrivateChannel                  | The promise received by Test from `resolution.getResult()` should resolve to a `PrivateChannel` object. Confirm that the `type` of the Channel object is "private". |
| Test | 7. addContextListener                      | Test should add a context listener to the PrivateChannel object via `const testListener1 = privChan.addContextListener("testContextZ", contextHandler)` |
| K    | 8. Receive event & broadcast context       | The handlers for both the "addContextListener" event (`handler1`) and all events (`handler4`) added in step 5 should fire after Test adds its listener. Once it has, K should broadcast a short stream of `testContextZ` objects, with consecutive integer values in them (e.g. 1-5). |
| Test | 9. Unsubscribe listener                    | Test should confirm receipt of the expected context objects, in the expected order, broadcast by K. It should then remove its context listener with `testListener1.unsubscribe().` |
| K    | 10. Receive unsubscribe event              | The handlers for both the "unsubscribe" event (`handler2`) and all events registered by K (`handler4`) should fire. If either does not and the test moves to a subsequent step, K should indicate this to the test runner (failing the test).|
| Test | 11. Broadcast context                      | Test should broadcast at least one `testContextX` object via the PrivateChannel (back to K). |
| K    | 12. Receive context                        | K should confirm receipt of the expected context. If it does not and the test moves to a subsequent step K should indicate this to the test runner (failing the test).|
| Test | 13. re-run addContextListener              | Test should (again) add a context listener to the PrivateChannel object via `const testListener2 = privChan.addContextListener("testContextZ", contextHandler)` |
| K    | 14. Receive event & broadcast context      | Both the "addContextListener" event handler (`handler1`) and handler for all events (`handler4`) added in step 5 should (again) fire after Test adds its listener. Once it has, K should again broadcast a short stream of `testContextZ` objects, with consecutive integer values in them (e.g. 6-10). |
| Test | 15. Disconnect                             | Test should (again) confirm receipt of the expected context objects, in the expected order, broadcast by K. It should then disconnect from the channel with [`privChan.disconnect().`](https://fdc3.finos.org/docs/api/ref/PrivateChannel#disconnect) |
| K    | 16. Receive events & cleanup               | Both the "unsubscribe" event handler (`handler2`) and handler for all events (`handler4`) added in step 5 should (again) fire after Test calls `privChan.disconnect()`. Subsequently, both the "disconnect" handler (`handler3`) and handler for all events (`handler4`) also added in step 5 should fire. Once they have, K can unsubscribe its listeners, indicate to the test runner that all steps were completed and close. |

- `PrivateChannelsLifecycleEvents`: ![2.2+](https://img.shields.io/badge/FDC3-2.2+-purple) Perform the above test.

## Resolving Ambiguous Intents

An FDC3 Desktop Agent MUST provide a method of resolving ambiguous intents (i.e. those that might be resolved by multiple applications) or unspecified intents (calls to raiseIntentForContext that return multiple options). This is often accomplished by providing a user interface allowing the user to select the desired target application or intent and application.

As the methods of resolving ambiguous intents are often user interactive, it is either difficult or impossible to implement an automated test for this. Hence, manual tests should be performed as a final step in a conformance test. These tests are based on the same applications defined for and used in other intent tests - however a separate manual test app should be provided to enable the test.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Raise Ambiguous Intent | `fdc3.raiseIntent("sharedTestingIntent2",testContextY)` |
| User | 2. Chooser Interaction    | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E`,`F`,`G`,`H` and `I`. |

- `ResolveAmbiguousIntentTarget` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above steps to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Raise Ambiguous Intent | `fdc3.raiseIntentForContext(testContextY)` |
| User | 2.  Chooser Interaction   | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E`,`F`,`G`,`H` and `I`. |

- `ResolveAmbiguousContextTarget` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):  Perform above steps  to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Open 4 Apps | Use `fdc3.open()` to open 2 instances of App `E` and 2 instances of `F`. |
| Test | 2. Raise Ambiguous Intent | `fdc3.raiseIntent("sharedTestingIntent2",testContextY)` |
| User | 3. Chooser Interaction    | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E (1)`,`F (1)`,`E (2)`,`F (2)` and options to open `G`, `H` and `I` |

- `ResolveAmbiguousIntentTargetMultiInstance` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):  Perform above steps  to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Open 4 Apps            | Use `fdc3.open()` to open 2 instances of App `E` and 2 instances of `F`. |
| Test | 2. Raise Ambiguous Intent | `fdc3.raiseIntentForContext(testContextY)` |
| User | 3.  Chooser Interaction   | A method of resolving the ambiguous request is provided (such as a User Interface allowing the user to choose an application or instance) for choosing one of `E (1)`,`F (1)`,`E (2)`,`F (2)` and options to open `G`, `H` and `I` |

- `ResolveAmbiguousContextTargetMultiInstance` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above steps  to invoke intent resolution for an unspecified target with multiple options. Confirm that test is able to complete successfully.

## Destructured Raise Intent (Ignoring any result)

| App   | Step                        | Details                                                                                           |
|-------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test  | 1. Destructure raiseIntent  | Destructure raiseIntent from DesktopAgent: <br />`const { raiseIntent } = fdc3`                 |
| Test  | 2. Raise Intent             | Use destructured method: <br />`raiseIntent("aTestingIntent",testContextX)`<br />starts app A.  |
| A     | 3. Receive Intent & Context | After starting up, A runs `fdc3.addIntentListener("aTestingIntent")` to register its listener.<br />It then receives `testContextX`, matching that sent by Test |
| Test  | 4. IntentResolution         | The destructured `raiseIntent` call returns an `IntentResolution` Object with App A's details   |

- `RaiseIntentSingleResolve-Destructured` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test to verify destructured raiseIntent works correctly.

## Destructured Raise Intent Result (Context result)

| App    | Step                        | Details                                                                                           |
|--------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. Raise Intent             | `fdc3.raiseIntent("sharedTestingIntent1",testContextY)`<br />starts app **B**. |
| B      | 2. Receive Intent & Context | B receives context and prepares to return `testContextY` |
| Test   | 3. Destructure getResult    | Destructure getResult from IntentResolution: <br />`const { getResult } = resolution` |
| Test   | 4. Await Destructured Result | Use destructured method: <br />`await getResult()` |
| B      | 5. Return Context           | B returns a `testContextY` instance |
| Test   | 6. Receive Result           | Confirm destructured getResult returns the expected context |

- `RaiseIntentContextResult5secs-Destructured` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test to verify destructured getResult works correctly.

## Destructured Raise Intent Result (Channel results)

| App  | Step                        | Details                                                                                           |
|------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Raise Intent             | `fdc3.raiseIntent("sharedTestingIntent2",testContextY,{appId:"<E's-appId>"})`<br />starts app E. |
| E    | 2. Return Channel           | E returns a Channel object |
| Test | 3. Destructure getResult    | `const { getResult } = resolution` |
| Test | 4. Get Channel              | `const channel = await getResult()` |
| Test | 5. Destructure Channel Methods | `const { addContextListener, broadcast } = channel` |
| Test | 6. Use Destructured Methods | Use destructured methods to add listener and verify broadcast works |

- `RaiseIntentChannelResult-Destructured` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test to verify destructured channel methods work correctly.

## Avoiding Adding Multiple Intent Listeners

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add Intent Listener            | App performs `fdc3.addIntentListener("aTestingIntent1")`. |
| Test | 2. Perform Step 1 again | App performs `fdc3.addIntentListener("aTestingIntent1")` again. |

- `MultipleAddingOfTheSameIntentListenerCausesIntentListenerConflict` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps to which should cause `IntentListenerConflict` error.

A new listener conflicts with an existing one for the same intent when either listener is **unfiltered** (added via `addIntentListener`, so it handles all context types) or when their declared context types **overlap**. The following cases all cause an `IntentListenerConflict` error:

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add Intent Listener            | App performs `fdc3.addIntentListener("aTestingIntent1")`. |
| Test | 2. Add filtered Intent Listener | App performs `fdc3.addIntentListenerWithContext("aTestingIntent1", "fdc3.instrument")`. |

- `AddingFilteredIntentListenerWhenUnfilteredExistsCausesIntentListenerConflict` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps which should cause an `IntentListenerConflict` error (the existing unfiltered listener handles all context types).

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add filtered Intent Listener | App performs `fdc3.addIntentListenerWithContext("aTestingIntent1", "fdc3.instrument")`. |
| Test | 2. Add Intent Listener | App performs `fdc3.addIntentListener("aTestingIntent1")`. |

- `AddingUnfilteredIntentListenerWhenFilteredExistsCausesIntentListenerConflict` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps which should cause an `IntentListenerConflict` error (the new unfiltered listener handles all context types, overlapping the existing filtered listener).

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add filtered Intent Listener | App performs `fdc3.addIntentListenerWithContext("aTestingIntent1", ["fdc3.instrument", "fdc3.contact"])`. |
| Test | 2. Add overlapping filtered Intent Listener | App performs `fdc3.addIntentListenerWithContext("aTestingIntent1", ["fdc3.contact", "fdc3.order"])`. |

- `AddingFilteredIntentListenerWithOverlappingContextCausesIntentListenerConflict` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps which should cause an `IntentListenerConflict` error (the declared context types overlap on `fdc3.contact`).

### Allowed Intent Listener Combinations

Filtered listeners for the same intent whose declared context types do not overlap MUST be allowed:

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add filtered Intent Listener | App performs `fdc3.addIntentListenerWithContext("aTestingIntent1", "fdc3.instrument")`. |
| Test | 2. Add non-overlapping filtered Intent Listener | App performs `fdc3.addIntentListenerWithContext("aTestingIntent1", "fdc3.order")`. |

- `AddingFilteredIntentListenersWithDifferentContextsIsAllowed` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps which should successfully add both listeners (no error thrown).

Listeners for **different** intents MUST be allowed, regardless of whether they are filtered or unfiltered:

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add Intent Listener | App performs `fdc3.addIntentListener("aTestingIntent1")`. |
| Test | 2. Add Intent Listener for a different intent | App performs `fdc3.addIntentListener("aTestingIntent12")`. |

- `AddingIntentListenersForDifferentIntentsIsAllowed` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps which should successfully add both listeners (no error thrown).

### Re-adding an Intent Listener after Unsubscribe

Unsubscribing an intent listener MUST remove it as a source of conflict, so that a new listener that would previously have been rejected with an `IntentListenerConflict` error can be added successfully. This ensures an application can replace a listener for an intent (for example to change the context types it handles) without restarting:

| App  | Step                      | Details |
|------|---------------------------|---------|
| Test | 1. Add Intent Listener            | App performs `const listener = await fdc3.addIntentListener("aTestingIntent1")`, saving the returned `Listener` object. |
| Test | 2. Unsubscribe from the intent | App removes the listener by performing `await listener.unsubscribe()`. |
| Test | 3. Add Intent Listener again | App performs `fdc3.addIntentListener("aTestingIntent1")` again. As the previous listener has been removed there is no longer a conflict, so this MUST resolve successfully (no `IntentListenerConflict` error is thrown) and return a new `Listener`. |

- `MultipleAddingOfTheSameIntentListenerAfterUnsubscribe` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above steps, which should successfully add the listener again without an `IntentListenerConflict` error being thrown.
