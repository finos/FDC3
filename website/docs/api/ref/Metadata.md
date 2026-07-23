---
title: Metadata
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

FDC3 API operations return various types of metadata.

## `AppIntent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

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

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IAppIntent
{
  /// <summary>
  /// Details of the intent whose relationship to resolving application is
  /// being described.
  /// </summary>
  IIntentMetadata Intent { get; }

  /// <summary>
  /// Details of applications that can resolve the intent.
  /// </summary>
  IEnumerable<IAppMetadata> Apps { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type AppIntent struct {
  // Details of the intent whose relationship to resolving applications is being described.
  Intent IntentMetadata `json:"intent"`

  // Details of applications that can resolve the intent.
  Apps   []AppMetadata  `json:"apps"`
}
```

</TabItem>
</Tabs>

An interface that represents the binding of an intent to apps, returned as part of intent discovery.
For each intent, it reference the applications that support that intent.

**See also:**

- [`AppMetadata`](#appmetadata)
- [`IntentMetadata`](#intentmetadata)
- [`DesktopAgent.findIntent`](DesktopAgent#findintent)
- [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)

## `AppMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

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

  /** An optional set of metadata fields that can be used to disambiguate
   *  instances, such as a window title or screen position. May be updated by the
   *  instance itself via `fdc3.updateInstanceMetadata()`. Must only be set if
   *  `instanceId` is set.
   */
  readonly instanceMetadata?: InstanceMetadata;

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

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IAppMetadata : IAppIdentifier
{
    /// <summary>
    /// The unique app name that can be used with the open and raiseIntent calls.
    /// </summary>
    string? Name { get; }

    /// <summary>
    /// The Version of the application.
    /// </summary>
    string? Version { get; }

    /// <summary>
    /// A more user-friendly application title that can be used to render UI elements.
    /// </summary>
    string? Title { get; }

    /// <summary>
    /// A tooltip for the application that can be used to render UI elements.
    /// </summary>
    string? Tooltip { get; }

    /// <summary>
    /// A longer, multi-paragraph description for the application that could include markup.
    /// </summary>
    string? Description { get; }

    /// <summary>
    /// A list of icon URLs for the application that can be used to render UI elements.
    /// </summary>
    IEnumerable<IIcon> Icons { get; }

    /// <summary>
    /// A list of image URLs for the application that can be used to render UI elements.
    /// </summary>
    IEnumerable<IImage> Screenshots { get; }

    /// <summary>
    /// The type of output returned for any intent specified during resolution. May express a particular context type,
    /// channel, or channel with specified type
    /// </summary>
    string? ResultType { get; }

    /// <summary>
    /// An optional set of metadata fields that can be used to disambiguate instances, such as a window title or screen
    /// position. May be updated by the instance itself via UpdateInstanceMetadata. Must only be set if InstanceId is set.
    /// </summary>
    IInstanceMetadata? InstanceMetadata { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type AppMetadata struct {
  AppIdentifier
  // The unique app name that can be used with the open and raiseIntent calls.
  Name             string                 `json:"name"`
  // The Version of the application.
  Version          string                 `json:"version"`
  // A more user-friendly application title that can be used to render UI elements.
  Title            string                 `json:"title"`
  // A tooltip for the application that can be used to render UI elements.
  Tooltip          string                 `json:"tooltip"`
  // A longer, multi-paragraph description for the application that could include markup.
  Description      string                 `json:"description"`
  // A list of icon URLs for the application that can be used to render UI elements.
  Icons            []app_dir.Icon         `json:"icons"`
  // A list of image URLs for the application that can be used to render UI elements.
  Screenshots      []app_dir.Screenshot   `json:"screenshots"`
  // The type of output returned for any intent specified during resolution. May express a particular context type,
  // channel, or channel with specified type
  ResultType       string                 `json:"resultType"`
  // An optional set of metadata fields that can be used to disambiguate
  // instances, such as a window title or screen position. May be updated by the
  // instance itself via UpdateInstanceMetadata. Must only be set if `instanceId`
  // is set.
  InstanceMetadata *InstanceMetadata      `json:"instanceMetadata"`
}
```

</TabItem>
</Tabs>

Extends an AppIdentifier, describing an application or instance of an application, with additional descriptive metadata that is usually provided by an FDC3 App Directory that the desktop agent connects to.

The additional information from an app directory can aid in rendering UI elements, such as a launcher menu or resolver UI. This includes a title, description, tooltip and icon and screenshot URLs.

Note that as `AppMetadata` instances are also `AppIdentifiers` they may be passed to the `app` argument of `fdc3.open`, `fdc3.raiseIntent` etc..

**See also:**

- [`AppIdentifier`](Types#appidentifier)
- [`AppIntent.apps`](#appintent)
- [`Icon`](#icon)
- [`Image`](#image)
- [`DesktopAgent.open`](DesktopAgent#open)
- [`DesktopAgent.findIntent`](DesktopAgent#findintent)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)

## `InstanceMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface InstanceMetadata {
  /** A user-friendly title for this specific instance that can be used to
   *  render UI elements, such as a resolver or intent picker, to help
   *  distinguish it from other instances of the same application. For example,
   *  an app displaying a stock chart might set this to the name of the
   *  instrument being displayed.
   */
  readonly title?: string;

  /** Additional, implementation-specific, custom metadata fields that can be
   *  used to further disambiguate instances, such as screen position or
   *  workspace assignment.
   */
  readonly [key: string]: any;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IInstanceMetadata
{
    /// <summary>
    /// A user-friendly title for this specific instance that can be used to render UI elements, such as a resolver or
    /// intent picker, to help distinguish it from other instances of the same application.
    /// </summary>
    string? Title { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type InstanceMetadata struct {
  // A user-friendly title for this specific instance that can be used to render UI elements, such as a resolver or
  // intent picker, to help distinguish it from other instances of the same application.
  Title  string                 `json:"title"`
  // Additional, implementation-specific, custom metadata fields that can be used to further disambiguate instances.
  Custom map[string]interface{} `json:"-"`
}
```

</TabItem>
</Tabs>

Metadata that describes a specific instance of an application, which can be used to disambiguate instances in UI elements such as a resolver or intent picker.

An application MAY update its own instance metadata via [`fdc3.updateInstanceMetadata()`](DesktopAgent#updateinstancemetadata), allowing Desktop Agents to display meaningful, instance-specific information (e.g. the name of the contact or instrument currently being viewed). It is returned in the `instanceMetadata` field of an [`AppMetadata`](#appmetadata) object and MUST only be set if `instanceId` is also set.

In addition to the standardized `title` field, `InstanceMetadata` MAY include additional implementation-specific fields.

**See also:**

- [`AppMetadata`](#appmetadata)
- [`DesktopAgent.updateInstanceMetadata`](DesktopAgent#updateinstancemetadata)
- [`DesktopAgent.getAppMetadata`](DesktopAgent#getappmetadata)
- [`DesktopAgent.findInstances`](DesktopAgent#findinstances)

## `ContextMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface ContextMetadata {
  /** Identifier for the app instance that sent the context and/or intent. */
  readonly source: AppIdentifier;

  /** The timestamp when the context was broadcast or the intent was raised. */
  readonly timestamp: Date;

  /** A unique identifier for tracing the flow of context or intent messages
   *  across applications. If a traceId is provided by the app, the Desktop
   *  Agent SHOULD forward it. If no traceId is provided, the Desktop Agent
   *  SHOULD generate a new one. */
  readonly traceId: string;

  /** A detached JSON Web Signature (JWS) proving the authenticity and integrity
   *  of the context, forwarded from the originating app's AppProvidableContextMetadata.
   *  See [Security & Identity](../security) for details. */
  readonly signature?: DetachedSignature;

  /** Anti-replay claims (`iat`, `exp`, `jti`) forwarded from the originating app.
   *  Used alongside `signature` to prevent replay attacks.
   *  MUST be present when `signature` is set.
   *  See [Security & Identity](../security) for details. */
  readonly antiReplay?: AntiReplayClaims;

  /** Custom metadata provided by the originating app. */
  readonly custom?: Record<string, any>;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IContextMetadata
{
    IAppIdentifier? Source { get; }
    DateTime? Timestamp { get; }
    string? TraceId { get; }
    IDetachedSignature? Signature { get; }
    IAntiReplayClaims? AntiReplay { get; }
    IDictionary<string, object>? Custom { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type ContextMetadata struct {
  Source     AppIdentifier          `json:"source"`
  Timestamp  time.Time              `json:"timestamp"`
  TraceId    string                 `json:"traceId"`
  Signature  *DetachedSignature     `json:"signature,omitempty"`
  AntiReplay *AntiReplayClaims      `json:"antiReplay,omitempty"`
  Custom     map[string]interface{} `json:"custom,omitempty"`
}
```

</TabItem>
</Tabs>

Metadata relating to a context or intent received through the `addContextListener` and `addIntentListener` functions. Includes delivery information provided by the Desktop Agent (`source`, `timestamp`, `traceId`) and optional metadata forwarded from the originating app (`signature`, `antiReplay`, `traceId`, `custom`).

Note that `signature` and `antiReplay` are transmitted metadata fields — forwarded by the Desktop Agent unchanged from the sender's `AppProvidableContextMetadata`. The result of _verifying_ a signature is not a metadata field; it is returned by the receiving application's security implementation as a [`ContextVerificationMetadata`](#contextverificationmetadata) object.

**See also:**

- [`AppProvidableContextMetadata`](#appprovidablecontextmetadata)
- [`AppMetadata`](#appmetadata)
- [`ContextHandler`](Types#contexthandler)
- [`IntentHandler`](Types#intenthandler)
- [`addIntentListener`](DesktopAgent#addintentlistener)
- [`addContextListener`](DesktopAgent#addcontextlistener)
- [`Channel.addContextListener`](Channel#addcontextlistener)

## `AppProvidableContextMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface AppProvidableContextMetadata {
  /** A unique identifier for tracing the flow of context or intent messages
   *  across applications. If provided, the Desktop Agent SHOULD forward it. */
  traceId?: string;

  /** A detached JSON Web Signature (JWS) proving the authenticity and integrity
   *  of the context. The signature is computed over the canonicalized context
   *  object and the `antiReplay` claims. MUST be accompanied by `antiReplay`.
   *  See [Security & Identity](../security) for details. */
  signature?: DetachedSignature;

  /** Anti-replay claims (`iat`, `exp`, `jti`) used alongside `signature` to
   *  prevent a signed message from being replayed by an attacker.
   *  MUST be included when `signature` is present.
   *  See [Security & Identity](../security) for details. */
  antiReplay?: AntiReplayClaims;

  /** Custom metadata. Allows use of metadata fields that have yet to be
   *  standardized. */
  custom?: Record<string, any>;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IAppProvidableContextMetadata
{
    string? TraceId { get; set; }
    string? Signature { get; set; }
    IDictionary<string, object>? Custom { get; set; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type AppProvidableContextMetadata struct {
  TraceId   string                 `json:"traceId,omitempty"`
  Signature string                 `json:"signature,omitempty"`
  Custom    map[string]interface{} `json:"custom,omitempty"`
}
```

</TabItem>
</Tabs>

Metadata that may be provided by an app when calling `broadcast`, `open`, `raiseIntent` or `raiseIntentForContext`. The Desktop Agent MUST forward any provided fields to the receiving app's handler via `ContextMetadata`, while always overriding `source` and `timestamp` with its own values.

The `signature` and `antiReplay` fields support the [Security & Identity](../security) features. `DetachedSignature` and `AntiReplayClaims` are defined in the FDC3 schema — see the [Security & Identity](../security) documentation for full details on generating and verifying signatures.

**See also:**

- [`ContextMetadata`](#contextmetadata)
- [`DesktopAgent.broadcast`](DesktopAgent#broadcast)
- [`DesktopAgent.open`](DesktopAgent#open)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)

## `DetachedSignature`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface DetachedSignature {
  /** The BASE64URL-encoded JWS protected header. When decoded, contains
   *  fields including: `alg` (signature algorithm), `jku` (JWKS URL for
   *  key verification), and `kid` (key identifier). */
  readonly protected: string;

  /** The BASE64URL-encoded digital signature computed over the protected
   *  header and the canonicalized context payload (detached). */
  readonly signature: string;
}
```

</TabItem>
</Tabs>

A Detached JSON Web Signature (JWS) used to prove the authenticity and integrity of a signed context object. The signature is computed over the canonicalized JSON of `{ context, antiReplay }` using the signing application's private key, and can be verified using the public key retrieved from the JWKS URL in the protected header. See [Security & Identity](../security) for the full signing and verification flow.

**See also:**

- [`AppProvidableContextMetadata`](#appprovidablecontextmetadata)
- [`AntiReplayClaims`](#antireplayclaims)
- [Security & Identity](../security)

## `AntiReplayClaims`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface AntiReplayClaims {
  /** Issued-at time as a Unix timestamp (seconds since epoch). */
  readonly iat: number;

  /** Expiration time as a Unix timestamp (seconds since epoch). */
  readonly exp: number;

  /** Unique identifier for this signed context instance (UUID). */
  readonly jti: string;
}
```

</TabItem>
</Tabs>

Anti-replay claims that MUST accompany a `DetachedSignature` to prevent a captured signed message from being resubmitted by an attacker. The `jti` is a unique token ID that receiving applications MUST record and reject if seen again within the `exp` window. Note that timestamps use Unix epoch seconds (NumericDate per [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)), not the ISO 8601 format used elsewhere in FDC3.

**See also:**

- [`DetachedSignature`](#detachedsignature)
- [`AppProvidableContextMetadata`](#appprovidablecontextmetadata)
- [Security & Identity](../security)

## `ContextVerificationMetadata`

:::note
`ContextVerificationMetadata` is defined in the `@finos/fdc3-security` package, not `@finos/fdc3-standard`. It is documented here for reference alongside the wire-type metadata interfaces it relates to.
:::

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
// import { ContextVerificationMetadata } from '@finos/fdc3-security';

interface ContextVerificationMetadata {
  /** The result of signature verification for this context. */
  authenticity?: {
    /** True if a `signature` field was present in the received metadata. */
    signed: boolean;
    /** True if the JWS cryptographically verified against the signed bytes. */
    valid?: boolean;
    /** True if the signing key's JWKS URL was in the application's allowlist. */
    trusted?: boolean;
    /** The JWKS URL from the JWS protected header, identifying the signer. */
    jku?: string;
    /** The key identifier from the JWS protected header. */
    kid?: string;
    /** The signature algorithm from the JWS protected header. */
    alg?: string;
    /** Human-readable diagnostics from the verification attempt. */
    errors?: string[];
  };

  /** The result of attempting to decrypt a `fdc3.security.encryptedContext`
   *  payload. Only relevant when the received context type is
   *  `fdc3.security.encryptedContext`. */
  encryption?: 'decrypted' | 'cant_decrypt' | 'not_encrypted';
}
```

</TabItem>
</Tabs>

The result of processing received `ContextMetadata` through a security verification function. This is **not** a transmitted metadata field and is never sent over the wire by the Desktop Agent. It is produced locally by the receiving application's security implementation after verifying the `signature` and `antiReplay` fields present in the received `ContextMetadata`. See [Security & Identity](../security) for the full verification flow.

**See also:**

- [`ContextMetadata`](#contextmetadata)
- [`DetachedSignature`](#detachedsignature)
- [`AntiReplayClaims`](#antireplayclaims)
- [Security & Identity](../security)

## `DisplayMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

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

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IDisplayMetadata
{
    /// <summary>
    /// A user-readable name for this channel, e.g: Red.
    /// </summary>
    string? Name { get; }

    /// <summary>
    /// The color that should be associated within this channel when displaying this
    /// channein in a UI, e.g: '0xFF0000'.
    /// </summary>
    string? Color { get; }

    /// <summary>
    /// A URL of an image that can be used to display this channel.
    /// </summary>
    string? Glyph { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type DisplayMetadata struct {
  // A user-readable name for this channel, e.g: Red.
  Name  string `json:"name"`
  // The color that should be associated within this channel when displaying
  // this channel in a UI, e.g: `#FF0000`. May be any color value supported by
  //  CSS, e.g. name, hex, rgba, etc..
  Color string `json:"color"`
  // A URL of an image that can be used to display this channel.
  Glyph string `json:"glyph"`
}
```

</TabItem>
</Tabs>

A desktop agent (typically for _system_ channels) may want to provide additional information about how a channel can be represented in a UI. A common use case is for color linking.

**See also:**

- [`Channel`](Channel)
- [`DesktopAgent.getUserChannels`](DesktopAgent#getuserchannels)

## `Icon`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface Icon {
  src: string;
  size?: string;
  type?: string;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IIcon
{
    /// <summary>
    /// The icon url
    /// </summary>
    string Src { get; }
    
    /// <summary>
    /// The icon dimensions, formatted as '{height}x{width}'
    /// </summary>
    string? Size { get; }
    
    /// <summary>
    /// Icon media type. If not present, the Desktop Agent may use the src file extension.
    /// </summary>
    string? Type { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type Icon struct {
  // The icon url
  Src string  `json:"src"`
  // The icon dimensions, formatted as '{height}x{width}'
  Size string  `json:"size"`
  // Icon media type. If not present, the Desktop Agent may use the src file extension.
  Type string  `json:"type"`
}
```

</TabItem>
</Tabs>

Metadata relating to a single icon image at a remote URL, used to represent an application in a user interface.

AppMetadata includes an icons property allowing multiple icon types to be specified. Various properties may be used by the Desktop Agent to decide which icon is the most suitable to be used considering the application chooser UI, device DPI and formats supported by the system.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
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

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
IIcon? icon = appMetadata?.Icons.Where(icon => icon.Size == "48x48").First();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
icons := []Icon{
      {
        Src: "https://app.foo.icon/app_icons/lowres.webp",
        Size: "48x48",
        Type: "image/webp",
      },
      {
        Src: "https://app.foo.icon/app_icons/hd_hi.svg",
        Size: "72x72",
        Type: "image/svg+xml",
      },
    }
```

</TabItem>
</Tabs>

**Properties:**

- **`src`:** The fully qualified url to the icon.
- **`size`:** The dimensions of the Icon formatted as `<height>x<width>`.
- **`type`:** The media type of the icon. If not provided the Desktop Agent may refer to the src file extension.

**See also:**

- [`AppMetadata`](Metadata#appmetadata)

## `Image`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface Image {
  src: string;
  size?: string;
  type?: string;
  label?: string;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IImage
{
    /// <summary>
    /// The icon url
    /// </summary>
    string Src { get; }
    
    /// <summary>
    /// The icon dimensions, formatted as '{height}x{width}'
    /// </summary>
    string? Size { get; }
    
    /// <summary>
    /// Icon media type.  If not present, the Desktop Agent may use the src file extension.
    /// </summary>
    string? Type { get; }


    /// <summary>
    /// Caption for the image
    /// </summary>
    string? Label { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type Image struct {
  // The icon url
  Src string `json:"src"`
	// The icon dimensions, formatted as '{height}x{width}'
  Size string `json:"size"`
  // Icon media type.  If not present, the Desktop Agent may use the src file extension.
  Type string `json:"type"`
  // Caption for the image
  Label string `json:"label"`
}
```

</TabItem>
</Tabs>

Metadata relating to a single image at a remote URL, used to represent screenshot images.

AppMetadata includes a screenshots property allowing multiple images to be specified. Various properties may be used by the Desktop Agent to decide which image(s) are the most suitable to be used considering the application chooser UI, device DPI and formats supported by the system.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
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

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
foreach (IImage image in appMetadata.Screenshots)
{
    System.Diagnostics.Debug.WriteLine(image.Src);
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
icons := []Image{
      {
        Src: "https://app.foo.icon/app_screenshots/dashboard.png",
        Size: "800x600",
        Type: "image/png",
        Label: "Example app dashboard",
      },
      {
        Src: "https://app.foo.icon/app_screenshots/notifications.png",
        Size: "800x600",
        Type: "image/png",
        Label: "Order notifications view",
      },
    }
```

</TabItem>
</Tabs>

**Properties:**

- **`src`:** The fully qualified url to the image.
- **`size`:** The dimensions of the image formatted as `<height>x<width>`.
- **`type`:** The media type of the image. If not provided the Desktop Agent may refer to the src file extension.

**See also:**

- [`AppMetadata`](Metadata#appmetadata)

## `ImplementationMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface ImplementationMetadata {
  /** The version number of the FDC3 specification that the implementation
   *  provides. The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  readonly fdc3Version: string;

  /** The name of the provider of the FDC3 Desktop Agent Implementation
   *  (e.g. io.Connect, OpenFin etc.).
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
    /** Used to indicate whether the optional `fdc3.joinUserChannel`,
     *  `fdc3.getCurrentChannel` and `fdc3.leaveCurrentChannel` are implemented by
     *  the Desktop Agent.*/
    readonly UserChannelMembershipAPIs: boolean;
    /** Used to indicate whether the experimental Desktop Agent Bridging
     *  feature is implemented by the Desktop Agent.*/
    readonly DesktopAgentBridging: boolean;
  };

  /** The calling application instance's own metadata, according to the 
   *  Desktop Agent (MUST include at least the `appId` and `instanceId`).
   */
  readonly appMetadata: AppMetadata;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IImplementationMetadata
{
    /// <summary>
    ///  The version number of the FDC3 specification that the implementation provides.
    ///  The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
    /// </summary>
    string Fdc3Version { get; }

    /// <summary>
    /// The name of the provider of the FDC3 Desktop Agent Implementation (e.g. Finsemble, Glue42, OpenFin etc.).
    /// </summary>
    string Provider { get; }

    /// <summary>
    /// The version of the provider of the FDC3 Desktop Agent Implementation (e.g. 5.3.0).
    /// </summary>
    string ProviderVersion { get; }

    /// <summary>
    /// Metadata indicating whether the Desktop Agent implements optional features of the Desktop Agent API.
    /// </summary>
    OptionalDesktopAgentFeatures OptionalFeatures { get; }

    /// <summary>
    /// The calling application instance's own metadata according to the Desktop Agent
    /// </summary>
    IAppMetadata AppMetadata { get; }
}

class OptionalDesktopAgentFeatures
{
    /// <summary>
    /// Used to indicate whether the optional 'JoinUserChannel', 'GetCurrentChannel', and 'LeaveCurrentChannel'
    /// are implemented by the Desktop Agent.
    /// </summary>
    public bool UserChannelMembershipAPIs { get; set; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type ImplementationMetadata struct {
  //  The version number of the FDC3 specification that the implementation provides.
  //  The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
  Fdc3Version      string `json:"fdc3Version"`
  // The name of the provider of the FDC3 Desktop Agent Implementation (e.g. Finsemble, Glue42, OpenFin etc.).
  Provider         string `json:"provider"`
  // The version of the provider of the FDC3 Desktop Agent Implementation (e.g. 5.3.0).
  ProviderVersion  string `json:"providerVersion"`
  // Metadata indicating whether the Desktop Agent implements optional features of the Desktop Agent API.
  OptionalFeatures struct {
    // Used to indicate whether the optional 'JoinUserChannel', 'GetCurrentChannel', and 'LeaveCurrentChannel'
    // are implemented by the Desktop Agent.
    UserChannelMembershipAPIs bool `json:"UserChannelMembershipAPIs"`
	} `json:"optionalFeatures"`
  // The calling application instance's own metadata according to the Desktop Agent
  AppMetadata AppMetadata `json:"appMetadata"`
}
```

</TabItem>
</Tabs>

Metadata relating to the FDC3 [DesktopAgent](DesktopAgent) object and its provider, including the supported version of the FDC3 specification, the name of the provider of the implementation, its own version number and the metadata of the calling application according to the desktop agent.

**See also:**

- [`AppMetadata`](#appmetadata)
- [`DesktopAgent.getInfo`](DesktopAgent#getinfo)

## `IntentMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface IntentMetadata {
  /** The unique name of the intent that can be invoked by the raiseIntent call. */
  readonly name: string;

  /** Display name for the intent.
   * @deprecated Since FDC3 2.1. Use the intent name for display as display name may vary for
   * each application as it is defined in the app's AppD record.
   */
  readonly displayName?: string;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IIntentMetadata
{
    /// <summary>
    /// The unique name of the intent that can be invoked by the raiseIntent call.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// A friendly display name for the intent that should be used to render UI elements.
    /// </summary>
    string DisplayName { get; }
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type IntentMetadata struct {
  // The unique name of the intent that can be invoked by the raiseIntent call.
  Name        string `json:"name"`
  
  // A friendly display name for the intent that should be used to render UI elements.
  DisplayName string `json:"displayName"`
}

```

</TabItem>
</Tabs>

The interface used to describe an intent within the platform.

**See also:**

- [`AppIntent.intent`](#appintent)

## `IntentResolution`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

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
  
  /** Retrieves a promise that will resolve to `Context` data returned 
   *  by the application that resolves the raised intent, a `Channel` 
   *  established and returned by the app resolving the intent or void. 
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

  /** Retrieves a promise that will resolve to `ContextMetadata` for the intent
   *  result. The metadata is always generated by the Desktop Agent and includes
   *  `source`, `timestamp` and `traceId` fields. When the intent handler returns
   *  a `ContextWithMetadata` result, any app-provided metadata fields
   *  (`traceId`, `signature`, `antiReplay`, `custom`) are merged with the Desktop Agent
   *  generated fields, with the Desktop Agent's `traceId` taking precedence.
   *
   *  For `Channel` or `void` results, only Desktop Agent generated metadata
   *  is returned.
   */
  getResultMetadata(): Promise<ContextMetadata>;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IIntentResolution
{
    /// <summary>
    /// The application that resolved the intent.
    /// </summary>
    IAppIdentifier Source { get; }

    /// <summary>
    /// The intent that was raised.
    /// </summary>
    string Intent { get; }

    /// <summary>
    /// The version number of the Intents schema being used.
    /// </summary>
    string? Version { get; }

    Task<IIntentResult> GetResult();
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
type IntentResolution struct {
  // The application that resolved the intent.
  Source  AppIdentifier `json:"source"`
  // The intent that was raised.
  Intent  string        `json:"intent"`
  // The version number of the Intents schema being used.
  Version string        `json:"version"`
}

type IntentResult any

func (ir *IntentResolution) GetResult() <-chan Result[IntentResult] {
  // implementation here
}

// getResultMetadata retrieves the ContextMetadata for the intent result.
func (resolution *IntentResolution) GetResultMetadata() <-chan Result[ContextMetadata] {
  // Implementation here
}
```

</TabItem>
</Tabs>

IntentResolution provides a standard format for data returned upon resolving an intent.

**Examples:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
// Resolve a "Chain" type intent
let resolution = await agent.raiseIntent("intentName", context);

// Use metadata about the resolving app instance to target a further intent
try {
  const resolution = await fdc3.raiseIntent('StageOrder', context);
  ...

  //Some time later
  await agent.raiseIntent("UpdateOrder", context, resolution.source);
}
catch (err: ResolveError) { ... }                                    
                                               
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
} catch(error: ResultError) {
    console.error(`${resolution.source} returned an error: ${error}`);
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var resolution = await _desktopAgent.RaiseIntent("QuoteStream", new Instrument(new InstrumentID() { Ticker = "AAPL" }));
try
{
    var result = await resolution.GetResult();

    //check that we got a result and that it's a channel
    if (result is IChannel channel)
    {
        var listener = await channel.AddContextListener<IContext>("price", (quote, metadata) => System.Diagnostics.Debug.WriteLine(quote));

        //if it's a PrivateChannel
        if (channel is IPrivateChannel privateChannel)
        {
            privateChannel.OnDisconnect(() => {
                System.Diagnostics.Debug.WriteLine("Quote feed went down");
            });

            // Sometime later...
            listener.Unsubscribe();
        }
    }
    else
    {
        System.Diagnostics.Debug.WriteLine($" {resolution.Source} did not return a channel");
    }
}
catch (Exception ex)
{
    // Handle exception
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
resolutionResult := <-desktopAgent.RaiseIntent("QuoteStream", context, nil)
if resolutionResult.Err != nil {
  // handle error 
}
if channel, ok := resolutionResult.Value.(Channel); ok {
    log.Println("The result is a channel")
} else if context, ok := resolutionResult.Value.(Context); ok {
    log.Println("The result is a context")
} else {
  log.Error("The result is of incorrect data type!")
}
```

</TabItem>
</Tabs>

IntentResolution provides a standard format for data returned upon resolving an intent.

### `getResult`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getResult(): Promise<IntentResult>;
```

</TabItem>
</Tabs>

Retrieves a promise that will resolve to `Context` data returned by the application that resolves the raised intent, a `Channel` established and returned by the app resolving the intent, or `void`. A `Channel` returned MAY be of the `PrivateChannel` type.

If an error occurs (i.e. an error is thrown by the handler function, the promise it returns is rejected, or the promise resolved to an invalid type) then the Desktop Agent MUST reject the promise returned by `getResult()` with a string from the `ResultError` enumeration.

### `getResultMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getResultMetadata(): Promise<ContextMetadata>;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (resolution *IntentResolution) GetResultMetadata() <-chan Result[ContextMetadata]
```

</TabItem>
</Tabs>

Retrieves a promise that will resolve to [`ContextMetadata`](#contextmetadata) for the intent result. The metadata is always generated by the Desktop Agent and includes `source`, `timestamp` and `traceId` fields.

When the intent handler returns a [`ContextWithMetadata`](Types#contextwithmetadata) result, any app-provided metadata fields (`traceId`, `signature`, `custom`) are merged with the Desktop Agent generated fields, with the Desktop Agent's `traceId` taking precedence.

For `Channel` or `void` results, only Desktop Agent generated metadata is returned.

**See also:**

- [`IntentResult`](Types#intentresult)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
- [`AppIdentifier`](Types#appidentifier)
