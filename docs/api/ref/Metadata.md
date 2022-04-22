---
title: Metadata
---

FDC3 API operations return various types of metadata.

## `AppIntent`

```ts
interface AppIntent {
  readonly intent: IntentMetadata;
  readonly apps: Array<AppMetadata>;
}
```
An interface that represents the binding of an intent to apps, returned as part of intent disocvery.
For each intent, it reference the applications that support that intent.

### See also
* [`AppMetadata`]#appmetadata)
* [`IntentMetadata`](#intentmetadata)
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

  /** A longer, multi-paragraph description for the application that could include mark-up */
  readonly description?: string;

  /** A list of icon URLs for the application that can be used to render UI elements */
  readonly icons?: Array<Icon>;

  /** A list of image URLs for the application that can be used to render UI elements */
  readonly images?: Array<string>;
  
  /** The type of result returned for any intent specified during resolution. 
   * May express a particular context type (e.g. "fdc3.instrument"), channel 
   * (e.g. "channel") or a channel that will receive a specified type 
   * (e.g. "channel<fdc3.instrument>"). */
  readonly resultType?: string | null;
}
```

Describes an application, or instance of an application, using metadata that is usually  provided by an FDC3 App Directory that the desktop agent connects to.

Will always includes at least a `name` property, which can be used with [`open`](DesktopAgent#open) and [`raiseIntent`](DesktopAgent#raiseIntent). If the `instanceId` field is set then the `AppMetadata` object represents a specific instance of the application that may be addressed using that Id.

Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu. This includes a title, description, tooltip and icon and image URLs.

In situations where a desktop agent connects to multiple app directories or multiple versions of the same app exists in a single app directory, it may be necessary to specify `appId` or `version` to target applications that share the same name.

#### See also
* [`AppIntent.apps`](#appintent)
* [`Icon`](Types#icon)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)


## `DisplayMetadata`

```ts
interface DisplayMetadata {
  /**
   * A user-readable name for this channel, e.g: `"Red"`
   */
  readonly name?: string;
  /**
   * The color that should be associated within this channel when displaying this channel in a UI, e.g: `#FF0000`. May be any color value supported by CSS, e.g. name, hex, rgba, etc..
   */
  readonly color?: string;
  /**
   * A URL of an image that can be used to display this channel
   */
  readonly glyph?: string;
}
```

A desktop agent (typically for _system_ channels) may want to provide additional information about how a channel can be represented in a UI. A common use case is for color linking.

#### See also
* [`Channel`](Channel)
* [`DesktopAgent.getUserChannels`](DesktopAgent#getuserchannels)

## `ImplementationMetadata`

```ts
interface ImplementationMetadata {
  /** The version number of the FDC3 specification that the implementation provides.
   *  The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  readonly fdc3Version: string;
  /** The name of the provider of the FDC3 Desktop Agent Implementation (e.g. Finsemble, Glue42, OpenFin etc.). */
  readonly provider: string;
  /** The version of the provider of the FDC3 Desktop Agent Implementation (e.g. 5.3.0). */
  readonly providerVersion?: string;
}
```

Metadata relating to the FDC3 [DesktopAgent](DesktopAgent) object and its provider, including the supported version of the FDC3 specification and the name of the provider of the implementation.

### See also
* [`DesktopAgent.getInfo`](DesktopAgent#getinfo)

## `IntentMetadata`

```ts
interface IntentMetadata {
  /** The unique name of the intent that can be invoked by the raiseIntent call */
  readonly name: string;
  /** A friendly display name for the intent that should be used to render UI elements */
  readonly displayName: string;
}
```

The interface used to describe an intent within the platform.


### See also
* [`AppIntent.intent`](#appintent)

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
   * The version number of the Intents schema being used.
   */
  readonly version?: string;
  /**
   * Retrieves a promise that will resolve to either `Context` data returned 
   * by the application that resolves the raised intent or a `Channel` 
   * established and returned by the app resolving the intent. 
   * 
   * A `Channel` returned MAY be of the `PrivateChannel` type. The 
   * client can then `addContextListener()` on that channel to, for example, 
   * receive a stream of data.
   * 
   * If an error occurs (i.e. an error is thrown by the handler function,
   * the promise it returns is rejected, or a promise is not returned by the
   * handler function) then the Desktop Agent MUST reject the promise returned
   * by the `getResult()` function of the `IntentResolution` with a string from
   * the `ResultError` enumeration.
   */
   getResult(): Promise<IntentResult>;
}
```

IntentResolution provides a standard format for data returned upon resolving an intent.

#### Examples
```js
//resolve a "Chain" type intent
let resolution = await agent.raiseIntent("intentName", context);

// Use metadata about the resolving app instance to target a further intent
try {
  const resolution = await fdc3.raiseIntent('StageOrder', context);
  ...

  //some time later
  await agent.raiseIntent("UpdateOrder", context, resolution.source);
}
catch (err) { ... }                                    
                                               
//resolve a "Client-Service" type intent with a data or channel response
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

### See also
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`TargetApp`](Types#targetapp)
