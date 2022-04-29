---
title: FDC3 Compliance
---

FDC3 standards follow the IETF best practices for keywords to Indicate Requirement levels: [RFC 2119](https://tools.ietf.org/html/rfc2119).  Documentation should be updated as needed to reflect this.

In general, the ratified FDC3 specs represent a lowest common denominator interface for interoperability. So, unless a particular item in a spec is marked with keywords such as OPTIONAL, MAY, SHOULD, or SHOULD NOT, it should be treated as REQUIRED.  Since FDC3 itself is primarily concerned with establishing the baseline requirements for interoperation, this is consistent with the IETF Guidance:

>6. **Guidance in the use of these Imperatives**
>
>   Imperatives of the type defined in this memo must be used with care
>   and sparingly.  In particular, they MUST only be used where it is
>   actually required for interoperation or to limit behavior which has
>   potential for causing harm (e.g., limiting retransmisssions)  For
>   example, they must not be used to try to impose a particular method
>   on implementors where the method is not required for 
>   interoperability.

These rules would apply only to standards work within FDC3. Today, this covers the API, App Directory, Context Data, and Intents specifications.

## Personas
FDC3 implementors generally fall into 2 categories: platform providers, and application providers. A platform provider supplies an implementation of the FDC3 API for applications to use. Implicitly, it connects to one or more App Directories.

An application provider is largely a downstream consumer of FDC3 standards. It MAY use the API, it MAY use Context Data, it MAY use Intents. Application providers are only required to comply with the standards they make use of.

Depending on persona, implementation compliance with FDC3 will mean different things.

### Platform Provider
For platform providers FDC3 compliance requires:

* Support for connections to 1 or more App Directories meeting the FDC3 App Directory standards SHOULD be provided
* An API implementation that meets the FDC3 API standards MUST be provided to all applications running in the context of the platform, including:
    * Support for the FDC3 Context Data and Intents standards
    * Support for intent and context resolution using a resolver UI
    * Support for retrieving information about the version of the FDC3 specification supported by a Desktop Agent implementation and the name of the implementation provider
* In the case of web applications, a Desktop Agent MUST provide the FDC3 API via a global accessible as `window.fdc3`.

### Application Provider
For application providers FDC3 compliance requires:
* If intents are supported by the application, they SHOULD favor supporting applicable FDC3 defined standard intents over proprietary ones.
* If FDC3 defined intents are supported, they MUST meet the expected context and behavior defined for the intent.
* If proprietary intents are handled, those intents SHOULD follow the recommended naming conventions in the specification.
* If intents are supported, the application SHOULD use the `addIntentListener` API to set up a handler.
* If context data is supported by the application, they SHOULD favor supporting applicable FDC3 defined context data types over proprietary ones.
* If FDC3 defined context data is supported, it MUST meet the interface defined for that type of context data.
* If proprietary context data properties are handled, they SHOULD follow any recommended naming conventions in the specification.
* If context data is supported, the application SHOULD use the `addContextListener` API to set up a handler.

## Versioning
Typically, a Standard that has marketplace relevance is revised from time to time, to correct errors and/or to add functionality to support new use cases. Hence, there exist multiple versions of the standard. As FDC3 is a standards project, we don't follow semver, which is meant for libraries. We use the versioning scheme `<major>.<minor>`, e.g. `1.1` or `2.3`.

## Deprecation Policy
Over time, it is not uncommon for certain things in a standard to be marked for removal in a future version, possibly being replaced by an alternative. That is, they are deprecated. Often, they are retained in the standard because of their widespread use, but their use in new projects is discouraged.

FDC3 adopts the following deprecation policy:

1. A feature can be deprecated by any major or minor version. Newly deprecated features will be described in the [Changelog](https://github.com/finos/FDC3/blob/master/CHANGELOG.md).
2. A feature shall only be removed by a major version. Newly removed features will be described in the [Changelog](https://github.com/finos/FDC3/blob/master/CHANGELOG.md).
3. Deprecated features are clearly marked with an `@deprecated` tag and comment in both the documentation and jsDocs applied to the TypeScript sources.
4. Where possible, changes to the behavior of an existing feature should be avoided; consider deprecating it and replacing it with something with a different name/syntax.
5. Breaking changes should only be made in a major version of the Standard.

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
