---
id: fdc3-compliance
title: FDC3 Specification Compliance 
sidebar_label: FDC3 Compliance
---



FDC3 standards follow the IETF best practices for keywords to Indicate Requirement levels: [RFC 2119](https://tools.ietf.org/id/draft-faltstrom-uri-11.html#RFC2119).  Documentation should be updated as needed to reflect this.

In general, the ratified FDC3 specs represent a lowest common denominator interface for interoperability. So, unless a particular item in a spec is marked with keywords such as OPTIONAL, MAY, SHOULD, or SHOULD NOT, it should be treated as REQUIRED.  Since FDC3 itself is primarily concerned with establishing the baseline requirements for interoperation, this is consistent with the IETF Guidance:

>6. **Guidance in the use of these Imperatives**
>
>   Imperatives of the type defined in this memo must be used with care
>   and sparingly.  In particular, they MUST only be used where it is
>   actually required for interoperation or to limit behavior which has
>   potential for causing harm (e.g., limiting retransmisssions)  For
>   example, they must not be used to try to impose a particular method
>  on implementors where the method is not required for
>   interoperability.

These rules would apply only to standards work within FDC3. Today, this covers API, App Directory, Context Data, and Intents working groups, it does not apply to the Use Cases working group. 

## Personas
FDC3 implementors generally fall into 2 categories: platform providers, and application providers. A platform provider supplies an implementation of the FDC3 API for applications to use. Implicitly, it connects to one or more App Directories.

An application provider is largely a downstream consumer of FDC3 standards. It MAY use the API, it MAY use Context Data, it MAY use Intents. Application providers are only required to comply with the standards they make use of.  

Depending on persona, implementation compliance with FDC3 will mean different things.  

### Platform Provider
To meet the requirements of FDC3, a platform provider would need to support the following:

* Connection to 1 or more App Directories meeting the FDC3 App Directory standards
* Provide an API to all applications running in the context of the platform that meets the FDC3 API standards, including:
    * Support for FDC3 Context Data and Intents standards
    * Support for Intent and Context resolution using a resolver UI
* At least one workflow of one of the use cases marked as Accepted by the Use Cases working group SHOULD be satisfied by the implementation.

### Application Provider
For application providers FDC3 compliance requires:
* If intents are supported by the application, they SHOULD favor supporting applicable FDC3 defined intents over proprietary ones.  
* If FDC3 defined intents are supported, they MUST meet the expected context and behavior defined for the intent.  
* If proprietary intents are handled, those intents SHOULD follow the recommended naming conventions in the specification.
* If intents are supported, the application SHOULD use the addIntentListener API to set up a handler.
* If Context Data is supported by the application, they SHOULD favor supporting applicable FDC3 defined Context Data over proprietary ones.  
* If FDC3 defined Context Data is supported, it MUST meet the interface defined for the type of Context Data.  
* If proprietary Context Data properties are handled, they SHOULD follow any recommended naming conventions in the specification.
* If Context Data is supported, the application SHOULD use the addContextListener API to set up a handler.

## References
The following specifications and use cases references apply to the above:
* [API](api/api-spec)
* [App Directory](appd-spec)
* [Context Data](context-spec)
* [Intents](intents-spec)
* [Use Cases](use-cases/overview)