# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

### Changed

### Deprecated

### Fixed
* Add unit tests to the fdc3-context package for validating context examples are valid schema.
* Revert schema of `fdc3.timeRange` context type back to use anyOf in place of oneOf for the `startTime` and `endTime` property combinations.  This will allow existence of one of either, or both, and pass schema validation.  When defined with oneOf, validation would fail due to multiple entries being valid and it could not identify which to apply. ([#1592](https://github.com/finos/FDC3/issues/1592))
* Revert schema of `fdc3.interaction` context type back to use anyOf in place of oneOf for the `interactionType` property.  Since it could be a string enum or a string, validation could not differentiate. ([#1598](https://github.com/finos/FDC3/issues/1598))
* Fix `fdc3.timeRange` context example to use correctly formatted dateTime. ([#1599](https://github.com/finos/FDC3/issues/1599))

## [FDC3 Standard 2.2](https://github.com/finos/FDC3/compare/v2.1..v2.2) - 2025-03-12

### Added

* Added clarification that `id` field values SHOULD always be strings to context schema definition (a restriction that can't easily be represented in the generated types). ([#1149](https://github.com/finos/FDC3/pull/1149))
* Added requirement that Standard versions SHOULD avoid the use unions in context and API definitions wherever possible as these can be hard to replicate and MUST avoid unions of primitive types as these can be impossible to replicate in other languages. ([#120](https://github.com/finos/FDC3/pull/1200))
* Added `addEventListener` to the `DesktopAgent` API to provide support for event listener for non-context and non-intent events, including a `userChannelChanged` event ([#1207](https://github.com/finos/FDC3/pull/1207))
* Added an `async` `addEventListener` function to the `PrivateChannel` API to replace the deprecated, synchronous `onAddContextListener`, `onUnsubscribe` and `onDisconnect` functions and to keep consistency with the DesktopAgent API. ([#1305](https://github.com/finos/FDC3/pull/1305))
* Added reference materials and supported platforms information for FDC3 in .NET via the [finos/fdc3-dotnet](https://github.com/finos/fdc3-dotnet) project. ([#1108](https://github.com/finos/FDC3/pull/1108))
* Specifications for getAgent() and Browser-Resident Desktop Agents. ([#1191](https://github.com/finos/FDC3/pull/1191))
* Specification for Preload Desktop Agents. This content was previously in the supported platforms section. It had been revised and amended to include recommended behavior related to the new validateAppIdentity() function. ([#1191](https://github.com/finos/FDC3/pull/1191))
* Typescript definitions for getAgent() and related types. ([#1191](https://github.com/finos/FDC3/pull/1191))
* Typescript definitions for Desktop Agent Communication Protocol (DACP). These constitute the internal "wire protocol" that the "@finos/fdc3" library uses to communicate with Browser-Resident DAs. ([#1191](https://github.com/finos/FDC3/pull/1191))
* Typescript definitions for Web Connection Protocol (WCP). These constitute the messages used to establish connectivity between "@finos/fdc3" and a Browser-Resident DA. ([#1191](https://github.com/finos/FDC3/pull/1191))
* Added support for broadcast actions to the `fdc3.action` context type, allowing an Action to represent the broadcast of a specified context to an app or user channel. ([#1368](https://github.com/finos/FDC3/pull/1368))
* Added utility functions `isStandardContextType(contextType: string)`, `isStandardIntent(intent: string)`,`getPossibleContextsForIntent(intent: StandardIntent)`. ([#1139](https://github.com/finos/FDC3/pull/1139))
* Added support for event listening outside of intent or context listnener. Added new function `addEventListener`, type `EventHandler`,  enum `FDC3EventType` and interfaces `FDC3Event` and `FDC3ChannelChangedEvent`. ([#1207](https://github.com/finos/FDC3/pull/1207))
* Added new `CreateOrUpdateProfile` intent. ([#1359](https://github.com/finos/FDC3/pull/1359))
* Added conformance tests into the FDC3 API documentation in the current version and back-ported into 2.0 and 2.1. Removed outdated 1.2 conformance tests (which are preserved in the older 2.0 and 2.1 versions). ([#1417](https://github.com/finos/FDC3/pull/1417)).
* Added conformance tests to documentation for features introduced in FDC3 2.2 (`fdc3.addEventListener`, `PrivateChannel.addEventListener` and `getAgent`). ([#1425](https://github.com/finos/FDC3/pull/1425))
* Added separate `fdc3-commonjs` module for compatibility with older projects that use CommonJS. ([#1452](https://github.com/finos/FDC3/pull/1452))
* Added testing policy to [Contributing](CONTRIBUTING) page to address ([810](https://github.com/finos/FDC3/issues/810))
* Added the ability to control logging to the JS console from getAgent() and the DesktopAgentProxy via arguments to getAgent(). ([#1495](https://github.com/finos/FDC3/pull/1495))
* Added the ability for a browser-based DesktopAgent to control the timeouts used in the DesktopAgentProxy when making calls to it, via properties in WCP3Handshake message. ([#1497](https://github.com/finos/FDC3/pull/1497))
* Added .NET docs for Events to API reference. ([#1441](https://github.com/finos/FDC3/pull/1441))
* Setup package publishing for mono-repo packages. ([#1520](https://github.com/finos/FDC3/pull/1520))
* Implementation PR for FDC3 for the Web ([#896](https://github.com/finos/FDC3/pull/896))
* Adjusted reference Desktop Agent implementation for FDC3 for Web to open a new app instance when raiseIntent is called with an appId but no instanceId ([#1556](https://github.com/finos/FDC3/pull/1556))

### Changed

* `window.fdc3` is now an optional property and may or may not be defined. Applications should now use `getAgent()` as the recommended way of retrieving a reference to the FDC3 API. ([#1386](https://github.com/finos/FDC3/pull/1386))
* `Listener.unsubscribe()` was made async (the return type was changed from `void` to `Promise<void>`) for consistency with the rest of the API. ([#1305](https://github.com/finos/FDC3/pull/1305))
* Added reference materials and supported platforms information for FDC3 in .NET via the [finos/fdc3-dotnet](https://github.com/finos/fdc3-dotnet) project. ([#1108](https://github.com/finos/FDC3/pull/1108))
* The supported platforms page in the FDC3 documentation was moved into the API section as the information it provides all relates to FDC3 Desktop Agent API implementations. ([#1108](https://github.com/finos/FDC3/pull/1108))
* FDC3 apps are now encouraged to instantiate their FDC3 interface (DesktopAgent) using the `getAgent()` function provided by the `@finos/fdc3` module. This will allow apps to interoperate in either traditional Preload DAs (i.e. Electron) as well as the new Browser-Resident DAs. ([#1191](https://github.com/finos/FDC3/pull/1191))
* `ContextType` and `Intent` (`string`) types were created for use in DesktopAgent API signatures - they are unions of standardized values and `string`, enabling autocomplete/IntelliSense in IDEs when working with the FDC3 API. ([#1139](https://github.com/finos/FDC3/pull/1139))
* SessionStorage use by `getAgent` was updated to scope the stored data by `window.name` and the app's `identityUrl`. ([#1442](https://github.com/finos/FDC3/pull/1442))
* FDC3 Workbench updated to use `getAgent()` rather than `fdc3Ready()`

### Deprecated

* Made `IntentMetadata.displayName` optional as it is deprecated. ([#1280](https://github.com/finos/FDC3/pull/1280))
* Deprecated `PrivateChannel`'s synchronous `onAddContextListener`, `onUnsubscribe` and `onDisconnect` functions in favour of an `async` `addEventListener` function consistent with the one added to `DesktopAgent` in #1207. ([#1305](https://github.com/finos/FDC3/pull/1305))
* The `ContextTypes` and `Intents` enums were deprecated in favour of the new ContextType and Intent unions. ([#1139](https://github.com/finos/FDC3/pull/1139))

### Fixed

* Spin off fileAttachment into its own schema, and correct related examples ([1255](https://github.com/finos/FDC3/issues/1255))
* Added missing `desktopAgent` field to ImplementationMetadata objects returned for all agents connect to a DesktopAgent bridge in Connection Step 6 connectAgentsUpdate messages and refined the schema used to collect this info in step 3 handshake. ([#1177](https://github.com/finos/FDC3/pull/1177))
* Removed the `version` field from `IntentResolution` as there are no version fields for intents in the FDC3 API definitions and hence the field has no purpose. ([#1170](https://github.com/finos/FDC3/pull/1170))
* Fixed error in the Client-side example from `PrivateChannel` and `addIntentListener` by correcting `id.symbol` to `id.ticker` to align with the `fdc3.instrument` context. ([#1314](https://github.com/finos/FDC3/pull/1314))
* Added missing `resultType` argument to `findIntent` agent request in the Bridging Schema. ([#1154](https://github.com/finos/FDC3/pull/1154))
* Added missing `resultType` argument to `findIntentByContext` agent request in the Bridging Schema. ([#1212](https://github.com/finos/FDC3/pull/1212)) 
* Added missing id and name fields from the context base schema to respective context schemas (`Contact`, `ContactList`, `Country`, `InstrumentList`, `OrderList`, `Organization`, `Portfolio`, `Position`, `TradeList`). ([#1360](https://github.com/finos/FDC3/pull/1360))
* Revised FDC3 charter to include well-known language from the FDC3 introduction, better describe FDC3's scope, focus on financial applications, update application types, etc. ([#1079](https://github.com/finos/FDC3/pull/1079))
* Ensured that `PrivateChannelEvent` extends `ApiEvent` in both sourcecode and documentation. ([#1474](https://github.com/finos/FDC3/pull/1474))
* Standardized prettier config for fdc3-workbench with other packages. ([#1520](https://github.com/finos/FDC3/pull/1520))
* Ensured that user channel changes made by the DA without a call to joinUserChannel (i.e. those driven by an external channel selector) are applied by the Desktop Agent Proxy. ([#1541](https://github.com/finos/FDC3/pull/1541))
* Ensured that the FDC3 Workbench and apps like it that are migrated to getAgent will still work with FDC3 1.2 Preload-based DAs by not requiring appMetadata properties to be present in getInfo() responses. ([#1550](https://github.com/finos/FDC3/pull/1550))
* Bound all DesktopAgentProxy functions to enable destructuring. ([#1550](https://github.com/finos/FDC3/pull/1550))
* Fixed polyfill of node.js JS modules in fdc3-workbench. ([#1550](https://github.com/finos/FDC3/pull/1550))

## [npm v2.1.1] - 2024-06-28

### Fixed

* Corrected inconsistent camel-casing of the `fdc3.timeRange` context type which appeared as `fdc3.timerange` in a number of places. ([#1240](https://github.com/finos/FDC3/pull/1240))
* Corrected an error in the `fdc3.TransactionResult` schema which resulted in the `message` property being omitted from the generated TypeScript types for it. ([#1251](https://github.com/finos/FDC3/pull/1251))

## [FDC3 Standard 2.1](https://github.com/finos/FDC3/compare/v2.0..v2.1) - 2023-09-13

### Added

* Added `CreateInteraction` intent. To be used when a user wants to record an interaction into a system.  New context `Interaction` also introduced. An interaction might be a call, IM, email, a meeting (physical or virtual) or the preparation of some specialist data. ([#747](https://github.com/finos/FDC3/pull/747))
* Added `TransactionResult` context. A context type representing the result of a transaction initiated via FDC3. Its purpose is to provide a status and message (where needed) for the transaction and MAY wrap a returned context object. ([#761] (https://github.com/finos/FDC3/pull/761))
* Added a `MalformedContext` error to the `OpenError`, `ChannelError` and `ResolveError` enumerations, to be used when `broadcast`, `open`, `findIntents`, `raiseIntents`, and other related functions are passed an invalid context Object. ([#972](https://github.com/finos/FDC3/pull/972))
* Added error examples to the /v2 App Directory API routes ([#973](https://github.com/finos/FDC3/pull/973))
* Added a `SendChatMessage` intent to be used when a user wants to send a message to an existing chat room. ([#794](https://github.com/finos/FDC3/pull/794))
* Added a context type representing a chat message (`fdc3.chat.message`). ([#794](https://github.com/finos/FDC3/pull/794))
* Added a context type representing a chat room (`fdc3.chat.room`). ([#794](https://github.com/finos/FDC3/pull/794))
* Added a chat `Message` type in order to describe messages with rich content and attachments. ([#779](https://github.com/finos/FDC3/pull/779))
* Added an `Action` type, encapsulating either a `Context` or the association of a `Context` with an `Intent` inside another object.  ([#779](https://github.com/finos/FDC3/pull/779))
* Added a `ViewChat` Intent to be used when a user wants to open an existing chat room. ([#796](https://github.com/finos/FDC3/pull/796))
* Added a `ViewMessages` intent to be used when a user wants to search and see a list of messages. ([#797](https://github.com/finos/FDC3/pull/797))
* Added a context type representing a ChatSearchCriteria (`fdc3.chat.searchCriteria`). ([#797](https://github.com/finos/FDC3/pull/797))
* Added an indication that applications, that can be launched to receive intents or context via a raised intent or open with context, SHOULD add their context or intent listeners via the API within 15 seconds, and that Desktop Agents MUST allow at least a 15 second timeout for them to do so, and MAY set a longer timeout  ([#987](https://github.com/finos/FDC3/pull/987))
* Added [@experimental](https://fdc3.finos.org/docs/fdc3-compliance#experimental-features) `Order`, `OrderList`, `Product`, `Trade` & `TradeList` context types. ([#1021](https://github.com/finos/FDC3/pull/1021))
* Added Agent Bridging as an [@experimental](https://fdc3.finos.org/docs/fdc3-compliance#experimental-features) 5th part of the FDC3 Standard. ([#968](https://github.com/finos/FDC3/pull/968))
* Added a description of the standards use of JSON Schema to define context types and Bridging messages. ([#1020](https://github.com/finos/FDC3/pull/1020))
* Documentation for standardized Context types was added to their JSON Schema files and TypeScript interfaces generated from them, so that they may act as a 'single source of truth' for Context definitions. ([#1020](https://github.com/finos/FDC3/pull/1020))

### Changed

* Updated definition of the `ChatInitSettings` context type to use the new `Message` type.  ([#779](https://github.com/finos/FDC3/pull/779))
* Updated the `StartChat` intent to return a reference to the room. ([#794](https://github.com/finos/FDC3/pull/794))
* Updated definition of the `Instrument` context type to include optional market identifiers ([#819](https://github.com/finos/FDC3/pull/819))
* Corrected API functions and object types to always use `string` instead of `String` ([#924](https://github.com/finos/FDC3/pull/924))
* Updated definition of the `otherConfig` element of the `Chart` context type from an Object to an array of Contexts as this allows the `type` of each additional item of config to be examined before it is used ([#985](https://github.com/finos/FDC3/pull/985))
* Corrected the appD `interop.appChannels` metadata to use an `id` field to identify channels, rather than `name` ([#981](https://github.com/finos/FDC3/pull/981))
* The App Directory OpenAPI schema was converted from YAML to JSON Schema, containing the same definitions. ([#1035](https://github.com/finos/FDC3/pull/1035))
* Switched to union types (from enums) for constrained string values in generated source files as they provide better type checking and cross-compatibility of types. ([#1093](https://github.com/finos/FDC3/pull/1093))

### Deprecated

* Deprecated the `name` field in AppD records, to match the deprecation of API signatures and metadata objects using `name` (see [#722](https://github.com/finos/FDC3/pull/722)) in 2.0. ([#928](https://github.com/finos/FDC3/pull/928))
* Deprecated `IntentMetadata.displayName` and the appD record's `interop.intents.listensFor[].displayName` field in favor of using intent names for display (which are required to be recognizable) as it can be set differently for each application in the appD ([#926](https://github.com/finos/FDC3/pull/926))
* Deprecated the `customConfig` field in an AppD record due to the lack of a standard API to retrieve it. To be replaced with an `applicationConfig` element with a Desktop Agent API call to retrieve it in a future version (see [#1006](https://github.com/finos/FDC3/issues/1006) for more details). Also deprecates the `customCOnfig` element of an Intent configuration due to a lack of documented use cases. ([#982](https://github.com/finos/FDC3/pull/982))

### Fixed

* Removed the union type for the `ChatMessage` context, which caused issues for languages not having union types. This is a breaking change (made before the final version of 2.1 is released).
* Corrected chatInitSettings context schema to incorporate the Context schema. ([#869](https://github.com/finos/FDC3/pull/869))
* Corrected schema syntax in chatInitSettings and renamed the `public` property to `isPublic` (as `public` is a reserved keyword in javascript). ([#875](https://github.com/finos/FDC3/pull/875))
* Further clarified the difference between the behavior of User channels and other channel types on joinUserChannel/addContextListener. ([#971](https://github.com/finos/FDC3/pull/971))
* Clarified description of the behavior of `IntentResolution.getResult()` when the intent handler returned void (which is not an error). ([#1004](https://github.com/finos/FDC3/pull/1004))
* An error was fixed in the appD schema where launch details sub-schemas were combined with `oneOf`, rather than `anyOf`. This causes validation errors for web or online native apps as their details elements overlap on a `url` field. ([#1034](https://github.com/finos/FDC3/pull/1034))
* The appD `icon` and `screenshot` sub-schemas were updated to require the `src` value is set and restrict additional values, ensuring that common mistakes (such as using a `url` rather than `src` field are caught by the schemas when used to validate). ([#1037](https://github.com/finos/FDC3/pull/1037))
* Linting, spell checking other corrections were applied to markdown syntax throughout the FDC3 documentation ([#1032](https://github.com/finos/FDC3/pull/1032))
* Corrected bad example URLs in the App Directory overview/discovery page in the current and past versions as they did not agree with the paths provided in the API specification and OpenAPI schema.  ([#1060](https://github.com/finos/FDC3/pull/1060))

## [npm v2.0.3] - 2023-05-31

### Changed

* Applied missing `readonly` tags to `ImplementationMetadata.optionalFeatures` sub-properties. ([#1008](https://github.com/finos/FDC3/pull/1008))

## [npm v2.0.2] - 2023-05-24

### Changed

* Removed source files from the NPM module as they are not necessary, increase the bundle size and include POM files that lack license info, causing issues for enterprise onboarding. ([#999](https://github.com/finos/FDC3/pull/999))

## [FDC3 Standard 2.0](https://github.com/finos/FDC3/compare/v1.2..v2.0) - 2022-07-01

### Added

* Definition of the `icons` property of `AppMetadata`, based on PWA icon spec ([#319](https://github.com/finos/FDC3/pull/319))
* Added support for raiseIntent without a context via the addition of the `fdc3.nothing` context type ([#375](https://github.com/finos/FDC3/pull/375))
* Added [**FDC3 Workbench**](https://fdc3.finos.org/toolbox/fdc3-workbench/), an FDC3 API developer application ([#457](https://github.com/finos/FDC3/pull/457))
* Added advice on how to `broadcast` complex context types, composed of other types, so that other apps can listen for both the complex type and simpler constituent types ([#464](https://github.com/finos/FDC3/pull/464))
* Added the ability to return data from an intent, via the addition of an IntentHandler type and a `getResult()` to IntentResolution, both of which return a Promise of a Context object. ([#495](https://github.com/finos/FDC3/pull/495))
* Added a field to specify the Context type that intent can return to the AppD Application schema and extended the findIntent API calls to be able to use it for resolution. ([#499](https://github.com/finos/FDC3/pull/499))
* Added the ability to return a Channel from an intent (via the `IntentResult` type), resolver support for intents that return Channels and the concept of PrivateChannels. ([#508](https://github.com/finos/FDC3/pull/508))
* Added error `UserCancelled` to the `ResolveError` enumeration to be used when user closes the resolver UI or otherwise cancels resolution of a raised intent ([#522](https://github.com/finos/FDC3/pull/522))
* Added `IntentDeliveryFailed` to the `ResolveError` enumeration to be used when delivery of an intent and context to a targeted app or instance fails. ([#601](https://github.com/finos/FDC3/pull/601))
* Added an `instanceId` (and optional `instanceMetadata`) field to `AppMetadata` allowing it to refer to specific app instances and thereby supporting targeting of intents to specific app instances. Also added a `findInstances()` function to the desktop agent and `TargetAppUnavailable` and `TargetInstanceUnavailable` Errors to the `ResolveError` enumeration. ([#509](https://github.com/finos/FDC3/pull/509))
* Added a References and Bibliography section to the Standard's documentation to hold links to 'normative references' and other documentation that is useful for understanding the standard ([#530](https://github.com/finos/FDC3/pull/530))
* Added a Trademarks page to website to acknowledge trademarks used within the Standard not owned by FINOS or the Linux Foundation ([#534](https://github.com/finos/FDC3/pull/534))
* Added details of FDC3's existing versioning and deprecation policies to the FDC3 compliance page ([#539](https://github.com/finos/FDC3/pull/539))
* Added a new experimental features policy, which exempts features designated as experimental from the versioning and deprecation policies, to the FDC3 compliance page ([#549](https://github.com/finos/FDC3/pull/549))
* Added a recommended set of user channel definitions to the API docs and typescript sources ([#727](https://github.com/finos/FDC3/pull/727))
* Added the optional exposure of originating app metadata to messages received via `addContextListener` and `addIntentListener` via the new `ContextMetadata` type. ([#725](https://github.com/finos/FDC3/pull/725))
* Added the current app's `AppMetadata` to the `ImplementationMetadata` returned by `fdc3.getInfo()` allowing an app to retrieve its own metadata, according to the Desktop Agent ([#726](https://github.com/finos/FDC3/pull/726))
* Added a context type representing a range of time (`fdc3.timeRange`). ([#706](https://github.com/finos/FDC3/pull/706))
* Added a context type representing a Currency (`fdc3.currency`). ([#708](https://github.com/finos/FDC3/pull/708))
* Added a context type representing the price and value of a holding (`fdc3.valuation`). ([#709](https://github.com/finos/FDC3/pull/709))
* Added a context type representing a Chart (`fdc3.chart`). ([#715](https://github.com/finos/FDC3/pull/715))
* Added a context type `ChatInitSettings` to initialize a chat creation with new optional parameters ([#620](https://github.com/finos/FDC3/pull/620))
* Added guide on how to submit a new Intent. ([#624](https://github.com/finos/FDC3/pull/624))
* Added a `ViewResearch` Intent to be used when a user wants to see the latest research on a particular stock ([#623](https://github.com/finos/FDC3/pull/623))
* Added a `ViewProfile` intent, which supersedes the `ViewContact` intent which is deprecated. ([#619](https://github.com/finos/FDC3/pull/619))
* Added a `ViewInteractions` intent to be used when a user wants to see the latest interactions (calls, meetings, conferences, roadshows) on a particular stock or with an individual or organization. ([#625](https://github.com/finos/FDC3/pull/625))
* Added a `ViewOrders` intent to be used when a user wants to see the order history of an individual, an institution or of a particular instrument. ([#672](https://github.com/finos/FDC3/pull/672))
* Added a `StartEmail` intent and `fdc3.email` context type to be used to initiate an email with a contact or list of contacts provided as part of the context. ([#632](https://github.com/finos/FDC3/pull/632))
* Added a definition for "app directory record" to the FDC3 glossary to be used to refer to a single appD record ([#658](https://github.com/finos/FDC3/pull/658))
* Added `/v2/` paths to the AppD's specification, allowing a single implementation to support serving both FDC3 v1.2 and v2.0 application records, enabling simpler migration ([#666](https://github.com/finos/FDC3/pull/666))
* Added a `moreInfo` URL field to AppD application records to enable linking to a web page with more information on an app ([#669](https://github.com/finos/FDC3/pull/669))
* Added `lang` field to AppD application records to specify the primary language of an app and its appD record. ([#670](https://github.com/finos/FDC3/pull/670))
* Added `localizedVersions` field to AppD application records to support localized versions of descriptive fields in the app records and alternative launch details for localized versions of the applications themselves. ([#670](https://github.com/finos/FDC3/pull/670))
* Added `type` and `details` elements to AppD application records to support vendor-agnostic launch details for both web and native apps ([#671](https://github.com/finos/FDC3/pull/671))
* Added `categories` field and recommended categories list to AppD application records to enable category based browsing of AppDs ([#673](https://github.com/finos/FDC3/pull/673))
* Added an `interop` field to AppD application records, replacing the `intents` field, to more fully describe an app's use of FDC3 and enable search for apps that 'interoperate' with a selected app ([#697](https://github.com/finos/FDC3/pull/697))
* Added `AppIdentifier` type, which is a new parent of `AppMetadata` and clarifies required fields for API call parameters which now prefer `appId` and `instanceId` over `name` ([#722](https://github.com/finos/FDC3/pull/722))
* Added a `getAppMetadata()` function to the desktop agent that can be used to retrieve the full `AppMetadata` for an `AppIdentifier` and reduced types such as `IntentResolution.source` and `ContextMetadata.source` from `AppMetadata` to `AppIdentifier` to clarify what fields a developer can rely on and that they should manually retrieve the full `AppMetadata` when they need it for display purposes. ([#751](https://github.com/finos/FDC3/pull/751))

### Changed

* Consolidated `Listener` documentation with other types ([#404](https://github.com/finos/FDC3/pull/404))
* Updated definition of the `Position` context type to support negative (short) positions ([#419](https://github.com/finos/FDC3/pull/419))
* Upgraded web access statements from SHOULD to MUST in the API specification ([#440](https://github.com/finos/FDC3/pull/440))
* Updated copyright notices ([#467](https://github.com/finos/FDC3/pull/467))
* Adjusted wording in API spec and documentation to acknowledge the possibility of methods of intent resolution other than a resolver UI ([#461](https://github.com/finos/FDC3/pull/461))
* Replaced 'System channels' with 'User channels' throughout the spec, documentation, API and methods.ts. Clarified spec and documentation where it is referring to User channels vs. App channels. Added support to methods.ts for automatic fallback to `getSystemChannels` if `getUserChannels` doesn't exist. ([#470](https://github.com/finos/FDC3/pull/479))
* Moved the Icon type definition into the Types documentation page for consistency with other types. ([#493](https://github.com/finos/FDC3/pull/493)
* The `fdc3.joinChannel()`, `fdc3.getCurrentChannel()` and `fdc3.leaveCurrentChannel()` functions have been made optional for FDC3 API compliance, but are recommended through the application of the SHOULD keyword. ([#512](https://github.com/finos/FDC3/pull/512))
* All DesktopAgent and Channel API functions are now async for consistency, changing the return type of the `broadcast`, `addIntentListener`, `addContextListener` and `getInfo` functions ([#516](https://github.com/finos/FDC3/pull/516))
* `IntentResolution` now requires the name of the intent raised to included, allowing it to be used to determine the intent raised via `fdc3.raiseIntentForContext()`. ([#507](https://github.com/finos/FDC3/pull/507))
* The App Directory record schema (Application) has had the `manifestType` and `manifest` properties removed and replaced with the new `type` (required), `details` and `hostManifests` properties ([#437](https://github.com/finos/FDC3/pull/437))
* App Directory `images` field was replaced with `screenshots` to better align the application record with web application manifest and match its format to that used by `icons` ([#675](https://github.com/finos/FDC3/pull/675))
* API `AppMetadata` type was updated to replace the `images` field with a `screenshots` field (an array of `Image` objects) matching the spec of the App Directory's `screenshots` field entries ([#736](https://github.com/finos/FDC3/pull/736))
* App Directory endpoint for creating applications was removed as these will often be implementation dependent and should not be required for compliance ([#695](https://github.com/finos/FDC3/pull/695))
* App Directory endpoint for searching applications was removed as searches over multiple app directories are better implemented by retrieving all the records and searching over the resulting combined dataset ([#696](https://github.com/finos/FDC3/pull/696))
* Extended Intent Naming conventions and added hyperlinks for existing Intent spec definitions ([#701](https://github.com/finos/FDC3/pull/701))
* Extended recommended field type conventions for contexts to include types for ids, times, dates, currency codes and country codes. The `fdc3.country` context type was updated to comply with the recommended field name for country codes (`COUNTRY_ISOALPHA2`). ([#704](https://github.com/finos/FDC3/pull/704))
* The `intents` field of an AppD application records has been replaced with the `interop` field, to more fully describe an app's use of FDC3 and enable search for apps that 'interoperate' with a selected app ([#697](https://github.com/finos/FDC3/pull/697))

### Deprecated

* Deprecated the `ViewContact` intent, which is superseded by `ViewProfile` ([#619](https://github.com/finos/FDC3/pull/619))
* Removed details of the 'global' channel that was deprecated in FDC3 1.2. ([#496](https://github.com/finos/FDC3/pull/496))
* `open`, `raiseIntent` and `raiseIntentForContext` function signatures that make use of the app `name` have been deprecated in favour of using `AppIdentifier` (which is a new parent of `AppMetadata` that clarifies required fields for API call parameters) ([#722](https://github.com/finos/FDC3/pull/722))

### Fixed

* Removed trailing slashes from schema references (which break refs for schema parsers) ([#374](https://github.com/finos/FDC3/pull/374))
* Corrected the definition of the `Context` type in documentation ([#406](https://github.com/finos/FDC3/pull/406)])
* Corrected syntax errors in context schema examples ([#424](https://github.com/finos/FDC3/pull/424))
* Corrected a minor error in the ViewQuote Intent example ([#439](https://github.com/finos/FDC3/pull/439))
* Clarified behavior of `fdc3.addContextListener` when not joined to a channel ([#449](https://github.com/finos/FDC3/pull/449))
* Clarified existing behavior of `joinChannel` and `addContextListener` when joining a channel ([#454](https://github.com/finos/FDC3/pull/454))
* Clarified numerous aspects of the existing `raiseIntent` behavior in the spec and documentation ([#461](https://github.com/finos/FDC3/pull/461))
* Updated Methods.ts to support the updated signature for `addContextListener` introduced in FDC3 1.2 ([#462](https://github.com/finos/FDC3/pull/462))
* Clarified the description of the addContextListener functions from the Desktop Agent and Channel APIs in spec and docs. ([#492](https://github.com/finos/FDC3/pull/492))
* Clarified that implementing `fdc3.getInfo()` is required for compliance with the FDC3 standard ([#515](https://github.com/finos/FDC3/pull/515))
* Corrected syntax errors in valuation schema ([#834](https://github.com/finos/FDC3/pull/834))
* Clarified that API errors are promises rejected with a JavaScript (or language appropriate) Error Object with a message chosen from the error enumerations. ([#843](https://github.com/finos/FDC3/pull/843))
* Clarified that `findIntent` functions should return the `ResolveError.NoAppsFound` error, rather than an `AppIntent` with an empty `apps` array when no apps are fund during intent resolution. ([#843](https://github.com/finos/FDC3/pull/843))
* Clarified spec requirements for registration of intent handlers (SHOULD support `interop.intents.listensFor` in an appD record, may support other routes including dynamic registration at runtime) ([#844](https://github.com/finos/FDC3/pull/844))
* Corrected schema definition for appD `interop.intents.listensFor` element ([#847](https://github.com/finos/FDC3/pull/847))

## [npm v1.2.0] - 2021-04-19

### Added

* ES6 functions for `getInfo()` and `raiseIntentForContext()` ([#268](https://github.com/finos/FDC3/pull/268), [#324](https://github.com/finos/FDC3/pull/324))
* `fdc3Ready()` utility function that wraps checks for the window.fdc3 global object and new `fdc3Ready` event ([#360](https://github.com/finos/FDC3/pull/360))
* `compareVersionNumbers()` and `versionIsAtLeast()` utility functions to complement `getInfo()` ([#324](https://github.com/finos/FDC3/pull/324))
* An example application definition ([#437](https://github.com/finos/FDC3/pull/437)
* A test environment for the app directory specification and the example application definition ([#437](https://github.com/finos/FDC3/pull/437)

### Changed

* `addContextListener(contextType, handler)` now supports passing `null` as the context type ([#329](https://github.com/finos/FDC3/pull/329))
* All other API type changes and additions from the [FDC3 Standard 1.2](https://github.com/finos/FDC3/releases/tag/v1.2) release

### Deprecated

* `addContextListener(handler)` ([#329](https://github.com/finos/FDC3/pull/329))
* `IntentResolution.data` ([#341](https://github.com/finos/FDC3/pull/341))

## [FDC3 Standard 1.2] - 2021-04-19

### Added

* New `raiseIntentForContext()` method ([#268](https://github.com/finos/FDC3/pull/268))
* New `fdc3Ready` event ([#269](https://github.com/finos/FDC3/pull/269))
* New `getInfo()` method that returns implementation metadata ([#324](https://github.com/finos/FDC3/pull/324))

### Changed

* `fdc3.open()` and `fdc3.raiseIntent()` now takes `TargetApp`, which resolves to `string | AppMetadata` ([#272](https://github.com/finos/FDC3/pull/272))
* `AppMetadata` return type can now optionally include `appId` and `version` ([#273](https://github.com/finos/FDC3/pull/273))
* `addContextListener(contextType, handler)` now supports passing `null` as the context type ([#329](https://github.com/finos/FDC3/pull/329))
* Simplify API reference documentation and add info about supported platforms, including npm package ([#349](https://github.com/finos/FDC3/pull/349))

### Deprecated

* `addContextListener(handler)` ([#329](https://github.com/finos/FDC3/pull/329))
* `IntentResolution.data` and `'global'` channel concept ([#341](https://github.com/finos/FDC3/pull/341))

### Fixed

* Return type of `getCurrentChannel()` should be `Promise<Channel | null>` ([#282](https://github.com/finos/FDC3/pull/282))
* `leaveCurrentChannel()` is missing from `DesktopAgent` interface ([#283](https://github.com/finos/FDC3/pull/283))

## [npm v1.1.1] - 2021-04-15

### Fixed

* `Intents` enum should contain `StartChat` not `StartChart` ([#364](https://github.com/finos/FDC3/pull/364))
* Return type of `getCurrentChannel()` should be `Promise<Channel | null>` ([#282](https://github.com/finos/FDC3/pull/282))
* Missing `leaveCurrentChannel()` export ([#283](https://github.com/finos/FDC3/pull/283))

## [npm v1.1.0] - 2021-04-14

### Added

* Build an npm package with exported TypeScript typings for API, Context Data and `window.fdc3` global ([#252](https://github.com/finos/FDC3/pull/252))
* Export helper enums for names of standardized `Intents` and `ContextTypes` ([#264](https://github.com/finos/FDC3/pull/264))
* Export API operations as ES6 functions that can be directly imported ([#266](https://github.com/finos/FDC3/pull/266))
* Check for the existence of `window.fdc3` in ES6 functions, and reject or throw if not defined ([#356](https://github.com/finos/FDC3/pull/356))

### Fixed

* Return type of `getCurrentChannel()` should be `Promise<Channel>` ([#222](https://github.com/finos/FDC3/pull/222))

## [FDC3 Standard 1.1] - 2020-04-09

### Added

* JSON Schema definitions for agreed context types ([#119](https://github.com/finos/FDC3/pull/119)):
  * `fdc3.context`
  * `fdc3.instrument`
  * `fdc3.instrumentList`
  * `fdc3.contact`
  * `fdc3.contactList`
  * `fdc3.organization`
  * `fdc3.country`
  * `fdc3.position`
  * `fdc3.portfolio`
* API entry point for web - `window.fdc3` ([#139](https://github.com/finos/FDC3/pull/139))
* Use Case 17 ([#153](https://github.com/finos/FDC3/pull/153))
* Channels API ([#154](https://github.com/finos/FDC3/pull/154)):
  * `fdc3.getSystemChannels`
  * `fdc3.getOrCreateChannel`
  * `fdc3.joinChannel`
  * `fdc3.leaveCurrentChannel`
  * `fdc3.getCurrentChannel`
  * `Channel` interface
  * `DisplayMetadata` interface
  * `ChannelError` type
* Type filtering support for `getCurrentContext` ([#161](https://github.com/finos/FDC3/pull/161))
* Publish versioned JSON schemas to FDC3 website ([#170](https://github.com/finos/FDC3/pull/170))
* Intent Reference and Context Data Reference documentation ([#172](https://github.com/finos/FDC3/pull/172))

### Changed

* Remove FactSet-specific examples from docs ([#88](https://github.com/finos/FDC3/pull/88))
* Apply FINOS branding, styles and logos to the website ([#96](https://github.com/finos/FDC3/pull/96))
* Include ChartIQ in "Who is using FDC3?" section on website ([#100](https://github.com/finos/FDC3/pull/100))
* Expand `AppMetadata` interface with more application properties ([#157](https://github.com/finos/FDC3/pull/157))
* Restructure some docs ([#190](https://github.com/finos/FDC3/pull/190))

### Fixed

* Several typos and broken links in docs
* Various security vulnerabilities

## [FDC3 Standard 1.0] - 2019-03-28

### Added

* Documentation website (generated with [Docusaurus]) and content from old separate FDC3 repos ([#5](https://github.com/finos/FDC3/pull/5)):
  * [FDC3/API](https://github.com/FDC3/API)
  * [FDC3/ContextData](https://github.com/FDC3/ContextData)
  * [FDC3/Intents](https://github.com/FDC3/Intents)
  * [FDC3/appd-api](https://github.com/FDC3/appd-api)
  * [FDC3/use-cases](https://github.com/FDC3/use-cases)
* Use Case 15 ([#49](https://github.com/finos/FDC3/pull/49))
* FDC3 Roadmap ([#55](https://github.com/finos/FDC3/pull/55))
* FDC3 feature icons on website landing page ([#57](https://github.com/finos/FDC3/pull/57))
* Participant showcase on website landing page ([#67](https://github.com/finos/FDC3/pull/67))

[Docusaurus]: https://docusaurus.io

### Changed

* General cleanup of spelling, grammar and punctuation ([#34](https://github.com/finos/FDC3/pull/34))
* Use cases call-out on website landing page ([#54](https://github.com/finos/FDC3/pull/54))
* Proofreading of docs ([#62](https://github.com/finos/FDC3/pull/62))

### Fixed

* Remove unnecessary dates from use case file names ([#41](https://github.com/finos/FDC3/pull/41))
* Header coloring on responsive website ([#56](https://github.com/finos/FDC3/pull/56))
* Workflow numbers in Use Case 1 ([#60](https://github.com/finos/FDC3/pull/60))
* Examples in Intent Overview ([#65](https://github.com/finos/FDC3/pull/65))
* Errors in DesktopAgent API Reference ([#66](https://github.com/finos/FDC3/pull/66))

[Unreleased]: https://github.com/finos/FDC3/compare/v1.2..HEAD
[npm v1.2.0]: https://github.com/finos/FDC3/compare/v1.1.0..v1.2.0
[FDC3 Standard 1.2]: https://github.com/finos/FDC3/compare/v1.2..v1.1
[npm v1.1.1]: https://github.com/finos/FDC3/compare/v1.1.0..v1.1.1
[npm v1.1.0]: https://github.com/finos/FDC3/compare/v1.1..v1.1.0
[FDC3 Standard 1.1]: https://github.com/finos/FDC3/compare/v1.1..v1.0
[FDC3 Standard 1.0]: https://github.com/finos/FDC3/v1.0
