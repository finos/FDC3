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

- `AOpensB3`:  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via:
  - `fdc3.open({appId:"<app-B-ID>"})`
- `AOpensB4`:   **A** uses an `AppIdentifier` to open B and retrieves an updated `AppIdentifier` with an `instanceId` set via `const instanceIdentifier = await fdc3.open({appId:"<app-B-ID>"})`. Ensure that the `appId` matches that requested and that an `instanceId` property has been set.

## A Fails To Open Another App

| App | Step                    | Description                                              |
|-----|-------------------------|----------------------------------------------------------|
| A   | 1. Opening App          | App A calls a function (see below) to try and open a non-existent app |
| A   | 2. Check Error Response | `fdc3.open` returns a promise that rejects with an Error with the message "App Not Found" |

- `AFailsToOpenB3`:  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via:
  - `fdc3.open({appId:"<app-B-ID>"})`

## A Opens B With Context

| App | Step               | Description                                              |
|-----|--------------------|----------------------------------------------------------|
| A   | 1. Opening App     |App A opens app B with an `fdc3.instrument` Context Object by calling a function (see below) |
| B   | 2. Receive Context | Add an untyped context listener via: <br/>`fdc3.addContextListener(null,handler)` <br /> B receives an `fdc3.instrument` Context Object matching that passed to the `fdc3.open()` call made by A |

- `AOpensBWithContext3`:  **A** uses an `AppMetadata` or `AppIdentifier` to open B, via:
  - `fdc3.open({appId:"<app-B-ID>"}, <fdc3.instrument context>)`
- `AOpensBWithSpecificContext`: Perform AOpensBWithContext3 but replace **B**s call with `fdc3.addContextListener("fdc3.instrument",handler)`
- `AOpensBMultipleListen`:  Perform `AOpensBWithSpecificContext` but **B** should perform an additional `fdc3.addContextListener("fdc3.contact",handler)` prior to the existing `addContextListener` for `fdc3.instrument`.  The correct context listener should receive the context, and the promise completes successfully.
- `AOpensBWithWrongContext`: Perform `AOpensBWithSpecificContext` but **B** should add a context listener for the wrong context type (e.g. `fdc3.dummyType`) instead of the expected type in step 2.
  - Confirm that NO context is received.
  - The promise returned to **A** by `fdc3.open` rejects with an Error with message `AppTimeout`
