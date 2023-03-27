# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
* Added `CreateInteraction` intent. To be used when a user wants to record an interaction into a system.  New context `Interaction` also introduced. An interaction might be a call, IM, email, a meeting (physical or virtual) or the preparation of some specialist data. ([#747](https://github.com/finos/FDC3/pull/747))
* Added `TransactionResult` context. A context type representing the result of a transaction initiated via FDC3. Its purpose is to provide a status and message (where needed) for the transaction and MAY wrap a returned context object. ([#761](https://github.com/finos/FDC3/pull/761))
* Added `Order` (`fdc3.order`) context type representing the details of an order, which may be used to transmit a new order to a third party or share details of an existing order. ([#824](https://github.com/finos/FDC3/pull/824))

* Added a `SendChatMessage` intent to be used when a user wants to send a message to an existing chat room. ([#794](https://github.com/finos/FDC3/pull/794))
* Added a context type representing a chat message (`fdc3.chat.message`). ([#794](https://github.com/finos/FDC3/pull/794))
* Added a context type representing a chat room (`fdc3.chat.room`). ([#794](https://github.com/finos/FDC3/pull/794))
* Added a chat `Message` type in order to describe messages with rich content and attachments. ([#779](https://github.com/finos/FDC3/pull/779))
* Added an `Action` type, encapsulating either a `Context` or the association of a `Context` with an `Intent` inside another object.  ([#779](https://github.com/finos/FDC3/pull/779))
* Added a `ViewChat` Intent to be used when a user wants to open an existing chat room. ([#796](https://github.com/finos/FDC3/pull/796))
* Added a `ViewMessages` intent to be used when a user wants to search and see a list of messages. ([#797](https://github.com/finos/FDC3/pull/797))
* Added a context type representing a ChatSearchCriteria (`fdc3.chat.searchCriteria`). ([#797](https://github.com/finos/FDC3/pull/797))

### Changed

* Updated definition of the `ChatInitSettings` context type to use the new `Message` type.  ([#779](https://github.com/finos/FDC3/pull/779))
* Updated definition of the `Instrument` context type to include optional market identifiers ([#819](https://github.com/finos/FDC3/pull/819))
* Updated the `StartChat` intent to return a reference to the room. ([#794](https://github.com/finos/FDC3/pull/794))

### Deprecated

### Fixed

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
* Added `IntentDeliveryFailed` to the `ResolveError` enumeration to be used when delivery of an intent and context to a targetted app or instance fails. ([#601](https://github.com/finos/FDC3/pull/601))
* Added an `instanceId` (and optional `instanceMetadata`) field to `AppMetadata` allowing it to refer to specific app instances and thereby supporting targetting of intents to specific app instances. Also added a `findInstances()` function to the desktop agent and `TargetAppUnavailable` and `TargetInstanceUnavailable` Errors to the `ResolveError` enumeration. ([#509](https://github.com/finos/FDC3/pull/509))
* Added a References and Bibliography section to the Standard's documentation to hold links to 'normative references' and other documentation that is useful for understanding the standard ([#530](https://github.com/finos/FDC3/pull/530))
* Added a Trademarks page to website to acknowledge trademarks used within the Standard not owned by FINOS or the Linux Foundation ([#534](https://github.com/finos/FDC3/pull/534))
* Added details of FDC3's existing versioning and deprecation policies to the FDC3 compliance page ([#539](https://github.com/finos/FDC3/pull/539))
* Added a new experimental features policy, which exempts features designated as experimental from the versioning and deprecation policies, to the FDC3 compliance page ([#549](https://github.com/finos/FDC3/pull/549))
* Added a recommended set of user channel definitions to the API docs and typescript sources ([#727](https://github.com/finos/FDC3/pull/727))
* Added the optional exposure of originating app metadata to messages received via `addContextListener` and `addIntentListener` via the new `ContextMetadata` type. ([#725](https://github.com/finos/FDC3/pull/725))
* Added the current app's `AppMetadata` to the `ImplementationMetadata` returned by `fdc3.getInfo()` allowing an app to retrieve its own metadata, according to the Desktop Agent ([#726](https://github.com/finos/FDC3/pull/726))
* Added a context type representing a range of time (`fdc3.timerange`). ([#706](https://github.com/finos/FDC3/pull/706))
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
* Added a `getAppMetdata()` function to the desktop agent that can be used to retrieve the full `AppMetadata` for an `AppIdentifier` and reduced types such as `IntentResolution.source` and `ContextMetadata.source` from `AppMetadata` to `AppIdentifier` to clarify what fields a developer can rely on and that they should manually retrieve the full `AppMetadata` when they need it for display purposes. ([#751](https://github.com/finos/FDC3/pull/751))

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
* Export helper enums for names of standardised `Intents` and `ContextTypes` ([#264](https://github.com/finos/FDC3/pull/264))
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
* Use cases callout on website landing page ([#54](https://github.com/finos/FDC3/pull/54))
* Proofreading of docs ([#62](https://github.com/finos/FDC3/pull/62))

### Fixed

* Remove unnecessary dates from use case file names ([#41](https://github.com/finos/FDC3/pull/41))
* Header colouring on responsive website ([#56](https://github.com/finos/FDC3/pull/56))
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
