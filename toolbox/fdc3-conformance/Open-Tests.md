# Open Tests 

### A Opens B  

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App  | App A calls a function to open a second app, B |
| A   | 2. Check Metadata | Ensure that the app that was opened (B) is the correct app |

- `AOpensB1`:  **A** uses `fdc3.open(‘app B Name’)`  ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)
- `AOpensB2`:  **A** uses `fdc3.open({name: “<app B Name>”})` ![1.2](https://img.shields.io/badge/FDC3-1.2-green)
- `AOpensB3`:  **A** uses `fdc3.open({name: “<app B Name>”, appId: “<app B ID>”})` ![1.2](https://img.shields.io/badge/FDC3-1.2-green)

### A Fails To Open Another App

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App  | App A tries to open a non-existent app |
| A   | 2. Check Response | A receives an "App Not Found" error  |

- `AOpensB1`:  **A** uses `fdc3.open(‘<non existent app>’)` ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)
- `AOpensB2`:  **A** uses `fdc3.open({name: ‘<non existent app>’})`  ![1.2](https://img.shields.io/badge/FDC3-1.2-green)
- `AOpensB3`:  **A** uses `fdc3.open({name: ‘<non existent app>’, appId: “<non existent app id>”})`  ![1.2](https://img.shields.io/badge/FDC3-1.2-green)


### A Opens B With Context

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | 1. Opening App     | various open methods as in `AOpensB1-3` except with a `<context>` argument of type `fdc3.instrument` <br>check app opens    |
| B   | 2. Context present | `fdc3.addContextListener()`<br>- receives `<context>` from **A** |

- `AOpensBWithContext1`:  **A** calls `fdc3.open(‘app B Name', ctx)`, check app **B** opens
- `AOpensBWithContext2`:  **A** calls `fdc3.open({name: “<app B Name>”}, ctx)`, check app **B** opens
- `AOpensBWithContext3`:  **A** calls `fdc3.open({name: “<app B Name>”, appId: “<app B ID>”}, ctx)`, check app **B** opens
- `AOpensBWithSpecificContext1`: Perform `AOpensB1WithContext1` above but replace **B**s call with `fdc3.addContextListener('fdc3.testReceiver`)`


### Specific Context


| App | Step            | Description                                                                                                                   |
|-----|-----------------|-------------------------------------------------------------------------------------------------------------------------------|
| A   | 1. Opening App     | `fdc3.open(‘app Name’, <contact context>)` <br>check app opens                                                                |
| B   | 2. Context present | `fdc3.addContextListener()`<br>`fdc3.addContextListener('fdc3.instrument')`<br>- receives <context> from A                                                                      |
| A   | 3. Promise         | - receives a rejection from the open promise with “App Timeout’ from <br>https://fdc3.finos.org/docs/api/ref/Errors#openerror |

-  `AOpensBMultipleListen`:  The correct (first) context listener should receive the context, and the promise resolves successfully in **A**.
