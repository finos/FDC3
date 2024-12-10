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
