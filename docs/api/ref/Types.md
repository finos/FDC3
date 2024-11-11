---
title: Types
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

FDC3 API operations make use of several type declarations.

## `AppIdentifier`

Identifies an application, or instance of an application, and is used to target FDC3 API calls at specific applications.
Will always include at least an `appId` property, which can be used with `fdc3.open`, `fdc3.raiseIntent` etc..
If the `instanceId` field is set then the `AppIdentifier` object represents a specific instance of the application that may be addressed using that Id.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

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

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IAppIdentifier
{
    /// <summary>
    /// The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root'.
    /// </summary>
    string AppId { get; }

    /// <summary>
    /// An optional instance identifier, indicating that this object represents a specific instance of the application described.
    /// </summary>
    string? InstanceId { get; }
}
```

</TabItem>
</Tabs>

**See also:**

- [`AppMetadata`](Metadata#appmetadata)
- [`DesktopAgent.open`](DesktopAgent#open)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
- [`IntentResolution`](Metadata#intentresolution)

## `Context`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface Context {
  id?: { [key: string]: string };
  name?: string;
  type: string;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IContext<out T>: IIntentResult, IDynamicContext where T : class
{
    T? ID { get; }
    string? Name { get; }
    string Type { get; }
}

interface IContext : IContext<object>
{
}

interface IDynamicContext
{
    /// <summary>
    /// Underlying message as a dynamic type for accessing all properties without deserialization
    /// </summary>
    dynamic? Native { get; set; }
}
```

</TabItem>
</Tabs>

The base interface that all contexts should extend: a context data object adhering to the [FDC3 Context Data specification](../../context/spec).

This means that it must at least have a `type` property that indicates what type of data it represents, e.g. `'fdc3.contact'`. The `type` property of context objects is important for certain FDC3 operations, like [`Channel.getCurrentContext`](Channel#getCurrentContext) and [`DesktopAgent.addContextListener`](DesktopAgent#addContextListener), which allows you to filter contexts by their type.

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

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type ContextHandler = (context: Context, metadata?: ContextMetadata) => void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
delegate void ContextHandler<T>(T context, IContextMetadata? metadata = null) where T : IContext;
```

</TabItem>
</Tabs>

Describes a callback that handles a context event. Optional metadata about the context message, including the app that originated the message, may be provided.

Used when attaching listeners for context broadcasts.

Optional metadata about the context message, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

**See also:**

- [`Context`](#context)
- [`ContextMetadata`](Metadata#contextmetadata)
- [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)

## `DesktopAgentIdentifier`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
/** @experimental */
interface DesktopAgentIdentifier {
  /** Used in Desktop Agent Bridging to attribute or target a message to a 
   *  particular Desktop Agent.**/
  readonly desktopAgent: string;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```
Not implemented
```

</TabItem>

</Tabs>

(Experimental) Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios where a request needs to be directed to a Desktop Agent rather than a specific app, or a response message is returned by the Desktop Agent (or more specifically its resolver) rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no app details are available or are appropriate.

**See also:**

* [Agent Bridging - Identifying Desktop Agents Identity and Message Sources](../../agent-bridging/spec#identifying-desktop-agents-identity-and-message-sources)

## `IntentHandler`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type IntentHandler = (context: Context, metadata?: ContextMetadata) => Promise<IntentResult> | void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
delegate Task<IIntentResult> IntentHandler<T>(T context, IContextMetadata? metadata = null) where T : IContext;
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type IntentResult = Context | Channel | void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IIntentResult { /* Marker interface implemented by IContext and Channel */ }
```

</TabItem>
</Tabs>

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

A Listener object is returned when an application subscribes to intents or context broadcasts via the [`addIntentListener`](DesktopAgent#addintentlistener), [`addContextListener`](DesktopAgent#addcontextlistener) or [`addEventListener`](DesktopAgent#addeventlistener) on the [DesktopAgent](DesktopAgent) object or (PrivateChannel#addeventlistener) on the [PrivateChannel](PrivateChannel) object.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface Listener {
  unsubscribe(): Promise<void>;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IListener
{
    void Unsubscribe();
}
```

</TabItem>
</Tabs>

### `unsubscribe`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
unsubscribe(): Promise<void>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
void Unsubscribe();
```

</TabItem>
</Tabs>

Allows an application to unsubscribe from listening to intents or context broadcasts.

**See also:**

- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)
- [`ContextHandler`](Types#contexthandler)
