# FDC3 2.0 Conformance Test Cases

## 1. Basic Tests

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `2.0-BasicCL1`: You can call the `fdc3.addContextListener` with the `fdc3.contact` context type. The returned listener object has an `ubsubscribe` function.
- `2.0-BasicCL2`: You can call the `fdc3addContextListener` with no context type. The returned listener object has an `ubsubscribe` function.
- `2.0-BasicIL1`: You can call the `fdc3.addIntentListener` on the `DesktopAgent` for an intent, and get back a `Listener` object with `unsubscribe` method.
- `2.0-BasicCH1`: A call to `fdc3.getCurrentChannel` on the `DesktopAgent` always returns a promise.
- `2.0-BasicCH2`: A call to `fdc3.getCurrentChannel()` returns a promise resolving to _null_ if called prior to any `joinChannel`.
- `2.0-BasicGI1`: A call to `fdc3.getInfo()` returns an object with `fdc3Version` and `provider` properties.
- `2.0-BasicAC1`: A call to `fdc3.getOrCreateChannel(<name>)` will return an object matching the `Channel` interface, with properties of `id`, `type`, `broadcast`, `getCurrentContext` and `addContextListener`.
- `2.0-BasicUC1`: You can call the `fdc3.getSystemChannels()` function and receive a promise containing an array of more than 1 `Channel` objects, each with type and id set.
- `2.0-BasicJC1`: You can call `fdc3.joinChannel`, passing in the `id` of one of the system channels.  `fdc3.getCurrentChannel` should then return that joined channel.
- `2.0-BasicLC1`: You can call `fdc3.leaveCurrentChannel` at any time without exception.
- `2.0-BasicRI1`: You can call `fdc3.raiseIntentForContext`, passing in a context object with some `type` field.  




## 4. Open API

### A Opens B

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | Opening App     |`let appIdentifier = await `fdc3.open({appId: “<app B ID>”})`   |
| B   | B opens and retrieves own metadata | `const implementationMetadata = await fdc3.getInfo();`<br>`const {appId, instanceId} = implementationMetadata.appMetadata;`<br>Confirm appId matches what was opened |

- `2.0-AOpensB1`:  [ ] **Run above test**
- **Note** there were many more variations in FDC3 1.2 but 2.0 standardizes on this one signature (that is now async with a return type)

### A Fails To Open B

- `2.0-AFailsToOpenB`:  Run the above test again with a non-existent app name/app id.  Should return an error with message “App Not Found” Error from https://fdc3.finos.org/docs/api/ref/Errors#openerror

### A Opens B With Context

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | Opening App     | Open method as in `AOpensB1` except with a `<context>` argument of type `fdc3.instrument` <br>check app opens    |
| B   | Context present | `fdc3.addContextListener(null, handler)`<br>- receives `<context>` from **A** with type `fdc3.instrument` |

- `2.0-AOpensBWithContext`: Perform above test
- `2.0-AOpensBWithSpecificContext`: Perform above but replace **B**s call with `fdc3.addContextListener('fdc3.instrument', handler)`
- `2.0-AOpensBMultipleListen`:  Perform `AOpensBWithSpecificContext` but **B** should perform an additional `fdc3.addContextListener('fdc3.contact', handler)` prior to the existing `addContextListener` for `fdc3.instrument`.  The correct context listener should receive the context, and the promise completes successfully. 

### Specific Context

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | Opening App     | Open method as in `AOpensBWithContext` but pass a context type that app B is NOT going to add a listener for (including NOT adding a listener for type `null`)                                                                |
| B   | Context not received | App B calls `fdc3.addContextListener(type, handler)` for the type's it is listening for but NOT for the type A is sending in this case. Confirm that NO context is received.                         |
| A   | Promise         | Receives a rejection from the open promise with “App Timeout’ from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

- `2.0-AOpensBWithWrongContext`: Perform above test
- `2.0-AOpensBNoListen`: Skip `fdc3.addContextListener() above (i.e. no listener was added). 

### 5. Metadata & Instance Test Cases

## Setup
You will need to pre-populate the AppDirectory with the following items:

| App | Required Metadata                        |
|-----|------------------------------------------|
| A   | Generic AppD Record which contains at least the following fields:<br>- `name`<br>- `version`<br>- `title`<br>- `tooltip`<br>- `description`<br>- `icons` (`Array<Icon>`)<br>- `screenshots` (`Array<Image>`)<br>- `interop.intents.listensFor` (`aTestingIntent` with at least context type `testContextX`)  |


| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | getAppMetadata    | Retrieve metadata for the configured app with `const metadata1 = fdc3.getAppMetadata({appId: "<A's appId>"})`  |
| Test   | Confirm AppMetadata    | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. An `instanceId` should NOT be set  |

- `2.0-GetAppMetadata`: perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | Open1    | `const appIdentifier1 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.  |
| Test   | Open2    | `const appIdentifier2 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.  Confirm that the `instanceId` differs from the first instance.  |
| Test   | getAppMetadata1    | Retrieve metadata for the first instance of the app with `const metadata1 = fdc3.getAppMetadata(appIdentifier1)`  |
| Test   | Confirm Instance AppMetadata1    | Compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. An `instanceId` should be provided, confirm that it matches the one in `appIdentifier1`  |
| Test   | getAppMetadata2    | Retrieve metadata for the first instance of the app with `const metadata2 = fdc3.getAppMetadata(appIdentifier2)`  |
| Test   | Confirm Instance AppMetadata2    | An `instanceId` should be provided, confirm that it matches the one in `appIdentifier2`  |

- `2.0-AppInstanceMetadata`: Perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | OpenFindInstances1    | `let appIdentifier1 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details.  |
| Test   | OpenFindInstances2 | `let appIdentifier2 = await fdc3.open({appId: "<A's appId>"})` to start A again and retrieve another `AppIdentifier` with instance details. Confirm that the `instanceId` differs from the first instance.  |
| Test   | FindInstances    | Retrieve details of open instances with `let instances = await fdc3.findInstances({appId: "<A's appId>"})` confirm that both `appIdentifier1` and `appIdentifier2` are both present in the array.  |
| Test   | RaiseIntent   | Use appIdentifier1 to raise an intent and target that instance, with: `const resolution = fdc3.raiseIntent("aTestingIntent", {"type": "testContextX"}, appIdentifier1)` |
| Test   | ConfirmInstanceMetadata1 | Check that `resolution.source` matches `appIdentifier1` |
| A | ConfirmInstanceMetadata1 | Ensure that the instance of app A represented by `appIdentifier1` received the raised intent |

- `2.0-FindInstances`: Perform the above steps

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | getInfo    | Call `fdc3.getInfo().then((implMetadata) => {  ... subsequent steps ...}` to retrieve the `ImplementationMetadata` for the DesktopAgent<br>**Note that the use of `then` is deliberate and intended to confirm that a promise returned (as this function switched from synchronous to asynchronous in 2.0)**  |
| Test   | ConfirmImplementationMetadata_fdc3Version  | Check that the `fdc3Version` variable is present and at or greater than 2.0 (which you can do with the [`versionIsAtLeast` function from FDC3's Methods.ts](https://github.com/finos/FDC3/blob/add64f8302c6dcdc8437cf0e245101e927b69ec2/src/api/Methods.ts#L207):<br>`const isFDC3v2 = versionIsAtLeast(implMetadata, "2.0")`  |
| Test   | ConfirmImplementationMetadata_provider  | Check that the `provider` variable is present and not an empty string  |
| Test   | ConfirmImplementationMetadata_optionalFeatures  | Check that the `optionalFeatures`, `optionalFeatures.OriginatingAppMetadata` and `optionalFeatures.UserChannelMembershipAPIs` variables are all present and that the latter two provide boolean values  |

- `2.0-GetInfo1`: Perform the above steps

## `getInfo (own `AppMetadata`)`

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| Test   | Open1    | `const appIdentifier1 = await fdc3.open({appId: "<A's appId>"})` to start A and retrieve its `AppIdentifier` with instance details. Confirm that the `AppIdentifier` contains both an `appId` and `instanceId` |
| A | getInfo     |   Call `fdc3.getInfo().then((implMetadata) => {  ... subsequent steps ...}` to retrieve the `ImplementationMetadata` for the DesktopAgent - which should include `AppMetadata` for the retrieving app. |
| A + Test | ConfirmImplementationMetadata_appMetadata  | Check that `implMetadata.appMetadata` contains an `appId` and `instanceId` matching that retrieved in the first step (will require transmission of the details from A to Test or vice-versa). Also compare the `AppMetadata` object to the expected definition for the fields provided above during setup and ensure that the metadata matches. |

- `2.0-GetInfo2`: Perform the above steps.