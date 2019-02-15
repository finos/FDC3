---
id: appd-intro
sidebar_label: App Directory Overview
title: App Directory Overview
hide_title: true
---

# App Directory Overview

The FDC3 App Directory provides trusted identity for financial desktop apps. This identity can be used to prevent spoofing and man-in-the-middle attacks when apps communicate with one another and exchange data. The App Directory also enables service discovery. Apps are registered with a declaration of the intents and context data that can be used when interoperating.

## Core features

- Provide verification of identity for an application running on a desktop - whether it is Native, Web, or Hybrid.
- Resolve human readable names for applications to the location of and instructions for launching
- Serve as a repository for application metadata supporting discoverability by intent, context, and other workflow driven facets.

## Sections to review

- [Application Directory Discovery](appd-discovery.md) describes how to resolve the location of the Application Directory using an application identifier.
- [Application Directory Use](appd-use.md) provides a simple view on how application directories can be used.  This also includes links to a reference implementation.
- [API specification](appd-spec.md) is the interface definition required to support a compatible application directory.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14, [RFC 2119](https://tools.ietf.org/id/draft-faltstrom-uri-11.html#RFC2119) [RFC2119].