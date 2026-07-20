---
id: Destructured-Methods-Tests
sidebar_label: Destructured Methods Tests
title: Destructured Methods Tests
hide_title: true
---

# Destructured Methods Tests
<!-- markdownlint-disable MD033 -->

These tests verify that Desktop Agent methods remain callable after they are assigned to local variables through object destructuring.

- `DestructuredFindIntent` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `findIntent`, then verify the returned intent and app metadata.
- `DestructuredFindIntentsByContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `findIntentsByContext`, then verify that matching intents are returned.
- `DestructuredOpen` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `open`, then verify the returned app identifier.
- `DestructuredFindInstances` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `findInstances`, then verify that opened app instances are returned.
- `DestructuredGetAppMetadata` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `getAppMetadata`, then verify the returned app metadata.
- `DestructuredRaiseIntent` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `raiseIntent`, then verify the returned intent resolution.
- `DestructuredRaiseIntentForContext` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `raiseIntentForContext`, then verify the returned intent resolution.
- `DestructuredCreatePrivateChannel` ![2.0+](https://img.shields.io/badge/FDC3-2.0+-blue): Destructure and call `createPrivateChannel`, then verify and disconnect the returned private channel.
