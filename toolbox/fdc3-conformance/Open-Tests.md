# Open Tests 

## A Opens B  

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App  | App A calls a function to open a second app, B |
| A   | 2. Check Metadata | ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) Ensure that the app that was opened (B) is the correct app.  Via: <br /> `const implementationMetadata = await fdc3.getInfo();`<br/>`const {appId, instanceId} = implementationMetadata.appMetadata;`<br/> Confirm appId matches what was opened |

- `AOpensB1`:  **A** uses `fdc3.open(‘app B Name’)`  ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)
- `AOpensB2`:  **A** uses `fdc3.open({name: “<app B Name>”})` ![1.2](https://img.shields.io/badge/FDC3-1.2-green)
- `AOpensB3`:  **A** uses `fdc3.open({name: “<app B Name>”, appId: “<app B ID>”})` ![1.2](https://img.shields.io/badge/FDC3-1.2-green)

## A Fails To Open Another App

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App  | App A tries to open a non-existent app |
| A   | 2. Check Response | A receives an "App Not Found" error  |

- `AFailsToOpenB1`:  **A** uses `fdc3.open(‘<non existent app>’)` ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)
- `AFailsToOpenB2`:  **A** uses `fdc3.open({name: ‘<non existent app>’})`  ![1.2](https://img.shields.io/badge/FDC3-1.2-green)
- `AFailsToOpenB3`:  **A** uses `fdc3.open({name: ‘<non existent app>’, appId: “<non existent app id>”})`  ![1.2](https://img.shields.io/badge/FDC3-1.2-green)

## A Opens B With Context

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App     |App A opens app B with an `fdc3.instrument` context data item |
| B   | 2. Context present | Add an untyped context listener via: <br/>`fdc3.addContextListener(null, handler)` <br />, B receives a matching piece of context data from A |

- `AOpensBWithContext1`:  **A** uses `fdc3.open(‘app B Name', ctx)` ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)
- `AOpensBWithContext2`:  **A** uses `fdc3.open({name: “<app B Name>”}, ctx)` ![1.2](https://img.shields.io/badge/FDC3-1.2-green)
- `AOpensBWithContext3`:  **A** uses `fdc3.open({name: “<app B Name>”, appId: “<app B ID>”}, ctx)` ![1.2](https://img.shields.io/badge/FDC3-1.2-green)
- `AOpensBWithSpecificContext`: Perform above but replace **B**s call with `fdc3.addContextListener('fdc3.instrument', handler)`
- `AOpensBMultipleListen`:  Perform `AOpensBWithSpecificContext` but **B** should perform an additional `fdc3.addContextListener('fdc3.contact', handler)` prior to the existing `addContextListener` for `fdc3.instrument`.  The correct context listener should receive the context, and the promise completes successfully. 


## Wrong Context ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | A opens B, but passes a context type that app B is NOT going to add a listener for (including NOT adding a listener for type `null`)                                                                |
| B   | 2. Context not received | App B adds a context listener for a different type than the one A is sending.  <br/>Confirm that NO context is received.                         |
| A   | 3. Promise         | Receives a rejection from the open promise with `AppTimeout` from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

- `AOpensBWithWrongContext`: Perform above test

## Multiple Listeners  ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | A opens B, sending an `fdc3.instrument` as context information    |
| B   | 2. Context present | B opens and adds two context listeners:  first, a generic one, then second, a specific one for the `fdc3.instrument` context type.  <br/>Only the first listener will receive the `fdc3.instrument`    |

-  `AOpensBMultipleListen`:  The correct (first) context listener should receive the context, and the promise resolves successfully in **A**.

## Bad Context ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | A opens B, but passes a context type that is semantically invalid (i.e. contains no `type` field)      |                                                          |
| B   | 2. Context not received | App B adds an untyped context listener, but doesn't receive the context.        |
| A   | 3. Promise         | Receives a rejection from the open promise with `AppTimeout` from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

- `2.0-AOpensBNoListen`: Skip `fdc3.addContextListener()` above (i.e. no listener was added).  `AppTimeout` should still occur as in 3. 
