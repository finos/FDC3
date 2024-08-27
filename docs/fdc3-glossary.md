---
id: fdc3-glossary
title: Glossary of Terms
sidebar_label: Glossary
---

For the purposes of this Standard, the following definitions apply. Other terms are defined when first used, at which place they appear in bold and italic type. Terms explicitly defined in this Standard are not to be presumed to refer implicitly to similar terms defined elsewhere. Terms not defined are assumed to be well-known in the financial services or software industries.

- **Agent Bridge**: Shorthand for Desktop Agent Bridge.
- **app**: Shorthand for application.
- **app directory**: A repository of application metadata supporting discovery, for example via name or intent, and retrieval of metadata necessary to launch an application.
- **app directory record**: Metadata relating to a single application, encoded in JSON.
- **appD**: Shorthand for app directory.
- **appD record**: Shorthand for app directory record.
- **application**: Any endpoint on the desktop that is registered with/known by a Desktop Agent, launchable by a Desktop Agent, addressable by a Desktop Agent or otherwise able to interact with the Desktop Agent.
- **application, hybrid**: Any web application running within the context of a standalone native application that embeds a web view, typically based on Chromium.
- **application, native**: A non-web-based application; i.e., one that runs outside the context of web browser, web view or web container. A user-written program, typically implemented in a language such as C++, C#, Java, or Python, rather than JavaScript or TypeScript.
- **application, web**: An application written in TypeScript or JavaScript, HTML and CSS, which runs within the context of a web browser or a web container.
- **Application Provider**: A downstream consumer of FDC3 Standards that can understand and use the FDC3 API (supplied by a Platform Provider), context data, and/or intents.
- **application-specific intent**: A custom intent defined by an application or applications, independent of the Standard.
- **Bridge**: Shorthand for Desktop Agent Bridge.
- **bridging**: Shorthand for the exchange of messages across a Desktop Agent Bridge for the purposes of extending interop between apps managed by different Desktop Agents.
- **Bridge Connection Protocol (BCP)**: A defined set of steps for a Desktop Agent to connect to a Desktop Agent Bridge.
- **Bridge Messaging Protocol (BMP)**: Protocol for Desktop Agents to communicate with each other over a Desktop Agent Bridge.
- **Channel**: A grouping of apps for the purposes of sharing stateful pieces of data. A secondary interface of the FDC3 API.
- **context channels**: A mechanism to allow sets of apps to share stateful pieces of data among themselves, and to be alerted when that data changes.
- **context**: Shorthand for context data.
- **context data**: Objects encoding common identifiers and data in a standardized format that can be passed between apps via context channels or used in conjunction with intents to invoke actions creating a seamless cross-application workflow. Diverse context data types are created to encode different types of data, each having their own _type_ field and unique set of data fields.
- **Desktop Agent**: A desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain. The primary interface of the FDC3 API.
- **Desktop Agent Bridge (DAB)**: An independent service that Desktop Agents connect to which allows them to relay requests to other Desktop Agents also connected to the bridge, allowing FDC3-based interop to extend across multiple Desktop Agents and machines.
- **Desktop Agent Communication Protocol (DACP)**: JSON communication protocol for the Desktop Agent API. Used by a Desktop Agent Proxy interface over the Channel Messaging API (as specified by the Web Connection Protocol) to communicate with a Desktop Agent running in another window/frame.
- **Desktop Agent Preload**: An 'injected' or 'preloaded' Desktop Agent API implementation, typically provided by an electron (or similar) container or browser extension, which is made available to web applications at `window.fdc3` and may be returned by the `getAgent()` function defined in the FDC3 Web Connection Protocol.
- **Desktop Agent Proxy**: An interface to a web-based Desktop Agent (implementation of the Desktop Agent API) that uses the Web Connection Protocol and Desktop Agent Communication protocol to communicate with a Desktop Agent implementation running in another frame or window. Returned by the `getAgent()` function provided by the FDC3 NPM module where a browser-based Desktop Agent is detected. 
- **FDC3 API**: A baseline, consistent developer interface for interoperability between applications.
- **GUID**: Globally Unique IDentifier, synonymous with UUID. Defined by [IETF RFC4122](references).
- **interop**: Shorthand for interoperability.
- **interoperability**: the ability of software applications to exchange and make use of information and invoke specified actions.
- **intent**: A verb, with a pre-agreed meaning (expected behavior), used to invoke an action between applications. A set of such verbs can, in conjunction with Context Data acting as nouns, be used to put together common cross-application workflows on the financial desktop.
- **Listener**: API interface which allows unsubscribing from Intents or Context Channels.
- **Originating App**: The application that sent a particular context message or raised an intent.
- **Platform Provider**: An environment that provides an implementation of the FDC3 API that applications can use.
- **raising an intent**: The act of requesting, via the FDC3 API/Desktop Agent that a specified action be performed by another application, using specified context data as input.
- **resolver**: A facility of a Desktop Agent used to map a raised intent and associated context object to an application that will perform the action represented by the intent, using the context object as input. Where multiple applications can resolve the intent, a resolver will often display a user-interface allowing a user to pick from the available applications that support the intent and type of context supplied.
- **resolving an intent**: The act of mapping a specified intent and context object to an application.
- **standard intent**: An intent defined by this Standard.
- **UUID**: Universally Unique IDentifier, synonymous with GUID. Defined by [IETF RFC4122](references).
- **Web Connection Protocol (WCP)**: A defined set of steps for a web application to connect to Desktop Agents that implement any of the interfaces defined for web applications in the FDC3 Standard, including both preloaded Desktop Agent interfaces and Browser-based Desktop Agents that work with a Desktop Agent Proxy.
