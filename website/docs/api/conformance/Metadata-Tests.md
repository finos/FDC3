---
id: Metadata-Tests
sidebar_label: Metadata Tests
title: Metadata Tests
hide_title: true
---

# Metadata & Instance Test Cases
<!-- markdownlint-disable MD033 -->

You will need to pre-populate the AppDirectory with the following items:

| App | Required Metadata                        |
|-----|------------------------------------------|
| A   | Generic AppD Record which contains at least the following fields:<br />- `name`<br />- `version`<br />- `title`<br />- `tooltip`<br />- `description`<br />- `icons` (`Array<Icon>`)<br />- `screenshots` (`Array<Image>`)<br />- `interop.intents.listensFor` (`aTestingIntent` with at least context type `testContextX`)  |

## Retrieve `AppMetadata`

| App    | Step              | Details                                                                                           |
|--------|-------------------|---------------------------------------------------------------------------------------------------|
| Test   | 1. getAppMetadata | Retrieve metadata for the configured app A with <br/> `const metadata1 = await fdc3.getAppMetadata({appId:"<A's-appId>"})`  |
| Test   | 2. Confirm        | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. An `instanceId` should NOT be set  |

- `GetAppMetadata` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): perform the above steps.

## Instance Metadata

| App  | Step               | Details                                                                                           |
|------|--------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Open1           | Open a first instance of App A using <br/> `const appIdentifier1 = await fdc3.open({appId: "<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId`.  |
| Test | 2. Open2           | Open a second instance of App A using <br />`const appIdentifier2 = await fdc3.open({appId: "<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId` and that its value differs from that returned for the first instance. |
| Test | 3. getAppMetadata1 | Retrieve metadata for the first instance of the app with<br/> `const metadata1 = fdc3.getAppMetadata(appIdentifier1)` |
| Test | 4. Confirm1        | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches.  |
| Test | 5. getAppMetadata2 | Retrieve metadata for the second instance of the app with <br/>`const metadata2 = fdc3.getAppMetadata(appIdentifier2)`  |
| Test | 6. Confirm2        | An `instanceId` should be provided, confirm that it matches the one in `appIdentifier2`  |

- `AppInstanceMetadata` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above steps.

## Setting Instance Metadata

| App      | Step                   | Details                                                                                           |
|----------|------------------------|---------------------------------------------------------------------------------------------------|
| Test     | 1. Open                | Open an instance of App A using <br/> `const appIdentifier = await fdc3.open({appId: "<A's-appId>"}, { type: "updateInstanceMetadataAppContext", title: "<a test title>" })` <br/>and confirm that its `AppIdentifier` contains an `instanceId`. |
| A        | 2. updateInstanceMetadata | On launch, the opened instance reads the title from the context it received and sets its instance metadata with <br/> `await fdc3.updateInstanceMetadata({ title: "<a test title>" })`, confirms that the returned promise resolves, and signals completion to the Test app via a control channel broadcast. |
| Test     | 3. getAppMetadata      | After receiving the completion signal, retrieve metadata for the instance with <br/> `const metadata = await fdc3.getAppMetadata(appIdentifier)` |
| Test     | 4. Confirm             | Confirm that `metadata.instanceId` matches the one in `appIdentifier` and that `metadata.instanceMetadata.title` equals the title set in step 2, demonstrating that metadata set by an instance is merged and returned to other apps via `getAppMetadata`. |

- `UpdateInstanceMetadata1` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the above steps.

| App      | Step                   | Details                                                                                           |
|----------|------------------------|---------------------------------------------------------------------------------------------------|
| Test     | 1. Open                | Open an instance of App A using <br/> `const appIdentifier = await fdc3.open({appId: "<A's-appId>"}, { type: "updateInstanceMetadataAppContext", title: "<a test title>" })` <br/>and confirm that its `AppIdentifier` contains an `instanceId`. |
| A        | 2. updateInstanceMetadata | On launch, the opened instance sets its instance metadata with <br/> `await fdc3.updateInstanceMetadata({ title: "<a test title>" })` and signals completion to the Test app via a control channel broadcast. |
| Test     | 3. findInstances       | After receiving the completion signal, retrieve the instances with <br/> `const instances = await fdc3.findInstances({appId: "<A's-appId>"})` |
| Test     | 4. Confirm             | Confirm that the `AppMetadata` entry in `instances` whose `instanceId` matches `appIdentifier` has an `instanceMetadata.title` equal to the title set in step 2, demonstrating that metadata set by an instance is returned to other apps via `findInstances`. |

- `UpdateInstanceMetadata2` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform the above steps.

## Finding Instances

| App  | Step              | Details                                                                                           |
|------|-------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. Open1          | Open the first instance of App A using <br/> `const appIdentifier1 = await fdc3.open({appId:"<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId`.  |
| Test | 2. Open2          | Open a second instance of App A using <br />`const appIdentifier2 = await fdc3.open({appId:"<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId` and that its value differs from that returned for the first instance. |
| Test | 3. FindInstances  | Retrieve details of open instances of app A with <br/> `let instances = await fdc3.findInstances({appId:"<A's-appId>"})` <br/> confirm that both `appIdentifier1` and `appIdentifier2` are both present in the array. |
| Test | 4. RaiseIntent    | Use `appIdentifier1` to raise an intent and target that instance, with<br/> `const resolution = fdc3.raiseIntent("aTestingIntent",{"type":"testContextX"},appIdentifier1)` |
| Test | 5. Confirm1       | Check that `resolution.source` matches `appIdentifier1` |
| A    | 6. ConfirmReceipt | Ensure that the instance of app A represented by `appIdentifier1` received the raised intent |

- `FindInstances` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above steps.

## Getting Info For The Agent

| App  | Step             | Details                                                                                           |
|------|------------------|---------------------------------------------------------------------------------------------------|
| Test | 1. getInfo       | Retrieve the `ImplementationMetadata` for the DesktopAgent with <br/> - `fdc3.getInfo().then((implMetadata) => { subsequent steps }`   <br />**Note that the use of `then` is deliberate and intended to confirm that a promise returned (as this function switched from synchronous to asynchronous in 2.0)**|
| Test | 2. CheckVersion  | Check that the `fdc3Version` variable is present and at or greater than:  <br /> - 2.0  <br />(which you can do with the [`versionIsAtLeast` function from FDC3's Methods.ts](https://github.com/finos/FDC3/blob/add64f8302c6dcdc8437cf0e245101e927b69ec2/src/api/Methods.ts#L207):<br />`const isFDC3v2 = versionIsAtLeast(implMetadata, "2.0")`  |
| Test | 3. CheckProvider | Check that the `provider` variable is present and not an empty string  |
| Test | 4. CheckFeatures | Check that the `optionalFeatures` and `optionalFeatures.UserChannelMembershipAPIs` variables are present and that the latter provides a boolean value. ![3.0](https://img.shields.io/badge/FDC3-3.0-purple) Also check that `optionalFeatures.DesktopAgentBridging` is present and provides a boolean value. |

- `GetInfo1` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above steps.

| App      | Step       | Details                                                                                           |
|----------|------------|---------------------------------------------------------------------------------------------------|
| Test     | 1. Open1   | Start an instance of App A with <br/>`const appIdentifier1 = await fdc3.open({appId:"<A's-appId>"})` <br /> retrieve its `AppIdentifier` with instance details. Confirm that the `AppIdentifier` contains both an `appId` and `instanceId` |
| A        | 2 .getInfo |   Retrieve the `ImplementationMetadata` for the DesktopAgent with: <br  />`fdc3.getInfo().then((implMetadata) => {  ... subsequent steps ...}` <br/> This should include `AppMetadata` for the retrieving app. |
| A + Test | 3. Confirm | Check that `implMetadata.appMetadata` contains an `appId` and `instanceId` matching that retrieved in the first step (will require transmission of the details from A to Test or vice-versa). Also compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. |

- `GetInfo2` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform the above steps.

## Context Metadata on Broadcast

![3.0](https://img.shields.io/badge/FDC3-3.0-purple) In FDC3 3.0, `ContextMetadata` was introduced as a required second argument to `ContextHandler` and `IntentHandler` callbacks. The Desktop Agent MUST provide `source` and `timestamp` fields. If the broadcasting app provides a `traceId`, the Desktop Agent MUST forward it; if not, the Desktop Agent MAY generate one. The `signature` and `custom` fields, if provided by the broadcasting app, MUST be forwarded.

| App | Step                  | Details                                                                          |
|-----|-----------------------|----------------------------------------------------------------------------------|
| A   | 1. addContextListener | A adds a typed Context Listener using `addContextListener("fdc3.instrument",handler)`. The handler should accept both `context` and `metadata` arguments. |
| A   | 2. joinUserChannel    | A joins the first available (non-global) user channel. |
| B   | 3. joinUserChannel    | B joins the same channel as A. |
| B   | 4. Broadcast          | B broadcasts an `fdc3.instrument` context to the channel using `fdc3.broadcast(<fdc3.instrument>)`. |
| A   | 5. Receive Context & Metadata | A receives the instrument context matching that sent by B. A also receives a `ContextMetadata` object as the second argument to the handler. |
| A   | 6. Validate Metadata  | Check that `metadata.source` is an `AppIdentifier` with at least `appId` set, matching B's identity. Check that `metadata.timestamp` is a valid `Date`. |

- `UCContextMetadataOnBroadcast` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

## Context Metadata with App-Provided traceId

| App | Step                  | Details                                                                          |
|-----|-----------------------|----------------------------------------------------------------------------------|
| A   | 1. addContextListener | A adds a typed Context Listener using `addContextListener("fdc3.instrument",handler)`. |
| A   | 2. joinUserChannel    | A joins the first available (non-global) user channel. |
| B   | 3. joinUserChannel    | B joins the same channel as A. |
| B   | 4. Broadcast with metadata | B broadcasts an `fdc3.instrument` context with metadata: `fdc3.broadcast(<fdc3.instrument>, { traceId: "test-trace-123" })`. |
| A   | 5. Receive & Validate | A receives the context and metadata. Check that `metadata.traceId` equals `"test-trace-123"`. Check that `metadata.source` and `metadata.timestamp` are also present. |

- `UCContextMetadataTraceId` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

## Context Metadata with signature and custom fields

| App | Step                  | Details                                                                          |
|-----|-----------------------|----------------------------------------------------------------------------------|
| A   | 1. addContextListener | A adds a typed Context Listener using `addContextListener("fdc3.instrument",handler)`. |
| A   | 2. joinUserChannel    | A joins the first available (non-global) user channel. |
| B   | 3. joinUserChannel    | B joins the same channel as A. |
| B   | 4. Broadcast with metadata | B broadcasts with metadata: `fdc3.broadcast(<fdc3.instrument>, { signature: "sig-abc", custom: { region: "EMEA" } })`. |
| A   | 5. Receive & Validate | A receives the context and metadata. Check that `metadata.signature` equals `"sig-abc"`. Check that `metadata.custom.region` equals `"EMEA"`. Check that `metadata.source` and `metadata.timestamp` are present. |

- `UCContextMetadataSignatureCustom` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

## Context Metadata on App Channel Broadcast

| App | Step                    | Details                                                                    |
|-----|-------------------------|----------------------------------------------------------------------------|
| A   | 1. Retrieve `Channel`   | Retrieve a `Channel` object representing an 'App' channel called `test-channel` using: <br />`const testChannel = await fdc3.getOrCreateChannel("test-channel")` |
| A   | 2. Add Context Listener | Add a typed context listener: `await testChannel.addContextListener("fdc3.instrument", handler)` where handler accepts `(context, metadata)`. |
| B   | 3. Retrieve `Channel`   | Retrieve the same 'App' channel (`test-channel`). |
| B   | 4. Broadcast            | B broadcasts an `fdc3.instrument` context to the channel. |
| A   | 5. Receive & Validate   | A receives the context and metadata. Check that `metadata.source` is an `AppIdentifier` matching B. Check that `metadata.timestamp` is a valid `Date`. |

- `ACContextMetadataOnBroadcast` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

## Context Metadata on Intent

| App   | Step                        | Details                                                                                           |
|-------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test  | 1. Raise Intent             | `fdc3.raiseIntent("lTestingIntent", testContextX)` starts app **L**. |
| L     | 2. Receive Intent & Metadata | After starting, L runs `fdc3.addIntentListener("lTestingIntent", handler)`. The handler receives `(context, metadata)`. |
| L     | 3. Validate Metadata        | Check that `metadata.source` is an `AppIdentifier` matching Test's identity. Check that `metadata.timestamp` is a valid `Date`. |

- `IntentContextMetadata` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

## Context Metadata on Intent with App-Provided Metadata

| App   | Step                        | Details                                                                                           |
|-------|-----------------------------|---------------------------------------------------------------------------------------------------|
| Test  | 1. Raise Intent with metadata | `fdc3.raiseIntent("lTestingIntent", testContextX, undefined, { traceId: "intent-trace-456", signature: "intent-sig", custom: { priority: "high" } })` starts app **L**. |
| L     | 2. Receive Intent & Metadata | L receives the intent with context and metadata. |
| L     | 3. Validate Metadata        | Check that `metadata.traceId` equals `"intent-trace-456"`. Check that `metadata.signature` equals `"intent-sig"`. Check that `metadata.custom.priority` equals `"high"`. Check that `metadata.source` and `metadata.timestamp` are present. |

- `IntentContextMetadataWithAppMetadata` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

## getCurrentContextWithMetadata

![3.0](https://img.shields.io/badge/FDC3-3.0-purple) In FDC3 3.0, `getCurrentContextWithMetadata()` was added to the `Channel` interface to allow retrieval of both the current context and its associated metadata.

| App | Step                        | Details                                                                    |
|-----|-----------------------------|----------------------------------------------------------------------------|
| B   | 1. Retrieve `Channel`       | Retrieve a `Channel` object representing an 'App' channel called `test-channel`. |
| B   | 2. Broadcast                | B broadcasts an `fdc3.instrument` context to the channel. |
| A   | 3. Retrieve `Channel`       | Retrieve the same 'App' channel (`test-channel`). |
| A   | 4. Get Context With Metadata | A calls `await testChannel.getCurrentContextWithMetadata("fdc3.instrument")`. |
| A   | 5. Validate                 | Check that the result is a `ContextWithMetadata` object. Check that `result.context` matches the instrument broadcast by B. Check that `result.metadata.source` is an `AppIdentifier` matching B. Check that `result.metadata.timestamp` is a valid `Date`. |

- `ACGetCurrentContextWithMetadata` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.

| App | Step                        | Details                                                                    |
|-----|-----------------------------|----------------------------------------------------------------------------|
| A   | 1. Retrieve `Channel`       | Retrieve a `Channel` object representing an 'App' channel called `test-channel`. |
| A   | 2. Get Context With Metadata | A calls `await testChannel.getCurrentContextWithMetadata("fdc3.instrument")` on a channel with no prior broadcasts. |
| A   | 3. Validate                 | Check that the result is `null`. |

- `ACGetCurrentContextWithMetadataNull` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-purple): Perform above test.
