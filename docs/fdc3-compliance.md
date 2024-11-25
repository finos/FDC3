---
id: fdc3-compliance
title: Compliance
---

FDC3 standards follow the IETF best practices for keywords to Indicate Requirement levels: [RFC 2119](https://tools.ietf.org/html/rfc2119).  Documentation should be updated as needed to reflect this.

In general, the ratified FDC3 specs represent a lowest common denominator interface for interoperability. So, unless a particular item in a spec is marked with keywords such as OPTIONAL, MAY, SHOULD, or SHOULD NOT, it should be treated as REQUIRED.  Since FDC3 itself is primarily concerned with establishing the baseline requirements for interoperation, this is consistent with the IETF Guidance:

>6. **Guidance in the use of these Imperatives**
>
>    Imperatives of the type defined in this memo must be used with care
>    and sparingly.  In particular, they MUST only be used where it is
>    actually required for interoperation or to limit behavior which has
>    potential for causing harm (e.g., limiting retransmissions)  For
>    example, they must not be used to try to impose a particular method
>    on implementors where the method is not required for
>    interoperability.

These rules would apply only to standards work within FDC3. Today, this covers the API, App Directory, Context Data, and Intents specifications.

## Personas

FDC3 implementors generally fall into 2 categories: platform providers, and application providers. A platform provider supplies an implementation(s) of the FDC3 APIs (The Desktop Agent API and Application Directory) for applications to use.

An application provider is largely a downstream consumer of FDC3 standards. It MAY use the API, it MAY use Context Data, it MAY use Intents. Application providers are only required to comply with the standards they make use of.

Depending on persona, implementation compliance with FDC3 will mean different things.

### Platform Provider

For platform providers FDC3 compliance requires that they meet the requirements of the APIs that they implement:

- [Desktop Agent API compliance requirements](api/spec#desktop-agent-api-standard-compliance).
- [App Directory compliance requirements](app-directory/spec#app-directory-standard-compliance).

### Application Provider

For application providers FDC3 compliance requires that they interact with the FDC3 APIs as intended and meet the requirements of the Intents and Context Data Standards. Specifically:

- [Intents Standard compliance requirements](intents/spec#intents-standard-compliance)
- [Context Data Standard compliance requirements](context/spec#context-data-standard-compliance)

## Versioning

Typically, a Standard that has marketplace relevance is revised from time to time, to correct errors and/or to add functionality to support new use cases. Hence, there exist multiple versions of the standard. As FDC3 is a standards project, we don't follow semver, which is meant for libraries. We use the versioning scheme `<major>.<minor>`, e.g. `1.1` or `2.3`.

## Deprecation Policy

Over time, it is not uncommon for certain things in a standard to be marked for removal in a future version, possibly being replaced by an alternative. That is, they are deprecated. Often, they are retained in the standard because of their widespread use, but their use in new projects is discouraged.

FDC3 adopts the following deprecation policy:

1. A feature can be deprecated by any major or minor version. Newly deprecated features will be described in the [Changelog](https://github.com/finos/FDC3/blob/main/CHANGELOG.md).
2. A feature shall only be removed by a major version. Newly removed features will be described in the [Changelog](https://github.com/finos/FDC3/blob/main/CHANGELOG.md).
3. Deprecated features are clearly marked with an `@deprecated` tag and comment in both the documentation and jsDocs applied to the TypeScript sources.
4. Where possible, changes to the behavior of an existing feature should be avoided; consider deprecating it and replacing it with something with a different name/syntax.
5. Breaking change should only be made in a major version of the Standard.

## Experimental Features

Occasionally, a change to FDC3 may be proposed where the design is tentative, and because of this, we need feedback from the community to finalize its inclusion in the Standard. In such cases, a feature may be designated as _experimental_ to indicate that its design may change in future and that it is exempted from the normal versioning and deprecation polices in order to facilitate that change.  However, designating a feature as experimental is likely to reduce its uptake by the community, hence, this designation should be used sparingly.

FDC3 adopts the following experimental features policy:

1. A feature may be designated as experimental where feedback is needed to confirm the final design of that feature, with the goal of including it as a full part of the Standard without the experimental label.
2. A feature should only be designated as experimental where there is a reasonable chance that breaking changes to its design may be applied, based on feedback received; non-breaking changes (refinements) may already be applied to features defined in the Standard without the experimental designation.
3. Experimental features are clearly marked with an `@experimental` tag and comment in both the documentation and docs applied to the TypeScript sources.
4. Unless otherwise stated, experimental features should be considered optional for compliance purposes, but recommended for implementation (i.e. the SHOULD keyword is implied).
5. Experimental features are exempted from the normal versioning and deprecation policies that govern changes to FDC3. I.e. breaking changes may be made to experimental features between versions of the Standard without a major version release.
6. The experimental designation may be removed from a feature in a minor version release (as this will be considered an additive change).

## Conformance testing

The FDC3 Standards include a set of [definitions for conformance tests](api/conformance/Conformance-Overview) that may be used to determine if a Desktop Agent API implementation conforms to a particular Standard version, to help disambiguate complex parts of the FDC3 Standard and to enable test-driven development of a Desktop Agent implementation.

The current set of tests focus on the Desktop Agent API and the interface to it. Tests are not yet defined for the App Directory API or Bridging API Parts of the FDC3 Standard, hence, conformance to those parts of the Standard must be determined manually.

:::warning

Additions to the conformance tests for functionality introduced in FDC3 2.2 are still to be defined.

Further, as FDC3 2.1 does not introduce changes to the Desktop Agent API, the conformance test set for FDC3 2.0 remains current at this time. Please see the [FDC3 2.1 Changelog entry](https://github.com/finos/FDC3/blob/main/CHANGELOG.md#fdc3-standard-21---2023-09-13) for more details.

:::

The FDC3 Conformance tests are implemented for JavaScript/TypeScript web applications by the [FDC3 Conformance Framework](https://github.com/finos/FDC3-conformance-framework). Desktop Agent implementors working with web interfaces (Desktop Agent Preload or Desktop Agent Proxy) can clone the conformance framework and run the tests locally to determine if their agent is compliant with the Standard.

Once a Desktop Agent has passed the conformance tests locally, its authors can [apply for a formal certification of compliance with the Standard from FINOS](https://github.com/finos/FDC3-conformance-framework/blob/main/instructions.md). Please note the [Terms and Conditions](https://github.com/finos/FDC3-conformance-framework/blob/main/terms-conditions/FDC3-Certified-Terms.md) of the Conformance Program.

import badge_12 from '/img/community/certified-1.2.png';
import badge_20 from '/img/community/certified-2.0.png';

<img src={badge_12} alt="Certified conformant with FDC3 1.2 badge" style={{width: 200}} />
<img src={badge_20} alt="Certified conformant with FDC3 2.0 badge" style={{width: 200}} />

## Intellectual Property Claims

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
