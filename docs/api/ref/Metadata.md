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
  /** The type of any Context data returned for any intent specified during resolution */
  readonly resultContext?: string | null;
}
```

App metadata is usually provided by the FDC3 App Directory that the desktop agent connects to.

It always includes at least a `name` property, which can be used with [`open`](DesktopAgent#open) and [`raiseIntent`](DesktopAgent#raiseIntent).

Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu. This includes a title, description, tooltip and icon and image URLs.

In situations where a desktop agent connects to multiple app directories or multiple versions of the same app exists in a single app directory, it may be neccessary to specify appId and version to target applications that share the same name.

#### See also
* [`AppIntent.apps`](AppIntent)
* [`Icon`](Icon)

## `DisplayMetadata`

```ts
interface DisplayMetadata {
  /**
   * A user-readable name for this channel, e.g: `"Red"`
   */
  readonly name?: string;
  /**
   * The color that should be associated within this channel when displaying this channel in a UI, e.g: `0xFF0000`.
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
* [`DesktopAgent.getSystemChannels`](DesktopAgent#getsystemchannels)

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

#### See also
* [`DesktopAgent.getInfo`](DesktopAgent#getInfo)

## `IntentMetadata`

```ts
interface IntentMetadata {
  /** The unique name of the intent that can be invoked by the raiseIntent call */
  readonly name: string;
  /** A friendly display name for the intent that should be used to render UI elements */
  readonly displayName: string;
}
```

The Interface used to describe an Intent within the platform.


#### See also
* [`AppIntent.intent`](AppIntent)

## `IntentResolution`

```ts
interface IntentResolution {
/**
   * The application that resolved the intent.
   */
  readonly source: TargetApp;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version?: string;
  /**
   * Retrieves a promise that will resolve to data returned by the
   * application that resolves the raised intent. The promise will 
   * reject if an error is thrown by the intent handler or the promise
   * returned by the intent handler is reject. If the intent handler 
   * does not return a promise this function will return null.
   */
  getResult(): Promise<Context> | null;
}
```

IntentResolution provides a standard format for data returned upon resolving an intent.

#### Examples
```js
//resolve a "Chain" type intent
let resolution = await agent.raiseIntent("intentName", context);

//resolve a "Client-Service" type intent with a data response
let resolution = await agent.raiseIntent("intentName", context);
try {
	  const result = await resolution.getResult();
    console.log(`${resolution.source} returned ${JSON.stringify(result)}`);
} catch(error) {
    console.error(`${resolution.source} returned an error: ${error}`);
}
```

#### See also
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`TargetApp`](TargetApp)
