# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
* Apply FINOS branding, styles and logos to the website ([#96](https://github.com/finos/FDC3/pull/96))
* Add ChartIQ to "Who is using FDC3?" section on website ([#100](https://github.com/finos/FDC3/pull/100))
* Expand `AppMetadata` interface with more application properties ([#157](https://github.com/finos/FDC3/pull/157))

### Fixed
* Upgrade dependencies to address security vulnerabilities

### Docs
* Remove FactSet-specific examples ([#88](https://github.com/finos/FDC3/pull/88))
* Add Intent Reference and Context Data Reference ([#172](https://github.com/finos/FDC3/pull/172))
* Fix several typos and broken links

## [1.0.0] - 2019-03-28

First official release of FDC3 at https://fdc3.finos.org, consisting of:
* [API Specification 1.0](https://fdc3.finos.org/docs/1.0/api/api-spec)
* [Intents Specification 1.0](https://fdc3.finos.org/docs/1.0/intents-spec)
* [Context Data Specification 1.0](https://fdc3.finos.org/docs/1.0/context-spec)
* [App Directory Specification 1.0](https://fdc3.finos.org/docs/1.0/appd-spec)
* [Use Cases 1.0](https://fdc3.finos.org/docs/1.0/use-cases/overview)

Thank you to the following contributors who helped with this release:

* @ColinEberhardt
* @tschady
* @donbasuno
* @sbloodgood
* @jonathanteperJPMC
* @kjones207
* @rikoe
* @RichLinnell
* @nkolba
* @saori-tr

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

Initial beta release of the combined FDC3 repository and the FDC3 website hosted at https://fdc3.finos.org.

Thank you to the following contributors who helped with this release:
* @nkolba
* @rikoe
* @espenove
* @RichLinnell
* @maoo
* @brooklynrob

## Added
* API content from [FDC3/API](https://github.com/FDC3/API).
* Intent content from [FDC3/Intents](https://github.com/FDC3/Intents).
* Context Data content from [FDC3/ContextData](https://github.com/FDC3/ContextData).
* App Directory content from [FDC3/appd-api](https://github.com/FDC3/appd-api).
* Use Case content from [FDC3/use-cases](https://github.com/FDC3/use-cases).
* Documentation website generated with [Docusaurus](https://docusaurus.io).


[Unreleased]: https://github.com/finos/FDC3/compare/v1.0.0..HEAD
[1.0.0]: https://github.com/finos/FDC3/compare/v1.0.0..v1.0.0-beta
[1.0.0-beta]: https://github.com/finos/FDC3/releases/tag/v1.0.0-beta