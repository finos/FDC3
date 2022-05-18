---
title: Types
---

FDC3 API operations make use of several type declarations.

## `Context`

```typescript
interface Context {
  id?: { [key: string]: string };
  name?: string;
  type: string;
}
```

The base interface that all contexts should extend: a context data object adhering to the [FDC3 Context Data specification](../../context/spec).

This means that it must at least have a `type` property that indicates what type of data it represents, e.g. `'fdc3.contact'`. The `type` property of context objects is important for certain FDC3 operations, like [`Channel.getCurrentContext`](Channel#getCurrentContext) and [`DesktopAgent.addContextListener`](DesktopAgent#addContextListener), which allows you to filter contexts by their type.


#### See also
* [`ContextHandler`](#contexthandler)
* [`DesktopAgent.open`](DesktopAgent#open)
* [`DesktopAgent.broadcast`](DesktopAgent#broadcast)
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`Channel.broadcast`](Channel#broadcast)
* [`Channel.getCurrentContext`](Channel#getcurrentcontext)
* [`Channel.addContextListener`](Channel#addcontextlistener)

## `ContextHandler`

```typescript
type ContextHandler = (context: Context, metadata?: ContextMetadata) => void;
```

Describes a callback that handles a context event. Optional metadata about the context message, including the app that originated the message, may be provided.

Used when attaching listeners for context broadcasts.

Optional metadata about the context message, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

#### See also

* [`Context`](#context)
* [`ContextMetadata`](Metadata#contextmetadata)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
* [`Channel.addContextListener`](Channel#addcontextlistener)

## `IntentHandler`

```typescript
type IntentHandler = (context: Context, metadata?: ContextMetadata) => Promise<IntentResult> | void;
```

Describes a callback that handles a context event and may return a promise of a Context or Channel object to be returned to the application that raised the intent.

Used when attaching listeners for raised intents.

Optional metadata about the intent & context message, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

#### See also
* [`Context`](#context)
* [`ContextMetadata`](Metadata#contextmetadata)
* [`PrivateChannel`](PrivateChannel)
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`Channel.addContextListener`](Channel#addcontextlistener)

## `IntentResult`

```typescript
type IntentResult = Context | Channel;
```

Describes results that an Intent handler may optionally return that should be communicated back to the app that raised the intent, via the [`IntentResolution`](Metadata#intentresolution). 

Represented as a union type in TypeScript, however, this type may be rendered as an interface in other languages that both the `Context` and `Channel` types implement, allowing either to be returned by an `IntentHandler`.

#### See also
* [`Context`](#context)
* [`Channel`](Channel)
* [`PrivateChannel`](PrivateChannel)
* [`IntentHandler`](#intenthandler)
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`IntentResolution`](Metadata#intentresolution)


## `Listener`

A Listener object is returned when an application subscribes to intents or context broadcasts via the [`addIntentListener`](#addintentlistener) or [`addContextListener`](#addcontextlistener) methods on the [DesktopAgent](DesktopAgent) object.

```typescript
interface Listener {
  unsubscribe(): void;
}
```
#### `unsubscribe`

```ts
unsubscribe(): void;
```

Allows an application to unsubscribe from listening to intents or context broadcasts.

#### See also
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
* [`Channel.addContextListener`](Channel#addcontextlistener)
* [`ContextHandler`](Types#contexthandler)


## `TargetApp`

```typescript
type TargetApp = string | AppMetadata;
```

Operations that target apps (like `open` or `raiseIntent`) can identify an app just by by its name,
or pass full app metadata, giving the desktop agent more information about the targeted app.

#### See also
* [`AppMetadata`](Metadata#appmetadata)
* [`DesktopAgent.open`](DesktopAgent#open)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`IntentResolution`](Metadata#intentresolution)


## `Icon`

```typescript
interface Icon {
  src: string;
  size?: string;
  type?: string;
}
```

AppMetadata includes an icons property allowing multiple icon types to be specified. Various properties may be used by the Desktop Agent to decide which icon is the most suitable to be used considering the application chooser UI, device DPI and formats supported by the system.

#### Example

```js
"icons": [
  {
    "src": "https://app.foo.icon/app_icons/lowres.webp",
    "size": "48x48",
    "type": "image/webp"
  },
  {
    "src": "https://app.foo.icon/app_icons/hd_hi.svg",
    "size": "72x72",
    "type": "image/svg+xml"
  }
]
```

#### Properties

#### `src`

The fully qualified url to the icon.

#### `size`

The dimension of the icon using formatted as "<height>x<width>"

#### `type`

The media type of the icon. If not provided the Desktop agent may refer to the src file extension.



#### See also
* [`AppMetadata`](Metadata#appmetadata)