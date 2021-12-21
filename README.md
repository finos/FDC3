# <a href='http://fdc3.finos.org'><img src='./website/static/img/fdc3-logo-2019-color.png' height='150' alt='FDC3 Logo' aria-label='fdc3.finos.org' /></a>

[![Latest Standard](https://img.shields.io/badge/release-1.2-blue)](https://github.com/finos/fdc3/releases/v1.2)
[![npm](https://img.shields.io/npm/v/@finos/fdc3)](https://www.npmjs.com/package/@finos/fdc3)
[![FINOS - Released](https://cdn.jsdelivr.net/gh/finos/contrib-toolbox@master/images/badge-released.svg)](https://finosfoundation.atlassian.net/wiki/display/FINOS/Released)
[![GitHub](https://img.shields.io/github/license/finos/fdc3)](https://opensource.org/licenses/Apache-2.0)
[![Stack Overflow](https://img.shields.io/badge/stackoverflow-fdc3-orange.svg)](https://stackoverflow.com/questions/tagged/fdc3)
[![npm-build](https://github.com/finos/FDC3/workflows/npm-build/badge.svg)](https://github.com/finos/FDC3/actions?query=workflow%3Anpm-build)
[![website-build](https://github.com/finos/FDC3/workflows/website-build/badge.svg)](https://github.com/finos/FDC3/actions?query=workflow%3Awebsite-build)
[![Slack](https://img.shields.io/badge/slack-@finos/fdc3-green.svg?logo=slack)](https://finos-lf.slack.com/messages/fdc3/)

FDC3 aims to provide an open standard for interoperability on the financial desktop. This includes standardized verbs to invoke actions between applications (called "intents"), a standardized data format, an OpenAPI app directory standard, and standardized API operations.

The standard currently consists of four specifications:

1. [API Specification](https://fdc3.finos.org/docs/api/spec)
2. [Intents Specification](https://fdc3.finos.org/docs/intents/spec)
3. [Context Data Specification](https://fdc3.finos.org/docs/context/spec)
4. [App Directory Specification](https://fdc3.finos.org/docs/app-directory/spec)

The specifications are informed by agreed [business use cases](https://fdc3.finos.org/docs/use-cases/overview),
and implemented and used by leading [financial industry participants](https://fdc3.finos.org/users).

See https://fdc3.finos.org for more information, including on [compliance] and the [FDC3 charter], as well as a comprehensive [API Reference]. You can also take the free [FDC3 Training](https://www.edx.org/course/fdc3-interoperability-for-the-financial-desktop) for an introduction to FDC3's core concepts and usage.

[FDC3 Charter]: https://fdc3.finos.org/docs/fdc3-charter
[Compliance]: https://fdc3.finos.org/docs/fdc3-compliance
[API Reference]: https://fdc3.finos.org/docs/api/ref/DesktopAgent

# Supported Platforms

As an open standard, FDC3 can be implemented on any platform and in any language.

All that is required is a "desktop agent" that supports the FDC3 standard, which is responsible for co-ordinating application interactions.

## Web

For web applications to be FDC3-enabled, they need to run in the context of an agent that makes the FDC3 API available to the application. This desktop agent is also responsible for lauching and co-ordinating applications. It could be a browser extension, web app, or full-fledged desktop container framework.

### Example

```ts
// declare FDC3-compliant data
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL',
        ISIN: 'US0378331005',
        FIGI : 'BBG000B9XRY4'
    }
}

// invoke an action in another application, with the required data
const result = await fdc3.raiseIntent('ViewAnalysis', instrument)

// join the red channel and broadcast data to subscribers
await fdc3.joinChannel('red')
fdc3.broadcast(instrument)

// set up a listener for incoming data
const listener = fdc3.addContextListener('fdc3.contact', contact => { })
```

### Installation

To access the APIs in your application, simply install the FDC3 npm package:

```sh
# npm
npm install @finos/fdc3

# yarn
yarn add @finos/fdc3

# pnpm
pnpm install @finos/fdc3
```

Note that the web application still needs to run in the context of an FDC3 desktop agent to work. For more details, please see the [relevant documentation](https://fdc3.finos.org/docs/supported-platforms).

### Usage

FDC3 can be accessed either via the global window object:

```ts
if (window.fdc3) {
  const channel = await window.fdc3.getOrCreateChannel('myChannel')
  channel.broadcast({ ... })
}
```

Or by importing relevant FDC3 functions with ES6 module syntax:

```ts
import { getOrCreateChannel } from '@finos/fdc3'

// will throw if window.fdc3 is not available
const channel = await getOrCreateChannel('myChannel')
channel.broadcast({ ... })
```

## Native
The FDC3 standard does not define wire formats for communication. Hence, for native applications to be FDC3-enabled, they need to make use of a library (e.g. a DLL in .Net or Jar file in Java) that provides them with an implementation of the FDC3 API. FDC3-enabled native applications are therefore specific to particular desktop container frameworks (or other suitable environments) that provide the necessary libraries.

Despite this limitation, implementing support for FDC3 in a native application can allow it to interact with a wide variety of FDC3-enabled web applications.

# Roadmap

- [x] Publish versioned NPM packages to ease adoption and implementation of FDC3 APIs.
- [x] Release version 1.2 of the standard with expanded API capabilities.
- [ ] Establish a process to accelerate community-contributed context data definitions.
- [ ] Release version 2.0 of the standard with support for app instances, two-way data flow and joining multiple channels.
- [ ] Improve the app directory specification, with support for container-agnostic app manifests, and more type metadata around channels and launching apps.
- [ ] Introduce a hosted app directory example with sample application definitions.
- [ ] Continue building out business use cases to inform future versions of the FDC3 Standard.

# Using the standard? Let us know!

If you are an existing individual or corporate user of the FDC3 standard, we would love to hear from you: just email [fdc3@finos.org](mailto:fdc3@finos.org) with details about how you are using the standard.

If you'd like to be listed as a user of the standard, you can directly send a pull request to update the [FDC3 website](https://fdc3.finos.org/): upload your logo to [this folder](https://github.com/finos/FDC3/tree/master/website/static/img/users) and update [this file](https://github.com/finos/FDC3/edit/master/website/data/users.json) with your company's details. If listing your logo publicly requires legal evaluation, you can reach out **privately** to [FDC3 Maintainers](mailto:fdc3-maintainers-private@finos.org).

# Getting Involved

## Interact with the FDC3 community

### GitHub
FDC3 activity primarily happens in this [FDC3 GitHub repository](https://github.com/finos/fdc3). [Watch](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) the repository in order to be notified of new Pull Requests and issues.

### Slack 
The fastest and more interactive way to connect and ask questions to the FDC3 community is to join the [#fdc3 channel on the FINOS slack](https://finos-lf.slack.com/messages/fdc3/).

### Email
If you'd like to receive official updates, and/or you don't have access to Slack, please send an email to [fdc3@finos.org](mailto:fdc3@finos.org). You can join the list by sending an email to [fdc3+subscribe@finos.org](mailto:fdc3+subscribe@finos.org).

### Meetings 
Finally, another great way to interact with the community, is to attend the monthly [FDC3 Standard Working Group Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) and/or the quarterly [FDC3 General Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22General+Meeting%22): email [help@finos.org](mailto:help@finos.org) to be added to the meeting invite directly, or find the meeting in the [FINOS Community Calendar](https://calendar.google.com/calendar/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig%40group.calendar.google.com).

### Need help?
Email [fdc3@finos.org](mailto:fdc3@finos.org) if you need help getting started in the FDC3 Community. If you encounter technical difficulties accessing repositories, joining Slack, mailing lists or meetings, please email [help@finos.org](mailto:help@finos.org).

## Become an FDC3 Participant or Maintainer
Email [fdc3@finos.org](mailto:fdc3@finos.org) if you would like to become an FDC3 Participant or Maintainer.

### FDC3 Participants
FDC3 Participants are those that make and have made contributions to the FDC3 Standard Working Group. The [FDC3 Standard Working Group](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) has the specific purpose of defining and releasing subsequent updates to the standard. 

#### Enrollment
If you would like to formally enroll as a voting participant to the standard (as described in our standards governance),
please email [fdc3-participants+subscribe@finos.org](mailto:fdc3-participants+subscribe@finos.org?subject=Please%20enroll%20me%20as%20FDC3%20standard%20participant&amp;cc=fdc3-pmc%40finos.org&amp;body=HI%2C%20my%20name%20is%20%3CFirstName%20LastName%3E%20and%20I%27d%20like%20to%20formally%20participate%20to%20the%20FDC3%20standard%20process.%20I%20plan%20to%20contribute%20as%20%3Cindividual%7Con%20behalf%20of%20organizationName%3E%20and%20I%20have%20reviewed%20the%20policies%20described%20at%20https%3A%2F%2Fgithub.com%2Ffinos%2Fcommunity%2Ftree%2Fmaster%2Fgovernance%2FStandards-Projects%20.%20Thank%20you!) making your intent to participate in the standard process explicit.
Please note that standard participants are bound to the provisions in the [FINOS IP Policy](https://github.com/finos/community/blob/db11c11b80651b8bc888e7cb1d56d20afdf2a346/governance/IP-Policy.pdf) as described in the [FINOS standards governance](https://github.com/finos/community/tree/db11c11b80651b8bc888e7cb1d56d20afdf2a346/governance/Standards-Projects).

Upon enrollment as an [FDC3 voting participant](https://github.com/orgs/finos/teams/fdc3-participants), you will be invited to join the [FINOS GitHub organization](https://github.com/orgs/finos/people) and the [fdc3-participants](https://github.com/orgs/finos/teams/fdc3-participants) GitHub team.

### FDC3 Maintainers
FDC3 maintainers are responsible for organizing activities around developing, maintaining, and updating the specification developed by the FDC3 Standard Working Group. Maintainers are also responsible for determining consensus and coordinating appeals, as well as FDC3-related planning and communications. 

#### Mailing list
You can contact the FDC3 maintainers by sending an email to [fdc3-maintainers@finos.org](mailto:fdc3-maintainers@finos.org).

# FDC3 Archive
An archive of FDC3 documentation and meeting notes is available at https://finosfoundation.atlassian.net/wiki/spaces/FDC3/overview. The mailing list archive for fdc3@finos.org is available at https://groups.google.com/a/finos.org/g/fdc3

# Contributing

If you'd like to contribute code to this repository:

1. Fork it (<https://github.com/finos/FDC3/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [contribution guidelines](CONTRIBUTING.md) and [Community Code of Conduct](https://www.finos.org/code-of-conduct)
4. Commit your changes (`git commit -am 'add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS, _OR_ who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the FINOS `cla-bot` tool. Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org).*

# License

Copyright 2017-2021 FINOS

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)
