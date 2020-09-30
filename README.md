[![Build Status](https://travis-ci.org/finos/FDC3.svg?branch=master)](https://travis-ci.org/finos/FDC3)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/finos/fdc3)](https://github.com/finos/fdc3/releases/latest)
[![FINOS - Released](https://cdn.jsdelivr.net/gh/finos/contrib-toolbox@master/images/badge-released.svg)](https://finosfoundation.atlassian.net/wiki/display/FINOS/Released)
[![GitHub](https://img.shields.io/github/license/finos/fdc3)](https://opensource.org/licenses/Apache-2.0
)
[![Stack Overflow](https://img.shields.io/badge/stackoverflow-fdc3-orange.svg)](https://stackoverflow.com/questions/tagged/fdc3)

# FDC3

The mission of the Financial Desktop Connectivity and Collaboration Consortium (FDC3) is to develop specific protocols and taxonomies to advance the ability of desktop applications in financial workflows to interoperate in a plug-and-play fashion and without prior, bi-lateral agreements.

## About this Repository
FDC3 is a standard.  This repository houses the documentation and specifications for the ratified FDC3 standards. 

## Using the standard
Check out [the documentation website](https://fdc3.finos.org) for the different components of the standard, an overview of [common use cases](https://fdc3.finos.org/docs/1.1/use-cases/overview), developer [API docs](https://fdc3.finos.org/docs/1.1/api/overview) and [standard compliance information](https://fdc3.finos.org/docs/1.1/fdc3-compliance). 

Latest version of the standard is [1.1](https://fdc3.finos.org/docs/1.1/fdc3-intro). See [all available versions](https://fdc3.finos.org/versions).

## Learn more and interact with the Community
To learn more and ask questions you subscribe to the [FDC3 General List](fdc3@finos.org) by emailing [fdc3+subscribe@finos.org](mailto:fdc3+subscribe@finos.org). Another great way to interact with the standard participants is to attend the quarterly FDC3 General meeting: you should receive an invite by signing up to the general list or you can find the meeting in the [FINOS Project Meetings Calendar](https://calendar.google.com/calendar/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig%40group.calendar.google.com&ctz=America%2FLos_Angeles).

## Using the standard? Let us know!
If you an existing individual or corporate user of the FDC3 standard, we would love to hear from you: just email the [FDC3 General List](fdc3@finos.org) with details about how you are using the standard. If you'd like to be listed as a standard user, you can directly [send a pull request to update our website](./website/data/users.json) or, if listing your logo publicly requires legal evaluation, you can reach out privately to the [FDC3 Product Management Committee](fdc3-private@finos.org).

## Participate in the standard process
The [FDC3 Standard Working Group](https://github.com/finos/FDC3/issues?q=label%3Ameeting+) meets monthly: you are welcome to join by subscribing to the [FINOS Project Meetings Calendar](https://calendar.google.com/calendar/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig%40group.calendar.google.com&ctz=America%2FLos_Angeles). If you'd like to formally enroll as a participant to the standard process, as per [our governance](https://github.com/finos/community/tree/master/governance/Standards-Projects#joining-a-standards-project-grace-period-for-new-participants), please email [fdc3-participants+subscribe@finos.org](mailto:fdc3-participants+subscribe@finos.org?subject=Please%20enroll%20me%20as%20FDC3%20standard%20participant&amp;cc=fdc3-pmc%40finos.org&amp;body=HI%2C%20my%20name%20is%20%3CFirstName%20LastName%3E%20and%20I%27d%20like%20to%20formally%20participate%20to%20the%20FDC3%20standard%20process.%20I%20plan%20to%20contribute%20as%20%3Cindividual%7Con%20behalf%20of%20organizationName%3E%20and%20I%20have%20reviewed%20the%20policies%20described%20at%20https%3A%2F%2Fgithub.com%2Ffinos%2Fcommunity%2Ftree%2Fmaster%2Fgovernance%2FStandards-Projects%20.%20Thank%20you!) making your intent to participate in the standard process explicit. Please note that standard participants are bound to the provisions in the [FINOS IP Policy](https://github.com/finos/community/blob/master/governance/IP-Policy.pdf) as described in the [FINOS standards governance](https://github.com/finos/community/tree/master/governance/Standards-Projects).

## Contributing code to this repository
If you'd like to contribute code to this repository:

1. Fork it (<https://github.com/finos/FDC3/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

The team will review the PR and decide about merging. 

Note that you will require a contributor agreement (individual or corporate) before your code can be merge, so please review [FINOS Contribution requirements](.github/CONTRIBUTING.md).

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS OR who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the FINOS Cla-bot tool. Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org)*

## Roadmap
With Productization on track to land at end of Q1, the expectation is that Q2 will be focused on implementations and feedback from those implementations driving further standards.  
### Target Items for Q2
#### API
* Expand the broadcast API or introduce a new channels API to support the context setting use case. 
* Publish npm package with FDC3 API definitions.

#### App Directory
* Search capabilities, surfacing other content
* Manifest format detail (describing the content)
* Eventing

#### Context Data
* Pivot to JSON schema for representing type definitions. We have found that TypeScript is too implementation-specific and too restrictive in practice.
* Use https://quicktype.io/ to generate type definitions from JSON schema for multi-language support.
* Formalise current example types into official FDC3 types for contact, organisation, instrument etc in conjunction with/based on the Financial Objects program work.

#### Intents
* Add detailed documentation to each intent - linking to use cases
* Align closer with Context Data WG
* Evaluate real use cases, given that we have input from early adapters
* Extend with new intents, based on above + accepted use cases

#### Use Cases
* Continue to process new and existing FDC3 Use Cases
* Assess extending the use cases working group to additional FINOS programs

### Backlog Beyond Q2
* Define the next set of FDC3 Context Data types in conjunction with/based on Financial Objects working group work.
* Work with Financial Objects and other FINOS programs to reach consensus on how to make standardized taxonomies available for consumption, both for viewing/editing and programmatically e.g. for validation. 
* Create comprehensive examples of use cases that show how to use the various FDC3 standards together to enable interoperability.
* App Directory Identity and authentication

## License

Copyright 2017 FDC3

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)
