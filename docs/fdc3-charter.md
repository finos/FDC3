---
id: fdc3-charter
title: FDC3 Charter
---

## Scope

Financial desktop applications include any app used in common financial workflows:

* Traditional native applications implemented in C++, .NET, Java, Python, etc.
* Hybrid web/native applications - stand-alone native apps embedding Chromium (e.g. a .NET application embedding WebView using CEF or WebView2)
* Desktop web applications - Web applications running in a desktop container (e.g. OpenFin, Finsemble, Glue42, Electron, FDC3-Sail)
* Common desktop applications not specific to finance, but critical to workflows - such as Excel, Outlook, etc.
* PWAs & Web applications running in a commercial browser

This Standard is focused specifically on the desktop.  Activities of the desktop interoperability group do not include:

* Defining financial objects - where existing standards are well established
* Interoperability between mobile apps
* Interoperability via REST or other client to server communication

:::note
While these areas are out of scope, compatibility with Mobile and/or REST are still valid points of consideration for FDC3.
:::

### Success Criteria

* Commitment from major banks and application vendors to support the standards set out by the FDC3
* Workflow integrations in the wild leveraging the standards

### Deliverables

* Define criteria and mechanics for secure communication between apps
* Define key functions that require specific standards for interoperability
* Create an agreed taxonomy for common app “intents” within financial desktop workflows
* Create an agreed taxonomy for common data to be shared across apps within financial desktop workflows
* Provide reference implementations of all standards
* Maintain the above standards and reference implementations

## Participation

To be successful, the maintenance and evolution of this Standard needs to have a critical mass of active participants for its duration. Effective participation in FDC3 means participation in the form of research, authoring, editing, and development activities outside the scope of attending regular meetings.

## Licensing

Version 1.0 of the FDC3 specification is licensed under the [FDC3 1.0 Final Specification License](https://github.com/finos/FDC3/blob/17892008c26a73ff1fd9f6e40ceb8c8bfd58c610/PATENTS-FDC3-1.0.md).

Subsequent FDC3 specifications and draft specifications are subject to the [FINOS IP Policy](https://github.com/finos/community/blob/master/website/static/governance-docs/IP-Policy.pdf)), which authorizes implementation of FDC3 specifications without charge, on a [RAND basis](https://en.wikipedia.org/wiki/Reasonable_and_non-discriminatory_licensing), subject to the terms of the policy. For details of the IP commitments made by contributors to FDC3, please refer to the policy.

Reference implementations and other software contained in FDC3 repositories is licensed under the [Apache License, Version 2.0](https://github.com/finos/FDC3/blob/17892008c26a73ff1fd9f6e40ceb8c8bfd58c610/LICENSE) unless otherwise noted. SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0).

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
