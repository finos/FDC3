# FDC3 - Financial Desktop Connectivity and Collaboration Consortium

<a href='http://fdc3.finos.org'><img src='./website/static/img/fdc3-logo-2019-color.png' height='150' alt='FDC3 Logo' aria-label='fdc3.finos.org' /></a>

[![Latest Standard](https://img.shields.io/badge/release-2.0-blue)](https://github.com/finos/fdc3/releases/v2.0)
[![npm](https://img.shields.io/npm/v/@finos/fdc3)](https://www.npmjs.com/package/@finos/fdc3)
[![FINOS - Released](https://cdn.jsdelivr.net/gh/finos/contrib-toolbox@master/images/badge-released.svg)](https://finosfoundation.atlassian.net/wiki/display/FINOS/Released)
[![GitHub](https://img.shields.io/github/license/finos/fdc3)](https://opensource.org/licenses/Apache-2.0)
[![Stack Overflow](https://img.shields.io/badge/stackoverflow-fdc3-orange.svg)](https://stackoverflow.com/questions/tagged/fdc3)
[![npm-build](https://github.com/finos/FDC3/workflows/npm-build/badge.svg)](https://github.com/finos/FDC3/actions?query=workflow%3Anpm-build)
[![Slack](https://img.shields.io/badge/slack-@finos/fdc3-green.svg?logo=slack)](https://finos-lf.slack.com/messages/fdc3/)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6579/badge)](https://bestpractices.coreinfrastructure.org/projects/6579)

## What Is It?

[FDC3](https://fdc3.finos.org) is an open standard for applications on financial desktop to interoperate and exchange data with each other.  

- Users benefit from a more joined-up experience, which reduces the "friction" in getting common tasks done,
- By enabling applications to:
  - launch other apps (build a launcher),
  - respond to activity in other apps (context sharing),
  - request functionality from other apps (raising intents).

### What Are The Benefits?

#### 📇 Help Manage Information Overload

> Finance is an information-dense environment.  
> Typically, traders will use serveral different displays so that they can keep track of multiple information sources at once.
> FDC3 helps with this by sharing the "context" between multiple applications, so that they collectively track the topic the user is focused on.

#### 🏃‍♂️ Work Faster

> FDC3 standardizes a way to call actions between applications (called "intents").
> Applications can raise intents for other apps to resolve, extending each other's functionality.
> Instead of the user copy-and-pasting bits of data from one application to another, FDC3 makes sure the intents have the data they need to seamlessly transition activity between applications.

#### 🖥️  Platform Agnostic

> As an open standard, FDC3 can be implemented on any platform and in any language.
> All that is required is a "Desktop Agent" that implements the FDC3 standard, which is responsible for co-ordinating application interactions.  (For a list of open source and proprietary desktop agents, see "Platform providers" [here](https://fdc3.finos.org/community#type-platform-provider).)
> FDC3 is successfully running on Web and Native platforms in financial institutions around the world.

#### 🔌  End the Integration Nightmare

> By providing support for FDC3, vendors and financial organizations alike can avoid the bilateral or trilateral integration projects that plague desktop app roll-out, cause vendor lock-in and result in a slow pace of change on the Financial Services desktop.

#### 👐 Open Standards Promote Innovation

> FDC3 is developed collaboratively by a [consortium of industry participants](https://fdc3.finos.org/community#type-all) including banks, agent vendors, app developers and FinTech firms.  By design, FDC3 is open to extension.  We have an active community working on growing and improving the standard with new data and intents.

## How Does It Work?

FDC3 includes a standardized API for a Desktop agent, an OpenAPI App Directory, standard verbs to invoke actions between applications (called "intents"), standard formats for data passed between applications (called "context data") and a wire-protocol for Desktop Agents to communicate with each other (called "Desktop Agent Bridging").

Hence, the standard currently consists of five parts:

1. [API Part](https://fdc3.finos.org/docs/api/spec)
2. [App Directory Part](https://fdc3.finos.org/docs/app-directory/overview)
3. [Intents part](https://fdc3.finos.org/docs/intents/spec)
4. [Context Data Part](https://fdc3.finos.org/docs/context/spec)
5. [Agent Bridging Part](https://fdc3.finos.org/docs/next/agent-bridging/spec) [`@experimental`](https://fdc3.finos.org/docs/fdc3-compliance#experimental-features)

The specifications are informed by agreed [business use cases](https://fdc3.finos.org/docs/use-cases/overview), and implemented and used by leading [financial industry participants](https://fdc3.finos.org/community#type-all).

### More Resources

- See <https://fdc3.finos.org> for more information, including on [Compliance](https://fdc3.finos.org/docs/fdc3-compliance) and the [FDC3 charter](https://fdc3.finos.org/docs/fdc3-charter), as well as a comprehensive [API Reference](https://fdc3.finos.org/docs/api/ref/DesktopAgent).
- You can also take the free [FDC3 Training](https://www.edx.org/course/fdc3-interoperability-for-the-financial-desktop) for an introduction to FDC3's core concepts and usage.
- The [FDC3 Community Page Training Tab](https://fdc3.finos.org/community#type-examples-and-training) also contains a selection of online resources to browse.
- FINOS' open source Desktop Agent, [FDC3 Sail](https://github.com/finos/FDC3-Sail) project written with Node / Electron.

## Supported Platforms

- As an open standard, FDC3 can be implemented on any platform and in any language.
- All that is required is a "desktop agent" that supports the FDC3 standard, which is responsible for coordinating application interactions.
- Get started using FDC3 on the web with TypeScript by reading the [supported platforms](https://fdc3.finos.org/docs/supported-platforms) page.

### FDC3 npm module

The FDC3 npm package does NOT provide a Desktop Agent implementation. Rather, it can by used by web applications to target operations from the API Specification in a consistent way. Each FDC3-compliant desktop agent that the application runs in, can then provide an implementation of the FDC3 API operations.

For installation and usage instructions, see: <https://fdc3.finos.org/docs/supported-platforms#usage>

## Getting Involved

### Using the standard? Let us know

If you are an existing individual or corporate user of the FDC3 standard, we would love to hear from you: just email [fdc3@finos.org](mailto:fdc3@finos.org) with details about how you are using the standard.

- If you'd like to be listed as on the community page, please fill out the [Usage Form](https://share.hsforms.com/1gOo0_A70QqyahOygzryVQg1fux8).
- If listing your logo publicly requires legal evaluation, you can reach out **privately** to the [FDC3 Maintainers](mailto:fdc3-maintainers-private@finos.org).

### Interact with the FDC3 community

#### GitHub

- FDC3 activity primarily happens in this [FDC3 GitHub repository](https://github.com/finos/fdc3). [Watch](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) the repository in order to be notified of new Pull Requests and issues.

#### Slack

- The fastest and more interactive way to connect and ask questions to the FDC3 community is to join the [#fdc3 channel on the FINOS slack](https://finos-lf.slack.com/messages/fdc3/).

#### Email

- If you'd like to receive official updates, and/or you don't have access to Slack, please send an email to [fdc3@finos.org](mailto:fdc3@finos.org). You can join the list by sending an email to [fdc3+subscribe@finos.org](mailto:fdc3+subscribe@finos.org).
- To contact the FDC3 maintainers, send an email to [fdc3-maintainers@finos.org](mailto:fdc3-maintainers@finos.org).

#### Meetings

- Finally, another great way to interact with the community, is to attend the monthly [FDC3 Standard Working Group Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) and/or the quarterly [FDC3 General Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22General+Meeting%22).
- Email [help@finos.org](mailto:help@finos.org) to be added to the meeting invite directly, or find the meeting in the [FINOS Community Calendar](https://calendar.google.com/calendar/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig%40group.calendar.google.com).

#### Need help?

- Email [fdc3@finos.org](mailto:fdc3@finos.org) if you need help getting started in the FDC3 Community.
- If you encounter technical difficulties accessing repositories, joining Slack, mailing lists or meetings, please email [help@finos.org](mailto:help@finos.org).

### Roadmap

Work on FDC3 is split into several [discussion groups](GOVERNANCE.md#1roles) and releases.  

- Discussion groups each have their own regular meetings in the [FINOS Community Calendar](https://calendar.google.com/calendar/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig%40group.calendar.google.com).  

- Releases can be tracked on the [FDC3 Milestones](https://github.com/finos/FDC3/milestones) page.

### Contributing

Please see the [Contributing](CONTRIBUTING.md) guide for details on how to contribute to FDC3.

_NOTE:_

- Issues that change the Standard usually need discussion. You can post comments directly on the issue or can ask for it to be added to a Standards Working Group meeting agenda by emailing [fdc3@finos.org](mailto:fdc3@finos.org), sending a message to the [#fdc3 channel on the FINOS slack](https://finos-lf.slack.com/messages/fdc3/) or tag the FDC3 maintainers (`@finos/fdc3-maintainers`) in your issue.
- Contributions merged into the master branch of the FDC3 repository will form part of the next pre-draft of the FDC3 Standard (as defined by the [FDC3 Governance document](./GOVERNANCE.md)), which must be approved by a Standard Working Group vote before it is accepted as a draft and subsequently released as the next version of the Standard.

### Why should you get involved in FDC3?

If you or your firm intends to make use of the FDC3 Standard (by implementing a Desktop Agent or App Directory, by adding support to apps to interoperate with others via FDC3, or even by using apps, Desktop Agents or App Directories written by others) then contributing to the governance, maintenance and onward development of the FDC3 Standard will help to protect and strengthen the ecosystem developing around FDC3. Doing so will also empower you to help guide the Standard in directions that are relevant to your use or that of your firm.

If you or your firm are new to contributing to open source projects, please see the variety of resources available from FINOS, (such as the [Open Source readiness project](https://www.finos.org/open-source-readiness)), Linux Foundation ([Participating in Open Source communities](https://www.linuxfoundation.org/tools/participating-in-open-source-communities/)) and others (e.g. [opensource.guide](https://opensource.guide/)).

### What Roles Do Participants Hold?

Please refer to the FDC3 [Governance document](GOVERNANCE.md#1roles) for details of the different roles on the FDC3 project.

### FINOS Code of Conduct

Participants of FINOS standards projects should follow the FINOS Code of Conduct, which can be found at: <https://community.finos.org/docs/governance/code-of-conduct>

## License

- This version of the FDC3 Standard is licensed under the [Community Specification License](LICENSE).  SPDX-License-Identifier: [Community-Spec-1.0](https://spdx.org/licenses/Community-Spec-1.0). 

- Reference implementations and other software contained in FDC3 repositories is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) unless otherwise noted. SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0). 

- See [Licenses in the FDC3 Charter](https://fdc3.finos.org/docs/fdc3-charter) for details of licensing for previous versions of the FDC3 Standard and [NOTICES.md](./NOTICES.md) for details of license acceptance, withdrawals and exclusions. 

## Vulnerabilities / Security

Please see our [Security Policy](SECURITY.md)

## Intellectual Property Claims

Users of the FDC3 standard are requested to submit, with their comments, notification of any relevant patent claims or other intellectual property rights of which they may be aware that might be infringed by any implementation of the standard set forth in this document, and to provide supporting documentation.

THIS STANDARD IS BEING OFFERED WITHOUT ANY WARRANTY WHATSOEVER, AND IN PARTICULAR, ANY WARRANTY OF NON-INFRINGEMENT IS EXPRESSLY DISCLAIMED. ANY USE OF THIS STANDARD SHALL BE MADE ENTIRELY AT THE IMPLEMENTER'S OWN RISK, AND NEITHER THE FOUNDATION, NOR ANY OF ITS MEMBERS OR SUBMITTERS, SHALL HAVE ANY LIABILITY WHATSOEVER TO ANY IMPLEMENTER OR THIRD PARTY FOR ANY DAMAGES OF ANY NATURE WHATSOEVER, DIRECTLY OR INDIRECTLY, ARISING FROM THE USE OF THIS STANDARD.

## FDC3 Archive

An archive of FDC3 documentation and meeting notes is available at <https://finosfoundation.atlassian.net/wiki/spaces/FDC3/overview>. The mailing list archive for [fdc3@finos.org](mailto:fdc3@finos.org) is available at <https://groups.google.com/a/finos.org/g/fdc>
