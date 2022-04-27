---
id: overview
sidebar_label: API Overview
title: API Overview
hide_title: true
---
# API Overview

The API specification of the FDC3 standard support the following goals:
- Create a consistent developer interface for working with FDC3
- Standardize interfaces for reference implementations
- Standardize interfaces between desktop agents

The role of FDC3 API is to establish a baseline interface for interoperability between applications. Because FDC3 is largely an agreement between existing platforms and applications - standards should be optimized for ease of adoption rather than functional completeness. Functionality absent from a FDC3 specification is in no way a commentary on its importance.

The focus of the FDC3 Standard Working Group has been to create a small but consistent API, the following docs go through the components and API's in detail.

## Key Elements

- [`window.fdc3`](ref/Globals#windowfdc3-object) global object and [`fdc3Ready`](ref/Globals#fdc3ready-event) event, for accessing FDC3 operations globally.
- [`DesktopAgent`](ref/DesktopAgent) interface, which exposes FDC3 operations.
- [`Channel`](ref/Channel) interface, for subscribing to specific context channels.
- [`Listener`](ref/Types#listener) interface, which allows unsubscribing intent or context listeners.





