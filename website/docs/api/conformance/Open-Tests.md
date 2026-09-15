---
id: Open-Tests
sidebar_label: Open Tests
title: Open Tests
hide_title: true
---

# Open Tests
<!-- markdownlint-disable MD033 -->

## A Opens B  

| App | Step              | Description                                              |
|-----|-------------------|----------------------------------------------------------|
| A   | 1. Opening App    | App A calls a function (see below) to open a second app, B |
| A   | 2. Check Metadata | Ensure that the correct app was opened |

- `AOpensB3` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via:
  - `fdc3.open({appId:"<app-B-ID>"})`
- `AOpensB4` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):   **A** uses an `AppIdentifier` to open B and retrieves an updated `AppIdentifier` with an `instanceId` set via `const instanceIdentifier = await fdc3.open({appId:"<app-B-ID>"})`. Ensure that the `appId` matches that requested and that an `instanceId` property has been set.

## A Opens An App That Does Not Initialize FDC3

| App | Step                    | Description |
|-----|-------------------------|-------------|
| A   | 1. Open without context | Open app B, which launches but does not initialize FDC3, via `fdc3.open({appId:"<app-B-ID>"})` |
| A   | 2. Check result         | Confirm that the promise resolves with B's `AppIdentifier`, including an `instanceId` |
| A   | 3. Open with context    | Open B again and supply `{type: "fdc3.nothing"}` as context |
| A   | 4. Check error          | Confirm that the promise rejects with an Error whose message is `ApiTimeout` |

- `AOpensNonFDC3AppWithoutContext` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-blue): Perform steps 1 and 2 to confirm that opening without context does not wait for FDC3 initialization and does not throw `ApiTimeout`.
- `AOpensNonFDC3AppWithContext` ![3.0+](https://img.shields.io/badge/FDC3-3.0+-blue): Perform steps 3 and 4 to confirm that `ApiTimeout` is thrown when context is provided and the opened app does not initialize FDC3.

## A Fails To Open Another App

| App | Step                    | Description                                              |
|-----|-------------------------|----------------------------------------------------------|
| A   | 1. Opening App          | App A calls a function (see below) to try and open a non-existent app |
| A   | 2. Check Error Response | `fdc3.open` returns a promise that rejects with an Error with the message "App Not Found" |

- `AFailsToOpenB3` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via:
  - `fdc3.open({appId:"<app-B-ID>"})`

## A Opens B With Context

| App | Step               | Description                                              |
|-----|--------------------|----------------------------------------------------------|
| A   | 1. Opening App     |App A opens app B with an `fdc3.instrument` Context Object by calling a function (see below) |
| B   | 2. Receive Context | Add an untyped context listener via: <br/>`fdc3.addContextListener(null,handler)` <br /> B receives an `fdc3.instrument` Context Object matching that passed to the `fdc3.open()` call made by A |

- `AOpensBWithContext3` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via:
  - `fdc3.open({appId:"<app-B-ID>"}, <fdc3.instrument context>)`
- `AOpensBWithSpecificContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform AOpensBWithContext3 but replace **B**s call with `fdc3.addContextListener("fdc3.instrument",handler)`
- `AOpensBMultipleListen` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue):  Perform `AOpensBWithSpecificContext` but **B** should perform an additional `fdc3.addContextListener("fdc3.contact",handler)` prior to the existing `addContextListener` for `fdc3.instrument`.  The correct context listener should receive the context, and the promise completes successfully.
- `AOpensBWithWrongContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform `AOpensBWithSpecificContext` but **B** should add a context listener for the wrong context type (e.g. `fdc3.dummyType`) instead of the expected type in step 2.
  - Confirm that NO context is received.
  - The promise returned to **A** by `fdc3.open` rejects with an Error with message `AppTimeout`

## A Opens B - Destructured

| App | Step                    | Details                                                                    |
|-----|-------------------------|----------------------------------------------------------------------------|
| A   | 1. Destructure open     | Destructure open method from DesktopAgent: <br />`const { open } = fdc3` |
| A   | 2. Opening App          | Use destructured method to open app B: <br />`const result = await open({appId:"<app-B-ID>"})` |
| A   | 3. Check Metadata       | Ensure that the correct app was opened and `result` contains expected `AppIdentifier` |

- `AOpensB3-Destructured` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test to verify destructured `open` works correctly.

## A Opens B With Context - Destructured

| App | Step                    | Details                                                                    |
|-----|-------------------------|----------------------------------------------------------------------------|
| A   | 1. Destructure open     | Destructure open method from DesktopAgent: <br />`const { open } = fdc3` |
| A   | 2. Opening App          | Use destructured method to open app B with context: <br />`const result = await open({appId:"<app-B-ID>"}, <fdc3.instrument context>)` |
| A   | 3. Check Metadata       | Ensure that the correct app was opened and context was passed |

- `AOpensB4-Destructured` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Perform above test to verify destructured `open` with context works correctly.
