# Open Tests 

## A Opens B  

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App  | App A calls a function (see below) to open a second app, B |
| A   | 2. Check Metadata | Ensure that the correct app was opened |

- `AOpensB1`:   ![1.2](https://img.shields.io/badge/FDC3-1.2-green) **A** uses `fdc3.open(‘app B Name’)` 
- `AOpensB2`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) **A** uses `fdc3.open({name: “<app B Name>”})` 
- `AOpensB3`:  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via<br/>![1.2](https://img.shields.io/badge/FDC3-1.2-green) `fdc3.open({name: “<app B Name>”, appId: “<app B ID>”})` <br/>![2.0](https://img.shields.io/badge/FDC3-2.0-blue)  `fdc3.open({appId: “<app B ID>”})`
- `AOpensB4`:  ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) **A** uses an `AppIdentifier` to open B and retrieves an updated `AppIdentifier` with an `instanceId` set via `const instanceIdentifier = await fdc3.open({appId: “<app B ID>”})`. Ensure that the `appId` matches that requested and that an `instanceId` property has been set.

## A Fails To Open Another App

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App  | App A calls a function (see below) to try and open a non-existent app |
| A   | 2. Check Error Response | ![1.2](https://img.shields.io/badge/FDC3-1.2-green) `fdc3.open` throws an Error with the message "App Not Found"<br/>![2.0](https://img.shields.io/badge/FDC3-2.0-blue) `fdc3.open` returns a promise that rejects with an Error with the message "App Not Found" |

- `AFailsToOpenB1`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) **A** uses `fdc3.open(‘non existent app’)` 
- `AFailsToOpenB2`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) **A** uses `fdc3.open({name: “non existent app”})` 
- `AFailsToOpenB3`:  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via: <br/>![1.2](https://img.shields.io/badge/FDC3-1.2-green) `fdc3.open({name: “non existent app”, appId: “non existent app”})` <br/>![2.0](https://img.shields.io/badge/FDC3-2.0-blue)  `fdc3.open({appId: “<app B ID>”})`

## A Opens B With Context

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App     |App A opens app B with an `fdc3.instrument` context data item |
| B   | 2. Context present | Add an untyped context listener via: <br/>`fdc3.addContextListener(null, handler)` <br /> B receives a matching piece of context data from A |

- `AOpensBWithContext1`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) **A** uses `fdc3.open(‘app B Name', ctx)` 
- `AOpensBWithContext2`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) **A** uses `fdc3.open({name: “<app B Name>”}, ctx)` 
- `AOpensBWithContext3`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) **A** uses `fdc3.open({name: “<app B Name>”, appId: “<app B ID>”}, ctx)` 
- `AOpensBWithSpecificContext`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) Perform above but replace **B**s call with `fdc3.addContextListener('fdc3.instrument', handler)` 
- `AOpensBMultipleListen`: ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) Perform `AOpensBWithSpecificContext` but **B** should perform an additional `fdc3.addContextListener('fdc3.contact', handler)` prior to the existing `addContextListener` for `fdc3.instrument`.  The correct context listener should receive the context, and the promise completes successfully.  


## Wrong Context ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | A opens B using `fdc3.open(‘app B Name', ctx)`, but passes a context type that app B is NOT going to add a listener for (including NOT adding a listener for type `null`)                                                                |
| B   | 2. Context not received | App B adds a context listener for a different type than the one A is sending.  <br/>Confirm that NO context is received.                         |
| A   | 3. Promise         | Receives a rejection from the open promise with `AppTimeout` from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

- `AOpensBWithWrongContext`: Perform above test

## Multiple Listeners  ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | A opens B using `fdc3.open(‘app B Name', ctx)`, sending an `fdc3.instrument` as context information    |
| B   | 2. Context present | B opens and adds two context listeners:  first, a generic one, then second, a specific one for the `fdc3.instrument` context type.  <br/>Only the first listener will receive the `fdc3.instrument`    |

-  `AOpensBMultipleListen`:  The correct (first) context listener should receive the context, and the promise resolves successfully in **A**.

## Bad Context ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | A opens B using `fdc3.open(‘app B Name', ctx)`, but passes a context type that is semantically invalid (i.e. contains no `type` field)      |                                                          |
| B   | 2. Context not received | App B adds an untyped context listener, but doesn't receive the context.        |
| A   | 3. Promise         | Receives a rejection from the open promise with `AppTimeout` from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

- `2.0-AOpensBNoListen`: Perform the above test. 
