---
id: api-spec
sidebar_label: API Specification
title: API Specification
hide_title: true
---

# API Specification 

## Components
### Desktop Agent
A Desktop Agent is a desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain.  A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.  

Examples of Desktop Agents include:

- OpenFin
- Autobahn
- ThomsonReuters Eikon

Desktop Agents expose an FDC3 standard API to applications they have launched.  When an App is launched by a Desktop Agent and is given access to the Agent's API to interoperate, it is running in that Desktop Agent's *context*. 

![Desktop Agent - Standards Schematic](assets/api-1.png)

The surface area of FDC3 standardization (shown in *white* above) itself is quite small in comparison to the extent of a typical desktop agent implementation (in *grey*).  

For example: 
- workspace management
- user identity and SSO
- entitlements
- UX of application resolution

Are all areas of functionality that any feature complete desktop agent would implement, but are not currently areas considered for standardization under FDC3.

#### Inter-Agent Communication
A goal of FDC3 standards is that applications running in different Desktop Agent contexts on the same desktop would be able to interoperate.  And that one Desktop Agent context would be able to discover and launch an application in another Desktop Application context.  

![Desktop Agent - Interop](assets/api-2.png)

Desktop Agent interop is supported by common standards for APIs for App discovery and launching.  So, an App in one Desktop Agent context would not need to know a different syntax to call an App in another Desktop Agent context.  

The actual connection protocol between Desktop Agents is not currently in scope for FDC3 standards.  Given that there are a relatively small number of Desktop Agents, and that any given desktop will have a finite and relatively static number of Desktop Agents installed at any given time, the connectivity between different Agents can be adequetly handled for the time being on a case-by-case basis.  

### Application
An application is any endpoint on the desktop that is:
- Registered with/known by a Desktop Agent
- Launchable by a Desktop Agent
- Addressable by a Desktop Agent

Examples of End Points include:
- Native Applications
- PWA/Web Applications
- Headless “services” running on the desktop

## Functional Use Cases
### Open an Application by Name
Linking from one application to another is a critical basic workflow that the web revolutionized via the hyperlink.  Supporting semantic addressing of applications across different technologies and platform domains greatly reduces friction in linking different applications into a single workflow.

### Raising Intents
Often, we want to link from one app to another to dynamically create a workflow.  Enabling this without requiring prior knowledge between apps is a key goal of FDC3.

Intents provide a way for an app to request functionality from another app and defer the discovery and launching of the destination app to the Desktop Agent.  There are multiple models for interop that Intents can support.

- **Chain**:  In this case the workflow is completely handed off from one app to another (similar to linking).   Currently, this is the primary focus in FDC3
- **Client-Service**: A Client invokes a Service via the Intent, the Service performs some function, then passes the workflow back to the Client.  Typically, there is a data payload type associated with this intent that is published as the standard contract for the intent.
- **Remote API**: An app wants to remote an entire API that it owns to another App.  In this case, the API for the App cannot be standardized.  However, the FDC3 API can address how an App connects to another App in order to get access to a proprietary API.

#### Intent Resolution
Raising an Intent will return a Promise-type object that will resolve/reject based on a number of factors.

##### Resolve
- Intent was resolved unambigiously and the recieving app was launched successfully.
- Intent was ambigious, a resolution was chosen by the end user and the chosen application was launched succesfully.

##### Reject
- An app matching the intent was not found.
- A match was found, but the recieving app failed to launch.
- The intent was ambiguous and the resolver experienced an error.

##### Resolution Object
If the raising of the intent resolves (or rejects), a standard object will be passed into the resolver function with the following format:

```javascript
{
    source: String;
    data?: Object; 
    version: String;
}
```
- *source* = identifier for the Application resolving the intent (null if the intent could not be resolved)
- *data* = return data structure - if one is provided for the given intent
- *version* = the version number of the Intents schema being used

For example

```javascript
try {
    let result = await agent.raiseIntent('StageOrder');
    if (result.data){
        let orderId = result.data.id;
    }
}
catch (er){
    console.log(er.message);
}

```

##### Upgrading to a Remote API Connection
There are a wide range of workflows where decoupled intents and/or context passing do not provide rich enough interactivity and applications are better off exposing proprietary APIs.  In these cases, an App can use the *source* propoerty on the resolution of an intent to connect directly to another App and from there, call remote APIs using the methods available in the Desktop Agent context for the App.  For example: 

```javascript
    let chart = await agent.raiseIntent('ViewChart');
     //construct an OpenFin wrapper for the App
    let chartApp = fin.Application.wrap(chart.source);
    //do some OpenFin specific stuff
```
![Upgrading Connection to Remote API](assets/api-3.png)

### Register an Intent
Applications need to let the system know the Intents they can support.  Typically, this is done via registration with the App Directory.  It is also possible for Intents to be registered at the application level as well to support ad-hoc registration which may be helpful at development time.  While, dynamic registration is not part of this specification, a Desktop Agent agent may choose to support any number of registration paths.

#### Compliance with Intent Standards
Intents represent a contract with expected behavior if an app asserts that it supports the intent.  Where this contract is enforcable by schema (for example, return object types),the FDC3 API implementation should enforce compliance and return an error if the interface is not met.  

It is expected that App Directories will also curate listed apps and ensure that they are complying with declared intents.

Like FDC3 Context Data, the Intent schemas need to be versioned.  Desktop Agents will be responsible to declare which version of the Intent schema they are using.   Applications may also assert a specific version requirement when raising an Intent.  Version negotation may be supported by a given Desktop Agent.

### Resolvers
Intents functionality is dependent on resolver functionality to map the intent to a specific App.  This will often require end-user input.  Resolution can either be performed by the Desktop Agent (raising UI to pick the desired App for the intent) or by the app launching the intent - in which case the calling App will handle the resolution itself (using the findIntents API below) and then invoke an explicit Intent object.

## Context Sharing (DRAFT)

On the financial desktop, applications can share related context and state with each other through the context sharing APIs. An application that wants to share context can simply publish a context object without being aware of how or by who the data is consumed.

Applications can listen to all incoming context updates by declaring a generic context listener. If an application wants to be more selective and only wants to be notified of specific types of context, they can declare a typed context listener. The desktop agent will inspect the `type` property of context objects to route context updates only to interested applications. There is no limit to the amount of context listeners a receiving application can declare.

When declaring a listener, a handle is returned that applications can use to unsubscribe from future updates.

Applications that would like to query the current state of the desktop when they start up, can ask the desktop agent for the current value of a particular context type. This will return, asynchronously, the most recent value of that type, or no value, if none has been published for that type. An example of this behaviour would be a charting application that joins a group of trading applications, and would like to initialise itself to the currently selected instrument on the desktop.

### Setting context

Applications use the broadcast operation to publish context data objects to the desktop.

```ts
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL';
    }
};

desktopAgent.broadcast(instrument);
```

> Proposal: Can we change the name? e.g. `shareContext`/`setContext`.
>
> Reason: Broadcast doesn't imply the saving of the value for later `getCurrentValue` call.

### Getting context

If an application declares a generic context listener, providing a callback, they will be notified whenever another application invokes the `broadcast` function for any object:

```ts
const listener = desktopAgent.addContextListener(context => {
    // handle context object
});
```

If an application declares a typed context listener, the callback will only be invoked for context object updates where the type matches:

```ts
const instrumentListener = desktopAgent.addTypedContextListener('fdc3.instrument', instrument => {
    // handle instrument object
});
```

If an application would like to retrieve the current state of the desktop at startup, they can ask for the current value for a particular type of object:

```ts
await instrument = desktopAgent.getCurrentValue('fdc3.instrument');
```

An application can retrieve the current value as well as listen to future updates, where it makes sense to do so.

### Channels (DRAFT)

Applications can join channels, e.g. based on color or workspace.

If an application joins a channel, this filters context updates - applications will only receive updates if they are part of the same channel.

> Channel operations could include (TBD):
> * joining a channel
> * leaving a channel
> * listing available channels
> * channel events
>
> Should known channels be declared in the app directory?

## APIs
The APIs are defined in TypeScript in [src], with documentation generated in the [docs] folder.

[src]: https://github.com/FDC3/FDC3/tree/master/src/api
[docs]: https://github.com/FDC3/FDC3/tree/master/docs/api