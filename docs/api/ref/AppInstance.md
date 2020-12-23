---
id: AppInstance
sidebar_label: AppInstance
title: AppInstance
hide_title: true
---
# `AppInstance`

```ts
interface AppInstance {
  //properties
  readonly instanceId : string;
  readonly status : AppInstanceStatus;
  
  //methods
  addContextListener(handler: ContextHandler): Listener;
  addContextListener(contextType: string, handler: ContextHandler): Listener;
  broadcast(context: Context): void;
  onStatusChanged(handler : (newVal : string, oldVal :string) => {}) : void;

}

enum AppInstanceStatus {
  Ready = 'ready',
  Loading = 'loading',
  Unregistered = 'unregistered',
}
```

Represents a specific instance of an app.  

AppInstances can be used to directly listen for and broadcast context between two apps connected to a desktop agent.

An AppInstance is obtained by calling the `getAppInstence` method on the `DesktopAgent` using a source token provided by either an IntentResolution or as an argument to a ContextHandler. 

#### See also

* [`IntentResolution`](IntentResolution)
* [`ContextHandler`](ContextHandler)
* [`DesktopAgent.getAppInstance`](DesktopAgent#getappinstannce)


## Properties

### `instanceId`

```ts
public readonly instanceId: string;
```

Uniquely identifies the instance. This identifier is internal to the desktop agent.  It should correspond to the source prop returned for IntentResolution and ContextHandlers.

### `status`

```ts
public readonly status: AppInstanceStatus;
```

Represents the lifecycle status of the AppInstance.  

- *ready* indicates that the instance is loaded and connected to the DesktopAgent.
- *loading* indicates that the instance is in the process of loading and not yet connected and ready to recieve context or intents.
- *unregistered* indicates that the instance has disconnected from the DesktopAgent and is no longer available. 


## Methods


### `addContextListener`

```ts
public addContextListener(handler: ContextHandler): Listener;
```

Adds a listener for incoming contexts from the app instance.

```ts
public addContextListener(contextType: string, handler: ContextHandler): Listener;
```

Adds a listener for incoming contexts from the app instance using the specified _context type_.

#### Examples
Raise an intent then add a context listener on the resolved instance.
```ts
const listener = instance.addContextListener(context => {
    if (context.type === 'fdc3.contact') {
        // handle the contact
    } else if (context.type === 'fdc3.instrument') => {
        // handle the instrument
    }
});


```

Adding listeners for specific types of context that is broadcast from the instance:

```ts
const contactListener = instance.addContextListener('fdc3.contact', contact => {
    // handle the contact
});

const instrumentListener = instance.addContextListener('fdc3.instrument', instrument => {
    // handle the instrument
});

// later
contactListener.unsubscribe();
instrumentListener.unsubscribe();
```

#### See also
* [`Listener`](Listener)
* [`ContextHandler`](ContextHandler)
* [`IntentResolution`](IntentResolution)


### `broadcast`

```typescript
public broadcast(context: Context): void;
```

Broadcasts a context directly to the app instance. 

If the instance is not available, the method will return an `Error` with a string from the [`InstanceError`](InstanceError) enumeration.

#### Example

```javascript
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

try {
    instance.broadcast(instrument);
} catch (err: InstanceError) {
    // handler errror
}
```

#### See also
* [`InstanceError`](ChannelError)
* [`addContextListener`](#addcontextlistener)

### `onStatusChannged`

``` typescript
public onStatusChanged(handler : (newVal : AppInstanceStatus, oldVal : AppInstanceStatus) => {}) : void;
```

Sets a listener for status change events on an app instance.

Possible status values are:

- ready
- loading
- unregistered

### Example

```javascript

// get an app instance
const instance = await fdc3.getAppInstance(source);

// if status is ready, add a context listener
if (instance.status === AppInstanceStatus.Ready){
    const listener = instance.addContextListener(someContext, myListener);
}

// listen for status change, if status is unregistered, then unsubscribe the context listener
instance.onStatusChanged((status) => {
    if (status === AppInstanceStatus.unregistered){
        listener.unsubscribe();
    }
});

```