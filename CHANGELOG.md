# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
* [API] New raiseIntentForContext method (#268)
* [API] Add fdc3Ready event to API specification (#269, #327)
* [API] Add optional appId and version properties to AppMetadata (#273)
* [API] Define new TargetApp type for use with open and raiseIntent (#279, #315)
* [API] New getInfo method with method data about implementation (#324)
* [Package] Build and publish an npm package for FDC3 (#252)
* [Package] Add enums for intents and context types (#264)
* [Package] Add ES6 module support to FDC3 API package (#266)

### Changed
* [API] Allow AppMetadata to be passed in as a target argument (#272)
* [API] Reject/throw as appropriate in ES6 exported methods if window.fdc3 is not available (#277)
* [API] API specification clarifications around intents/context and loops when broadcasting (#285, #307, 310)
* [Website] Add/update participant logos (#209, #225, #320)
* [Website] Update "Get Involved" with standards governance info (#228, #249, #300, #286)

### Fixed
* [API] Missing/wrong type signature for getCurrentChannel (#222)
* [API] Support nullable return type for getCurrentChannel (#282)
* [API] Implement missing leaveCurrentChannel method (#283)
* [Schemas] Correct invalid schema references (#224)
* [Docs] Fix raiseIntent examples (#211)
* [Docs] Fix Portfolio context data example (#251)

### Technical
* [Readme] Fix AppDirectory Readme (#274)
* [Readme] Update main Readme (#275, #318)
* [GitHub] Remove FINOS SVG from project root (#204)
* [GitHub] Switch builds from Travis to GitHub workflows (#239, #252, #253, #254)
* [GitHub] Meeting workflows and templates (#292, #293)
* [Security] Upgrade dependencies to address security vulnerabilities (#207, #226, #232, #235, #238, #258, #259, #260, #289, #290, #295, #297)

## [1.1] - 2020-04-09
### Added
* JSON Schema definitions for agreed context types ([#119](https://github.com/finos/FDC3/pull/119)):
    - `fdc3.context`
    - `fdc3.instrument`
    - `fdc3.instrumentList`
    - `fdc3.contact`
    - `fdc3.contactList`
    - `fdc3.organization`
    - `fdc3.country`
    - `fdc3.position`
    - `fdc3.portfolio`
* API entry point for web - `window.fdc3` ([#139](https://github.com/finos/FDC3/pull/139))
* Use Case 17 ([#153](https://github.com/finos/FDC3/pull/153))
* Channels API ([#154](https://github.com/finos/FDC3/pull/154)):
    - `fdc3.getSystemChannels`
    - `fdc3.getOrCreateChannel`
    - `fdc3.joinChannel`
    - `fdc3.leaveCurrentChannel`
    - `fdc3.getCurrentChannel`
    - `Channel` interface
    - `DisplayMetadata` interface
    - `ChannelError` type
* Type filtering support for `getCurrentContext` ([#161](https://github.com/finos/FDC3/pull/161))
* Publish versioned JSON schemas to FDC3 website ([#170](https://github.com/finos/FDC3/pull/170))

### Changed
* Expand `AppMetadata` interface with more application properties ([#157](https://github.com/finos/FDC3/pull/157))

### Fixed
* Upgrade dependencies to address security vulnerabilities

### Docs
* Remove FactSet-specific examples ([#88](https://github.com/finos/FDC3/pull/88))
* Add Intent Reference and Context Data Reference ([#172](https://github.com/finos/FDC3/pull/172))
* Restructure some docs ([#190](https://github.com/finos/FDC3/pull/190))
* Fix several typos and broken links

### Website
* Apply FINOS branding, styles and logos to the website ([#96](https://github.com/finos/FDC3/pull/96))
* Add ChartIQ to "Who is using FDC3?" section on website ([#100](https://github.com/finos/FDC3/pull/100))

## [1.0] - 2019-03-28
### Added
* Use Case 15 ([#49](https://github.com/finos/FDC3/pull/49))
* FDC3 Roadmap ([#55](https://github.com/finos/FDC3/pull/55))
* User showcase on website ([#67](https://github.com/finos/FDC3/pull/67))

### Changed
* Use case text on front page of website ([#54](https://github.com/finos/FDC3/pull/54))
* Feature icons on website ([#57](https://github.com/finos/FDC3/pull/57))

### Fixed
* General cleanup of spelling, grammar and punctuation ([#34](https://github.com/finos/FDC3/pull/34))
* Remove unnecessary dates from use case file names ([#41](https://github.com/finos/FDC3/pull/41))
* Fix header colouring on responsive website ([#56](https://github.com/finos/FDC3/pull/56))
* Fix workflow numbers in Use Case 1 ([#60](https://github.com/finos/FDC3/pull/60))
* More proofreading changes to existing docs ([62](https://github.com/finos/FDC3/pull/62))
* Fix examples in Intent Overview doc ([#65](https://github.com/finos/FDC3/pull/65))
* Fix errors in DesktopAgent API doc ([#66](https://github.com/finos/FDC3/pull/66))
* Add hyperlink to FDC3 Intro doc ([#69](https://github.com/finos/FDC3/pull/69))

## [1.0.0-beta] - 2019-03-05
## Added
* API content from [FDC3/API](https://github.com/FDC3/API).
* Intent content from [FDC3/Intents](https://github.com/FDC3/Intents).
* Context Data content from [FDC3/ContextData](https://github.com/FDC3/ContextData).
* App Directory content from [FDC3/appd-api](https://github.com/FDC3/appd-api).
* Use Case content from [FDC3/use-cases](https://github.com/FDC3/use-cases).
* Documentation website generated with [Docusaurus](https://docusaurus.io).


[Unreleased]: https://github.com/finos/FDC3/compare/v1.1..HEAD
[1.1]: https://github.com/finos/FDC3/compare/v1.1..v1.0
[1.0]: https://github.com/finos/FDC3/compare/v1.0..v1.0.0-beta
[1.0.0-beta]: https://github.com/finos/FDC3/releases/tag/v1.0.0-beta
