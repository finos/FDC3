---
id: fdc3-charter
title: FDC3 Charter
---

## Scope

The FDC3 Standard specifies protocols and taxonomies to enable applications in financial services workflows to interoperate in a plug-and-play fashion, without prior bi-lateral agreements between app developers.

Financial applications include any type of application used in common financial workflows, including:

- Containerized Web applications - Interoperability platforms extending Chromium (e.g. Electron, OpenFin, interop.io's io.Connect)
- PWAs & Web applications running in a commercial browser
- Traditional native applications implemented in C++, .NET, Java, Python, etc.
- Hybrid web/native applications - stand alone native apps embedding a WebView (e.g. Electron, CEF, WebView2, NW.js etc.)
- Common desktop applications not specific to finance, but critical to workflows - such as Excel, Outlook, Slack, etc.

This standards group is focused specifically on establishing and promoting standards for the interoperability of front-end applications, hence, its activities are focused on:

- The discovery, configuration, identity and use of financial services applications (e.g. the FDC3 [App Directory](https://fdc3.finos.org/docs/app-directory/overview)),
- APIs for communication and interaction between applications (e.g. the [Desktop Agent API](https://fdc3.finos.org/docs/api/spec) and [Agent Bridging API](https://fdc3.finos.org/docs/agent-bridging/spec)),
- Message formats used for communication (e.g. [Context Data](https://fdc3.finos.org/docs/context/spec))
- Names for requested functionality and workflow steps (e.g. [Intents](https://fdc3.finos.org/docs/intents/spec))
- Creating and promoting tests for conformance to these standards (e.g. the FDC3 Conformance Framework) and training & certification programs that relate to them (e.g. [Introduction to FDC3](https://training.linuxfoundation.org/express-learning/introduction-to-fdc3-lfel1000/))

The group's activities do not include:

- Interoperability or communication between back-end platforms.
- Defining financial objects - where existing standards are well established and can be reused.

## Licensing

- Version 1.0 of the FDC3 specification is licensed under the [FDC3 1.0 Final Specification License](https://github.com/finos/FDC3/blob/17892008c26a73ff1fd9f6e40ceb8c8bfd58c610/PATENTS-FDC3-1.0.md).

- Versions 1.1 - 2.1 of the FDC3 specification are subject to the [FINOS IP Policy](https://github.com/finos/community/blob/fdd059c93b6ceefadd8cf60c4bef995366695337/website/static/governance-docs/IP-Policy.pdf), which authorizes implementation of FDC3 specifications without charge, on a RAND basis, subject to the terms of the policy. For details of the IP commitments made by contributors to FDC3, please refer to the policy.

- Versions of the FDC3 specification following 2.1 and subsequent draft specifications are licensed under the [Community Specification License 1.0](https://github.com/finos/FDC3/blob/4ce90d45ca8e0c4f8f2c5bd73f51304278783d87/LICENSE.md)

- All code in the FDC3 specification (including JSON Schema) are licensed under [Apache 2.0](https://github.com/finos/FDC3/blob/main/LICENSE)

### Intellectual Property Claims

Recipients of this document are requested to submit, with their comments, notification of
any relevant patent claims or other intellectual property rights of which they may be aware that
might be infringed by any implementation of the standard set forth in this document, and to provide
supporting documentation.

THIS STANDARD IS BEING OFFERED WITHOUT ANY WARRANTY
WHATSOEVER, AND IN PARTICULAR, ANY WARRANTY OF NON-INFRINGEMENT IS
EXPRESSLY DISCLAIMED. ANY USE OF THIS STANDARD SHALL BE MADE
ENTIRELY AT THE IMPLEMENTER'S OWN RISK, AND NEITHER THE FOUNDATION,
NOR ANY OF ITS MEMBERS OR SUBMITTERS, SHALL HAVE ANY LIABILITY
WHATSOEVER TO ANY IMPLEMENTER OR THIRD PARTY FOR ANY DAMAGES OF
ANY NATURE WHATSOEVER, DIRECTLY OR INDIRECTLY, ARISING FROM THE USE
OF THIS STANDARD.
