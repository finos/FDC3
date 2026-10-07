---
id: Conformance-Overview
sidebar_label: Overview
title: FDC3 Conformance Tests
hide_title: true
---

# FDC3 Conformance Tests

This section contains test definitions that are used to test for conformance of a Desktop Agent API implementation with FDC3.

:::note

FDC3 2.2 introduces both a new interface to web-based FDC3 Desktop Agent, known as a "Desktop Agent Proxy", as an alternative to the injection of the FDC3 API at `window.fdc3`, which is now know as a "Desktop Agent Preload" interface `GetAgent`. 2.2 also introduces the [`getAgent`](../ref/GetAgent) function which can be used to connect to either interface and MUST be used by conformance testing apps to retrieve a interface (whichever is provided by the Desktop Agent being tested).

:::

:::info

Where tests were introduced in this version of FDC3, they are labelled with an in the header, like so: ![2.2](https://img.shields.io/badge/FDC3-2.2-purple)

:::

There are currently 6 sections to the tests.  

- [Basic Tests](Basic-Tests.md)
- [Open Tests](Open-Tests.md)
- [User Channel Tests](User-Channel-Tests.md)
- [App Channel Tests](App-Channel-Tests.md)
- [Metadata Tests](Metadata-Tests.md)
- [Intents Tests](Intents-Tests.md)

You can find the implementation of these tests in the [FDC3 Conformance Framework](https://github.com/finos/FDC3-conformance-framework) project.

## Running the Conformance Tests

A ready-to-run build of the conformance test runner is hosted on the FDC3 website. To test a Desktop Agent, load the appropriate App Directory (see below) into the agent and launch the `FDC3 Conformance Framework` application (appId `Conformance1`).

A snapshot is hosted for each released version of the Standard, plus a `next` snapshot that tracks the current, in-development version. Each snapshot's runner UI displays the FDC3 version it targets so you can confirm which version you are testing against.

Each snapshot is served from a versioned path of the form `https://fdc3.finos.org/toolbox/<version>/fdc3-conformance/`, with the exception of the `next` snapshot which is served from `https://fdc3.finos.org/toolbox/fdc3-conformance/`.

The App Directory for each snapshot is the `website-conformance.json` file within that snapshot's `directories` folder. The application URLs it contains are rewritten to point at the correct snapshot path when the version is created (this is done for the `next` snapshot by the `replace-conformance-urls` step in the website build).

### Available Versions

| Version | Conformance runner | App Directory (AppD) |
| --- | --- | --- |
| `next` | [https://fdc3.finos.org/toolbox/fdc3-conformance/](https://fdc3.finos.org/toolbox/fdc3-conformance/apps/app/index.html) | [https://fdc3.finos.org/toolbox/fdc3-conformance/directories/website-conformance.json](https://fdc3.finos.org/toolbox/fdc3-conformance/directories/website-conformance.json) |
| `3.0` | [https://fdc3.finos.org/toolbox/3.0/fdc3-conformance/](https://fdc3.finos.org/toolbox/3.0/fdc3-conformance/apps/app/index.html) | [https://fdc3.finos.org/toolbox/3.0/fdc3-conformance/directories/website-conformance.json](https://fdc3.finos.org/toolbox/3.0/fdc3-conformance/directories/website-conformance.json) |
| `2.2` | _To be added._ | _To be added._ |
