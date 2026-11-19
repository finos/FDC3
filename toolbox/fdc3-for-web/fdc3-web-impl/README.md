# FDC3 Web Implementation

> [!WARNING]
> **Not for production use.** This is the FDC3 reference implementation of the Desktop Agent side of the FDC3 For-The-Web protocol. We use it to clarify the standard and to test `@finos/fdc3-get-agent` and `@finos/fdc3-agent-proxy`. It does **not** follow semantic versioning, so any release may contain breaking changes.
>
> If you're building a web-based Desktop Agent, take a look at [FDC3-Sail](https://github.com/finos/FDC3-Sail), a FINOS project working towards a production-ready open-source implementation. You're welcome to copy code from this package, but please don't depend on it.

This repository contains a [FDC3 2.2 Conformant](../../fdc3-conformance/README.md), headless implementation of the FDC3 DACP protocol. 

This package forms the basis of the implementation of the FDC3 Desktop Agent reference implementation, found in [the demo module](../demo/README.md) as well as the web-version of [FDC3-Sail](https://github.com/finos/FDC3-Sail/).

Desktop Agent implementers are welcome to use the tests provided here to test their own implementation, or to take inspiration from (or copy) the codebase when building their own FDC3 Desktop Agent. Please don't depend on this package directly (see the warning above).

## How This Works

There are three main types of component here:

- **MessageHandlers**: These are the core of the FDC3 implementation. They are responsible for handling incoming messages from apps and responding to them correctly.  There are four defined, breaking up the functionality of FDC3:  `BroadcastHandler` (handing channels and broadcasting), `IntentHandler` (handling intents, intent resolution etc.), `OpenHandler` (handling app launches) and `HeartbeatHandler` (handling app liveness and disconnection).

 - **FDC3Server**: This is the main entry point for the FDC3 implementation. It is responsible for setting up the message handlers and starting the server, implemented by `BasicFDC3Server` and `DefaultFDC3Server` classes. 

 - **ServerContext**: This interface is responsible for maintaining the state of the server.  `ServerContext` really determines how FDC3 is run: how messages are sent, how apps are launched, how intents are resolved etc.  It is the main point of customization for an FDC3 implementation. If you are implementing an FDC3 Desktop Agent, you will need to implement this class yourself.   See the [Demo](../demo/README.md), which implements this in-browser as `DemoServerContext`.  