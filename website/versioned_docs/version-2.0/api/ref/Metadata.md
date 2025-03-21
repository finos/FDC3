---
title: Metadata
original_id: Metadata
---

FDC3 API operations return various types of metadata.

## `AppIntent`

```ts
interface AppIntent {
  /** Details of the intent whose relationship to resolving applications is
   *  being described.
   */
  readonly intent: IntentMetadata;

  /** Details of applications that can resolve the intent. */
  readonly apps: Array<AppMetadata>;
}
```

An interface that represents the binding of an intent to apps, returned as part of intent disocvery.
For each intent, it reference the applications that support that intent.

#### See also

* [`AppMetadata`](#appmetadata)
* [`IntentMetadata`](#intentmetadata)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)

## `AppMetadata`

```ts
interface AppMetadata extends AppIdentifier {
  /**
   *  The 'friendly' app name. This field was used with the `open` and
   *  `raiseIntent` calls in FDC3 <2.0, which now require an `AppIdentifier`
   *  with `appId` set. 
   * 
   *  Note that for display purposes the `title` field should be used, if set,
   *  in preference to this field.
   */
  readonly name?: string;

  /** The version of the application. */
  readonly version?: string;

  /** An optional set of, implementation specific, metadata fields that can be
   *  used to disambiguate instances, such as a window title or screen position.
   *  Must only be set if `instanceId` is set. 
   */
  readonly instanceMetadata?: Record<string, any>;

  /** A more user-friendly application title that can be used to render UI
   *  elements.
   */
  readonly title?: string;

  /** A tooltip for the application that can be used to render UI elements. */
  readonly tooltip?: string;

  /** A longer, multi-paragraph description for the application that could
   *  include mark-up.
   */
  readonly description?: string;

  /** A list of icon URLs for the application that can be used to render UI 
   *  elements.
   */
  readonly icons?: Array<Icon>;

  /** Images representing the app in common usage scenarios that can be used to render UI elements */
  readonly screenshots?: Array<Image>;
  
  /** The type of result returned for any intent specified during resolution. 
   *  May express a particular context type (e.g. "fdc3.instrument"), channel 
   *  (e.g. "channel") or a channel that will receive a specified type 
   *  (e.g. "channel<fdc3.instrument>").
   */
  readonly resultType?: string | null;
}
```

Extends an AppIdentifier, describing an application or instance of an application, with additional descriptive metadata that is usually provided by an FDC3 App Directory that the desktop agent connects to.

The additional information from an app directory can aid in rendering UI elements, such as a launcher menu or resolver UI. This includes a title, description, tooltip and icon and screenshot URLs.

Note that as `AppMetadata` instances are also `AppIdentifiers` they may be passed to the `app` argument of `fdc3.open`, `fdc3.raiseIntent` etc..

#### See also

* [`AppIdentifier`](Types#appidentifier)
* [`AppIntent.apps`](Metadata#appintent)
* [`Icon`](Metadata#icon)
* [`Image`](Metadata#image)
* [`DesktopAgent.open`](DesktopAgent#open)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)

## `ContextMetadata`

```ts
interface ContextMetadata {
  /** Identifier for the app instance that sent the context and/or intent. 
   *  @experimental 
   */
  readonly source: AppIdentifier;
}
```

Metadata relating to a context or intent & context received through the `addContextListener` and `addIntentListener` functions. Currently identifies the app that originated the context or intent message.

[`@experimental`](../../fdc3-compliance#experimental-features) Introduced in FDC3 2.0 and may be refined by further changes outside the normal FDC3 versioning policy.

#### See also

* [`AppMetadata`](#appmetadata)
* [`ContextHandler`](Types#contexthandler)
* [`IntentHandler`](Types#intenthandler)
* [`addIntentListener`](DesktopAgent#addintentlistener)
* [`addContextListener`](DesktopAgent#addcontextlistener)
* [`Channel.addContextListener`](Channel#addcontextlistener)

## `DisplayMetadata`

```ts
interface DisplayMetadata {
  /**
   *  A user-readable name for this channel, e.g: `"Red"`. */
  readonly name?: string;

  /**
   *  The color that should be associated within this channel when displaying
   *  this channel in a UI, e.g: `#FF0000`. May be any color value supported by
   *  CSS, e.g. name, hex, rgba, etc.. */
  readonly color?: string;

  /**
   *  A URL of an image that can be used to display this channel. */
  readonly glyph?: string;
}
```

A desktop agent (typically for _system_ channels) may want to provide additional information about how a channel can be represented in a UI. A common use case is for color linking.

#### See also

* [`Channel`](Channel)
* [`DesktopAgent.getUserChannels`](DesktopAgent#getuserchannels)

## `Icon`

```typescript
interface Icon {
  src: string;
  size?: string;
  type?: string;
}
```

Metadata relating to a single icon image at a remote URL, used to represent an application in a user interface.

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

The dimensions of the Icon formatted as `<height>x<width>`.

#### `type`

The media type of the icon. If not provided the Desktop Agent may refer to the src file extension.

#### See also

* [`AppMetadata`](Metadata#appmetadata)

## `Image`

```typescript
interface Image {
  src: string;
  size?: string;
  type?: string;
  label?: string;
}
```

Metadata relating to a single image at a remote URL, used to represent screenshot images.

AppMetadata includes a screenshots property allowing multiple images to be specified. Various properties may be used by the Desktop Agent to decide which image(s) are the most suitable to be used considering the application chooser UI, device DPI and formats supported by the system.

#### Example

```js
"screenshots": [
  {
    "src": "https://app.foo.icon/app_screenshots/dashboard.png",
    "size": "800x600",
    "type": "image/png",
    "label": "Example app dashboard"
  },
  {
    "src": "https://app.foo.icon/app_screenshots/notifications.png",
    "size": "800x600",
    "type": "image/png",
    "label": "Order notifications view"
  }
]
```

#### Properties

#### `src`

The fully qualified url to the image.

#### `size`

The dimensions of the image formatted as `<height>x<width>`.

#### `type`

The media type of the image. If not provided the Desktop Agent may refer to the src file extension.

#### See also

* [`AppMetadata`](Metadata#appmetadata)

## `ImplementationMetadata`

```ts
interface ImplementationMetadata {
  /** The version number of the FDC3 specification that the implementation
   *  provides. The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  readonly fdc3Version: string;

  /** The name of the provider of the FDC3 Desktop Agent Implementation
   *  (e.g.Finsemble, Glue42, OpenFin etc.).
   */
  readonly provider: string;

  /** The version of the provider of the FDC3 Desktop Agent Implementation
   *  (e.g. 5.3.0).
   */
  readonly providerVersion?: string;

  /** Metadata indicating whether the Desktop Agent implements optional features of
   *  the Desktop Agent API.
   */
  readonly optionalFeatures: {
    /** Used to indicate whether the exposure of 'origninating app metadata' for
     *  context and intent messages is supported by the Desktop Agent.*/
    "OriginatingAppMetadata": boolean;
    /** Used to indicate whether the optional `fdc3.joinUserChannel`,
     *  `fdc3.getCurrentChannel` and `fdc3.leaveCurrentChannel` are implemented by
     *  the Desktop Agent.*/
    "UserChannelMembershipAPIs": boolean;
  };

  /** The calling application instance's own metadata, according to the 
   *  Desktop Agent (MUST include at least the `appId` and `instanceId`).
   */
  readonly appMetadata: AppMetadata;
}
```

Metadata relating to the FDC3 [DesktopAgent](DesktopAgent) object and its provider, including the supported version of the FDC3 specification, the name of the provider of the implementation, its own version number and the metadata of the calling application according to the desktop agent.

#### See also

* [`AppMetadata`](#appmetadata)
* [`DesktopAgent.getInfo`](DesktopAgent#getinfo)

## `IntentMetadata`

```ts
interface IntentMetadata {
  /** The unique name of the intent that can be invoked by the raiseIntent call. */
  readonly name: string;

  /** A friendly display name for the intent that should be used to render UI
   *  elements.
   */
  readonly displayName: string;
}
```

The interface used to describe an intent within the platform.

#### See also

* [`AppIntent.intent`](#appintent)

## `IntentResolution`

```ts
interface IntentResolution {

  /** Identifier for the app instance that was selected (or started) to resolve
   *  the intent. `source.instanceId` MUST be set, indicating the specific app 
   *  instance that received the intent.
   */
  readonly source: AppIdentifier;

  /** The intent that was raised. May be used to determine which intent the user
   *  chose in response to `fdc3.raiseIntentForContext()`.
   */
  readonly intent: string;

  /** The version number of the Intents schema being used.
   */
  readonly version?: string;
  
  /** Retrieves a promise that will resolve to either `Context` data returned 
   *  by the application that resolves the raised intent or a `Channel` 
   *  established and returned by the app resolving the intent. 
   * 
   *  A `Channel` returned MAY be of the `PrivateChannel` type. The 
   *  client can then `addContextListener()` on that channel to, for example, 
   *  receive a stream of data.
   * 
   *  If an error occurs (i.e. an error is thrown by the handler function,
   *  the promise it returns is rejected, or the promise resolved to an invalid 
   *  type) then the Desktop Agent MUST reject the promise returned by the 
   *  `getResult()` function of the `IntentResolution` with a string from
   *  the `ResultError` enumeration.
   */
   getResult(): Promise<IntentResult>;
}
```

IntentResolution provides a standard format for data returned upon resolving an intent.

#### Examples

```js
// Resolve a "Chain" type intent
let resolution = await agent.raiseIntent("intentName", context);

// Use metadata about the resolving app instance to target a further intent
try {
  const resolution = await fdc3.raiseIntent('StageOrder', context);
  ...

  //Some time later
  await agent.raiseIntent("UpdateOrder", context, resolution.source);
}
catch (err) { ... }                                    
                                               
//Resolve a "Client-Service" type intent with a data or channel response
let resolution = await agent.raiseIntent("intentName", context);
try {
    const result = await resolution.getResult();
    if (result && result.broadcast) { //detect whether the result is Context or a Channel
        console.log(`${resolution.source} returned a channel with id ${result.id}`);
    } else if (result){
        console.log(`${resolution.source} returned data: ${JSON.stringify(result)}`);
    } else {
        console.error(`${resolution.source} didn't return anything`);
    }
} catch(error) {
    console.error(`${resolution.source} returned an error: ${error}`);
}
```

#### See also

* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`AppIdentifier`](Types#appidentifier)
