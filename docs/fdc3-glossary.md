---
title: Glossary of Terms
sidebar_label: Glossary
---

For the purposes of this Standard, the following definitions apply. Other terms are defined when first used, at which place they appear in bold and italic type. Terms explicitly defined in this Standard are not to be presumed to refer implicitly to similar terms defined elsewhere. Terms not defined are assumed to be well-known in the financial services or software industries.


- **App Directory**: A repository of application metadata supporting discovery, for example via name or intent, and retrieval of metadata necessary to launch an application.
- **app**: Shorthand for application.
- **application**: Any endpoint on the desktop that is registered with/known by a Desktop Agent, launchable by a Desktop Agent, addressable by a Desktop Agent or otherwise able to interact with the Desktop Agent.
- **application, hybrid**: Any web application running within the context of a standalone native application that embeds a web view, typically based on Chromium.
- **application, native**: A non-web-based application; i.e., one that runs outside the context of web browser, web view or web container. A user-written program—typically implemented in a language such as C++, C#, Java, or Python, rather than JavaScript or TypeScript.
- **application, web**: An application written in TypeScript or JavaScript, HTML and CSS, which runs within the context of a web browser or a web container.
- **application provider**: A downstream consumer of FDC3 Standards that can understand and use the FDC3 API (supplied by a Platform Provider), Context Data, and/or Intents.
- **Channel**: A grouping of apps for the purposes of sharing stateful pieces of data. A secondary interface of the FDC3 API.
- **context channels**: A mechanism to allow sets of apps to share stateful pieces of data among themselves, and to be alerted when that data changes.
- **context**: Shorthand for context data.
- **context data**: Objects encoding common identifiers and data in a standardized format that can be passed between apps via Context Channels or used in conjunction with Intents to invoke actions creating a seamless cross-application workflow. Diverse Context Data types are created to encode different types of data, each having their own _type_ field and unique set of data fields. 
- **Desktop Agent**: A desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain. The primary interface of the FDC3 API.
- **FDC3 API**: A baseline, consistent developer interface for interoperability between applications.
- **interop**: Shorthand for interoperability.
- **interoperability**: the ability of software applications to exchange and make use of information and invoke specified acitons.
- **intent**: A verb, with a pre-agreed meaning (expected behavior), used to invoke an action between applications. A set of such verbs can, in conjunction with Context Data acting as nouns, be used to put together common cross-application workflows on the financial desktop.
- **Listener**: API interface which allows unsubscribing from Intents or Context Channels.
- **raising an intent**: The act of requesting, via the FDC3 API/Desktop Agent that a specified action be performed by another application, using specified Context Data as input.
- **resolver**: A facility of a Desktop Agent used to map a raised Intent and associated context to an application that will perform the action represented by the Intent. Where multiple applications can resolve the Intent, a resolver will often display a user-interface allowing a user to pick from teh available applications that support the Intent and Context.
- **resolving an intent**: The act of mapping a specified Intent and Context Data item to an application.
- **standard Intent**: An Intent defined by this Standard.
- **application-specific Intent**: A custom Intent defined by an application or applications, independent of the Standard.
- **Platform Provider**: An environment that provides an implementation of the FDC3 API that applications can use.