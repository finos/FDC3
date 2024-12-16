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

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1.getAppMetadata    | Retrieve metadata for the configured app A with <br/> `const metadata1 = await fdc3.getAppMetadata({appId:"<A's-appId>"})`  |
| Test   | 2.Confirm    | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. An `instanceId` should NOT be set  |

- `GetAppMetadata`: perform the above steps.

## Instance Metadata

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1.Open1    | Open a first instance of App A using <br/> `const appIdentifier1 = await fdc3.open({appId: "<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId`.  |
| Test   | 2.Open2    |Open a second instance of App A using <br />`const appIdentifier2 = await fdc3.open({appId: "<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId` and that its value differs from that returned for the first instance. |
| Test   | 3.getAppMetadata1    | Retrieve metadata for the first instance of the app with<br/> `const metadata1 = fdc3.getAppMetadata(appIdentifier1)` |
| Test   | 4.Confirm1 | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches.  |
| Test   | 5.getAppMetadata2    | Retrieve metadata for the second instance of the app with <br/>`const metadata2 = fdc3.getAppMetadata(appIdentifier2)`  |
| Test   | 6.Confirm2    | An `instanceId` should be provided, confirm that it matches the one in `appIdentifier2`  |

- `AppInstanceMetadata`: Perform the above steps.

## Finding Instances

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1.Open1    | Open the first instance of App A using <br/> `const appIdentifier1 = await fdc3.open({appId:"<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId`.  |
| Test   | 2.Open2    |Open a second instance of App A using <br />`const appIdentifier2 = await fdc3.open({appId:"<A's-appId>"})` <br/>and confirm that its `AppIdentifier` contains an `instanceId` and that its value differs from that returned for the first instance. |
| Test   | 3.FindInstances    | Retrieve details of open instances of app A with <br/> `let instances = await fdc3.findInstances({appId:"<A's-appId>"})` <br/> confirm that both `appIdentifier1` and `appIdentifier2` are both present in the array.  |
| Test   | 4.RaiseIntent   | Use `appIdentifier1` to raise an intent and target that instance, with<br/> `const resolution = fdc3.raiseIntent("aTestingIntent",{"type":"testContextX"},appIdentifier1)` |
| Test   | 5.Confirm1 | Check that `resolution.source` matches `appIdentifier1` |
| A | 6.ConfirmReceipt | Ensure that the instance of app A represented by `appIdentifier1` received the raised intent |

- `FindInstances`: Perform the above steps.

## Getting Info For The Agent

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1.getInfo    |Retrieve the `ImplementationMetadata` for the DesktopAgent with <br/> - `fdc3.getInfo().then((implMetadata) => { subsequent steps }`   <br />**Note that the use of `then` is deliberate and intended to confirm that a promise returned (as this function switched from synchronous to asynchronous in 2.0)**|
| Test   | 2.CheckVersion  | Check that the `fdc3Version` variable is present and at or greater than:  <br /> - 2.0  <br />(which you can do with the [`versionIsAtLeast` function from FDC3's Methods.ts](https://github.com/finos/FDC3/blob/add64f8302c6dcdc8437cf0e245101e927b69ec2/src/api/Methods.ts#L207):<br />`const isFDC3v2 = versionIsAtLeast(implMetadata, "2.0")`  |
| Test   | 3.CheckProvider  | Check that the `provider` variable is present and not an empty string  |
| Test   | 4.CheckFeatures  | Check that the `optionalFeatures`, `optionalFeatures.OriginatingAppMetadata` and `optionalFeatures.UserChannelMembershipAPIs` variables are all present and that the latter two provide boolean values  |

- `GetInfo1`: Perform the above steps.

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | 1.Open1    | Start an instance of App A with <br/>`const appIdentifier1 = await fdc3.open({appId:"<A's-appId>"})` <br /> retrieve its `AppIdentifier` with instance details. Confirm that the `AppIdentifier` contains both an `appId` and `instanceId` |
| A | 2.getInfo     |   Retrieve the `ImplementationMetadata` for the DesktopAgent with: <br  />`fdc3.getInfo().then((implMetadata) => {  ... subsequent steps ...}` <br/> This should include `AppMetadata` for the retrieving app. |
| A + Test | 3.Confirm  | Check that `implMetadata.appMetadata` contains an `appId` and `instanceId` matching that retrieved in the first step (will require transmission of the details from A to Test or vice-versa). Also compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. |

- `GetInfo2`: Perform the above steps.
