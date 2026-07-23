---
title: Types
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

FDC3 API operations make use of several type declarations.

## `AppIdentifier`

Identifies an application, or instance of an application, and is used to target FDC3 API calls at specific applications.

An `AppIdentifier` will always include at least an `appId` property, which can be used with `fdc3.open`, `fdc3.raiseIntent` etc.. An `appId` is intended to reference a specific record from an [App Directory](../../app-directory/overview), which it uniquely identifies within that App Directory.

The `appId` may be unqualified or fully-qualified as described in the [API overview](../spec#fully-qualified-appids) and [App Directory](../../app-directory/overview#application-identifiers) Parts of the Standard and may be resolved and used interchangeably as described in the [API overview](../spec#fully-qualified-appids).

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
<TabItem value="golang" label="Go">

```go
type AppIdentifier struct {
  // The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root'.
  AppId      string `json:"appId"`
  // An optional instance identifier, indicating that this object represents a specific instance of the application described.
  InstanceId string `json:"instanceId"`
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
<TabItem value="golang" label="Go">

```go
type Context struct {
  Type    string                 `json:"type"`
  Name    string                 `json:"name"`
  Id      map[string]string      `json:"id"`
}

type IContext interface {
  // TODO: include at least one method in here 
}
```

</TabItem>
</Tabs>

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

## `ContextWithMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type ContextWithMetadata = {
  context: Context;
  metadata: ContextMetadata;
};
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IContextWithMetadata
{
    IContext Context { get; }
    IContextMetadata Metadata { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type ContextWithMetadata struct {
  Context  Context         `json:"context"`
  Metadata ContextMetadata `json:"metadata"`
}
```

</TabItem>
</Tabs>

Represents a context object paired with its associated metadata. Returned by [`Channel.getCurrentContextWithMetadata()`](Channel#getcurrentcontextwithmetadata) to allow retrieval of both the current context and the [`ContextMetadata`](Metadata#contextmetadata) that was provided when it was broadcast. May also be returned by an [`IntentHandler`](#intenthandler) to include app-provided metadata alongside a context result, which will be merged with Desktop Agent generated metadata and made available to the raising app via [`IntentResolution.getResultMetadata()`](Metadata#intentresolution).

**See also:**

- [`Context`](#context)
- [`ContextMetadata`](Metadata#contextmetadata)
- [`Channel.getCurrentContextWithMetadata`](Channel#getcurrentcontextwithmetadata)
- [`IntentHandler`](#intenthandler)
- [`IntentResolution.getResultMetadata`](Metadata#intentresolution)

## `ContextHandler`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type ContextHandler = (context: Context, metadata: ContextMetadata) => void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
delegate void ContextHandler<T>(T context, IContextMetadata? metadata = null) where T : IContext;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type ContextHandler func(IContext, *ContextMetadata)
```

</TabItem>
</Tabs>

Describes a callback that handles a context event. Used when attaching listeners for context broadcasts.

Metadata about each context message received, including the app that originated the message and a timestamp, MUST be provided by the Desktop Agent implementation. Apps raising intents MAY provide additional metadata (such as a traceId, signature or custom metadata), which the Desktop Agent MUST pass on to the handler.

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

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type DesktopAgentIdentifier struct {
  DesktopAgent string
}
```

</TabItem>
</Tabs>

(Experimental) Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios where a request needs to be directed to a Desktop Agent rather than a specific app, or a response message is returned by the Desktop Agent (or more specifically its resolver) rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no app details are available or are appropriate.

**See also:**

- [Agent Bridging - Identifying Desktop Agents Identity and Message Sources](../../agent-bridging/spec#identifying-desktop-agents-identity-and-message-sources)

## `IntentHandler`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type IntentHandler = (
  context: Context,
  metadata: ContextMetadata
) => Promise<Context | ContextWithMetadata | Channel | PrivateChannel | void> | void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
delegate Task<IIntentResult> IntentHandler<T>(T context, IContextMetadata? metadata = null) where T : IContext;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type IntentHandler func(IContext, *ContextMetadata) <-chan IntentResult
```

</TabItem>
</Tabs>

Describes a callback that handles a context event and may return a promise of a `Context`, `ContextWithMetadata`, `Channel`, `PrivateChannel` or `void` to be returned to the application that raised the intent. Used when attaching listeners for raised intents.

Metadata about each intent & context message received, including the app that originated the message and a timestamp, MUST be provided by the Desktop Agent implementation. Apps raising intents MAY provide additional metadata (such as a traceId, signature or custom metadata), which the Desktop Agent MUST pass on to the handler.

An `IntentHandler` MAY return a [`ContextWithMetadata`](#contextwithmetadata) object instead of a plain `Context` to include app-provided metadata (e.g. a `traceId` or `signature`) alongside the context result. The Desktop Agent will merge this with its own generated metadata and make the combined [`ContextMetadata`](Metadata#contextmetadata) available to the raising app via [`IntentResolution.getResultMetadata()`](Metadata#intentresolution). [`IntentResolution.getResult()`](Metadata#intentresolution) will still return only the `Context` portion.

**See also:**

- [`Context`](#context)
- [`ContextWithMetadata`](#contextwithmetadata)
- [`ContextMetadata`](Metadata#contextmetadata)
- [`PrivateChannel`](PrivateChannel)
- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)

## `IntentResult`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type IntentResult = Context | ContextWithMetadata | Channel | void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IIntentResult { /* Marker interface implemented by IContext and Channel */ }
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type IntentResult any

type IntentResultType string
const (
  ChannelIntentResult        IntentResultType = "Channel"
  ContextIntentResult        IntentResultType = "Context"
  PrivateChannelIntentResult IntentResultType = "PrivateChannel"
)
```

</TabItem>
</Tabs>

Describes results returned by [`IntentResolution.getResult()`](Metadata#intentresolution) after an intent is resolved. Note that [`IntentHandler`](#intenthandler) functions may also return [`ContextWithMetadata`](#contextwithmetadata) to include app-provided metadata alongside a context result; in that case `getResult()` still returns only the `Context` portion, while the metadata is available via [`IntentResolution.getResultMetadata()`](Metadata#intentresolution).

Represented as a union type in TypeScript, however, this type may be rendered as an interface in other languages that both the `Context` and `Channel` types implement, allowing either to be returned by an `IntentHandler`.

**See also:**

- [`Context`](#context)
- [`ContextWithMetadata`](#contextwithmetadata)
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
    Task Unsubscribe();
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type IListener interface {
  Unsubscribe()
}
type Listener struct {}
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
Task Unsubscribe();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (l *Listener) Unsubscribe() {
  // Implementation here
}
```

</TabItem>
</Tabs>

Allows an application to unsubscribe from listening to intents or context broadcasts.

**See also:**

- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)
- [`ContextHandler`](Types#contexthandler)
