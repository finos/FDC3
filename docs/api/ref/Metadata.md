---
title: Metadata
---

FDC3 API operations return various types of metadata.

## `AppIntent`

```ts
interface AppIntent {
  intent: IntentMetadata;
  apps: Array<AppMetadata>;
}
```
An interface that represents the binding of an intent to apps, returned as part of intent disocvery.
For each intent, it reference the applications that support that intent.

#### See also
* [`AppMetadata`](AppMetadata)
* [`IntentMetadata`](IntentMetadata)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)

## `AppMetadata`

```ts
interface AppMetadata {
  /** The unique app name that can be used with the open and raiseIntent calls. */
  readonly name: string;

  /** The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root' */
  readonly appId?: string;

  /** The Version of the application. */
  readonly version?: string;

  /** An optional instance identifier, indicating that this object represents a specific instance of the application described.*/
  readonly instanceId?: string;

  /** An optional set of, implementation specific, metadata fields that can be used to disambiguate instances, such as a window title or screen position. Must only be set if `instanceId` is set. */
  readonly instanceMetadata?: Record<string, any>;

  /** A more user-friendly application title that can be used to render UI elements  */
  readonly title?: string;

  /**  A tooltip for the application that can be used to render UI elements */
  readonly tooltip?: string;

  /** A longer, multi-paragraph description for the application that could include markup */
  readonly description?: string;

  /** A list of icon URLs for the application that can be used to render UI elements */
  readonly icons?: Array<Icon>;

  /** A list of image URLs for the application that can be used to render UI elements */
  readonly images?: Array<string>;
}
```

Describes an application, or instance of an application, using metadata that is usually  provided by an FDC3 App Directory that the desktop agent connects to.

Will always includes at least a `name` property, which can be used with [`open`](DesktopAgent#open) and [`raiseIntent`](DesktopAgent#raiseIntent). If the `instanceId` field is set then the `AppMetadata` object represents a specific instance of the application that may be addressed using that Id.

Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu. This includes a title, description, tooltip and icon and image URLs.

In situations where a desktop agent connects to multiple app directories or multiple versions of the same app exists in a single app directory, it may be neccessary to specify appId and version to target applications that share the same name.

`AppMetadata`

#### See also
* [`AppIntent.apps`](AppIntent)
* [`Icon`](Icon)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)

## `DisplayMetadata`

```ts
 public interface DisplayMetadata {
  name?: string;
  color?: string;
  glyph?: string;
}
```

A desktop agent (typically for _system_ channels) may want to provide additional information about how a channel can be represented in a UI. A common use case is for color linking.

#### Properties

#### `name`

```ts
name?: string;
```

The display name for the channel.

#### `color`

```ts
color?: string;
```

A name, hex, rgba, etc. that should be associated within the channel when displaying it in a UI.

#### `glyph`

```ts
glyph: string;
```

A URL of an image that can be used to display this channel.

#### See also

* [`Channel`](Channel)
* [`DesktopAgent.getSystemChannels`](DesktopAgent#getsystemchannels)

## `ImplementationMetadata`

```typescript
public interface ImplementationMetadata {
  fdc3Version: string;
  provider: string;
  providerVersion?: string;
}
```

Metadata relating to the FDC3 [DesktopAgent](DesktopAgent) object and its provider, including the supported version of the FDC3 specification and the name of the provider of the implementation.

#### See also
* [`DesktopAgent.getInfo`](DesktopAgent#getInfo)

## `IntentMetadata`

```ts
interface IntentMetadata {
  name: string;
  displayName: string;
}
```

The Interface used to describe an Intent within the platform.


#### See also
* [`AppIntent.intent`](AppIntent)

## `IntentResolution`

```ts
interface IntentResolution {
  /** 
   * Metadata about the app instance that was selected (or started) to resolve the intent.
   * `source.instanceId` MUST be set, indicating the specific app instance that 
   * received the intent.
   */
  readonly source: AppMetadata;
  /**
   * The intent that was raised. May be used to determine which intent the user
   * chose in response to `fdc3.raiseIntentForContext()`.
   */
  readonly intent: string;
  /**
   * @deprecated not assignable from intent listeners
   */
  readonly data?: object;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version?: string;

}
```

IntentResolution provides a standard format for data returned upon resolving an intent.

#### Examples
```js
// resolve a "Chain" type intent
let resolution = await fdc3.raiseIntent("intentName", context);

// Use metadata about the resolving app instance to target a further intent
try {
  const resolution = await fdc3.raiseIntent('StageOrder', context);
  ...

  //some time later
  await agent.raiseIntent("UpdateOrder", context, resolution.source);
}
catch (err) { ... }
```

#### See also
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`TargetApp`](TargetApp)
