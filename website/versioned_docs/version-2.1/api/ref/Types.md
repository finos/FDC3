---
title: Types
---

FDC3 API operations make use of several type declarations.

## `AppIdentifier`

Identifies an application, or instance of an application, and is used to target FDC3 API calls at specific applications.
Will always include at least an `appId` property, which can be used with `fdc3.open`, `fdc3.raiseIntent` etc..
If the `instanceId` field is set then the `AppIdentifier` object represents a specific instance of the application that may be addressed using that Id.

```ts
interface AppIdentifier {
  /** The unique application identifier located within a specific application
   *  directory instance. An example of an appId might be 'app@sub.root'.
   */
  readonly appId: string;
  
  /** An optional instance identifier, indicating that this object represents a
   *  specific instance of the application described.
   */
  readonly instanceId?: string;

  /** The Desktop Agent that the app is available on. Used in Desktop Agent 
   *  Bridging to identify the Desktop Agent to target.
   *  @experimental
   **/
  readonly desktopAgent?: string;
}
```

**See also:**

- [`AppMetadata`](Metadata#appmetadata)
- [`DesktopAgent.open`](DesktopAgent#open)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
- [`IntentResolution`](Metadata#intentresolution)

## `Context`

```typescript
interface Context {
  id?: { [key: string]: string };
  name?: string;
  type: string;
}
```

The base interface that all contexts should extend: a context data object adhering to the [FDC3 Context Data specification](../../context/spec).

This means that it must at least have a `type` property that indicates what type of data it represents, e.g. `'fdc3.contact'`. The `type` property of context objects is important for certain FDC3 operations, like [`Channel.getCurrentContext`](Channel#getcurrentcontext) and [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener), which allows you to filter contexts by their type.

**See also:**

- [`ContextHandler`](#contexthandler)
- [`DesktopAgent.open`](DesktopAgent#open)
- [`DesktopAgent.broadcast`](DesktopAgent#broadcast)
- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
- [`DesktopAgent.findIntent`](DesktopAgent#findintent)
- [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
- [`Channel.broadcast`](Channel#broadcast)
- [`Channel.getCurrentContext`](Channel#getcurrentcontext)
- [`Channel.addContextListener`](Channel#addcontextlistener)

## `ContextHandler`

```typescript
type ContextHandler = (context: Context, metadata?: ContextMetadata) => void;
```

Describes a callback that handles a context event. Optional metadata about the context message, including the app that originated the message, may be provided.

Used when attaching listeners for context broadcasts.

Optional metadata about the context message, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

**See also:**

- [`Context`](#context)
- [`ContextMetadata`](Metadata#contextmetadata)
- [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)

## `DesktopAgentIdentifier`

```typescript
/** @experimental */
interface DesktopAgentIdentifier {
  /** Used in Desktop Agent Bridging to attribute or target a message to a 
   *  particular Desktop Agent.**/
  readonly desktopAgent: string;
}
```

(Experimental) Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios where a request needs to be directed to a Desktop Agent rather than a specific app, or a response message is returned by the Desktop Agent (or more specifically its resolver) rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no app details are available or are appropriate.

**See also:**

* [Agent Bridging - Identifying Desktop Agents Identity and Message Sources](../../agent-bridging/spec#identifying-desktop-agents-identity-and-message-sources)

## `IntentHandler`

```typescript
type IntentHandler = (context: Context, metadata?: ContextMetadata) => Promise<IntentResult> | void;
```

Describes a callback that handles a context event and may return a promise of a Context, Channel object or `void` to be returned to the application that raised the intent.

Used when attaching listeners for raised intents.

Optional metadata about the intent & context message, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

**See also:**

- [`Context`](#context)
- [`ContextMetadata`](Metadata#contextmetadata)
- [`PrivateChannel`](PrivateChannel)
- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)

## `IntentResult`

```typescript
type IntentResult = Context | Channel | void;
```

Describes results that an Intent handler may return that should be communicated back to the app that raised the intent, via the [`IntentResolution`](Metadata#intentresolution).

Represented as a union type in TypeScript, however, this type may be rendered as an interface in other languages that both the `Context` and `Channel` types implement, allowing either to be returned by an `IntentHandler`.

**See also:**

- [`Context`](#context)
- [`Channel`](Channel)
- [`PrivateChannel`](PrivateChannel)
- [`IntentHandler`](#intenthandler)
- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`IntentResolution`](Metadata#intentresolution)

## `Listener`

A Listener object is returned when an application subscribes to intents or context broadcasts via the [`addIntentListener`](DesktopAgent#addintentlistener) or [`addContextListener`](DesktopAgent#addcontextlistener) methods on the [DesktopAgent](DesktopAgent) object.

```typescript
interface Listener {
  unsubscribe(): void;
}
```

### `unsubscribe`

```ts
unsubscribe(): void;
```

Allows an application to unsubscribe from listening to intents or context broadcasts.

**See also:**

- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)
- [`ContextHandler`](Types#contexthandler)
