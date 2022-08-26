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

As an open standard, FDC3 can be implemented on any platform and in any language. All that is required is a "desktop agent" that supports the FDC3 standard, which is responsible for co-ordinating application interactions.

For more details see https://fdc3.finos.org/docs/supported-platforms

## FDC3 npm module

The FDC3 npm package does NOT provide a Desktop Agent implementation. Rather, it can by used by web applications to target operations from the API Specification in a consistent way. Each FDC3-compliant desktop agent that the application runs in, can then provide an implementation of the FDC3 API operations.

For installation and usage instructions, see: https://fdc3.finos.org/docs/supported-platforms#usage

# Getting Involved

If you or your firm intends to make use of the FDC3 Standard (by implementing a Desktop Agent or App Directory, by adding support to apps to interoperate with others via FDC3, or even by using apps, Desktop Agents or App Directories written by others) then participating in the governance, maintenance and onward development of the FDC3 Standard will help to protect and strengthen the ecosystem developing around FDC3. Doing so will also empower you to help guide the Standard in directions that are relevant to your use or that of your firm.
If you or your firm are new to contributing to open source projects, please see the variety of resources available from FINOS, (such as the [Open Source readiness project](https://www.finos.org/open-source-readiness)), Linux Foundation ([Participating in Open Source communities](https://www.linuxfoundation.org/tools/participating-in-open-source-communities/)) and others (e.g. [opensource.guide](https://opensource.guide/)). 

## Using the standard? Let us know!

If you are an existing individual or corporate user of the FDC3 standard, we would love to hear from you: just email [fdc3@finos.org](mailto:fdc3@finos.org) with details about how you are using the standard.

If you'd like to be listed as a user of the standard, let us know by using the form at: (https://www.finos.org/get-involved-fdc3) 
If listing your logo publicly requires legal evaluation, you can reach out **privately** to [FDC3 Maintainers](mailto:fdc3-maintainers-private@finos.org).

## Interact with the FDC3 community

### GitHub

FDC3 activity primarily happens in this [FDC3 GitHub repository](https://github.com/finos/fdc3). [Watch](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) the repository in order to be notified of new Pull Requests and issues.

### Slack 

The fastest and more interactive way to connect and ask questions to the FDC3 community is to join the [#fdc3 channel on the FINOS slack](https://finos-lf.slack.com/messages/fdc3/).

### Email

If you'd like to receive official updates, and/or you don't have access to Slack, please send an email to [fdc3@finos.org](mailto:fdc3@finos.org). You can join the list by sending an email to [fdc3+subscribe@finos.org](mailto:fdc3+subscribe@finos.org).
To contact the FDC3 maintainers, send an email to [fdc3-maintainers@finos.org](mailto:fdc3-maintainers@finos.org).

### Meetings 

Finally, another great way to interact with the community, is to attend the monthly [FDC3 Standard Working Group Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) and/or the quarterly [FDC3 General Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22General+Meeting%22): email [help@finos.org](mailto:help@finos.org) to be added to the meeting invite directly, or find the meeting in the [FINOS Community Calendar](https://calendar.google.com/calendar/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig%40group.calendar.google.com).

### Need help?

Email [fdc3@finos.org](mailto:fdc3@finos.org) if you need help getting started in the FDC3 Community. If you encounter technical difficulties accessing repositories, joining Slack, mailing lists or meetings, please email [help@finos.org](mailto:help@finos.org).

## Contributing

If you'd like to contribute to the FDC3 standard, or have noticed something that needs correcting, the first step is to [raise an issue on the FDC3 Github Repo](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue) and describe what you'd like to see changed. There are a number of issue templates that you can choose from [here](https://github.com/finos/FDC3/issues/new/choose).

Issues that change the Standard usually need discussion. You can post comments directly on the issue or can ask for it to be added to a Standards Working Group meeting agenda by emailing [fdc3@finos.org](mailto:fdc3@finos.org), sending a message to the [#fdc3 channel on the FINOS slack](https://finos-lf.slack.com/messages/fdc3/) or tag the FDC3 maintainers (`@finos/fdc3-maintainers`) in your issue.

To implement changes in the FDC3 repository resolving an issue please read our [contribution guidelines](CONTRIBUTING.md). 

Contributions merged into the master branch of the FDC3 repository will form part of the next pre-draft of the FDC3 Standard (as defined by the [FDC3 Governance document](./GOVERNANCE.md)), which must be approved by the Standard Working Group voting participants before it is accepted as a draft and subsequently released as the next version of the Standard.

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS, _OR_ who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the [Linux Foundation `EasyCLA` tool](https://easycla.lfx.linuxfoundation.org/#/). Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org).*

### Roadmap

See: https://fdc3.finos.org/fdc3-roadmap

## What it means to be an FDC3 Participant, Editor or Maintainer

According to [Governance document](GOVERNANCE.md) document: 
- **"Participants"** are those that have made contributions to the FDC3 Standard Working Group (subject to the [FINOS IP Policy](https://github.com/finos/community/blob/master/website/static/governance-docs/IP-Policy.pdf)). The [FDC3 Standard Working Group](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) has the specific purpose of defining and releasing subsequent updates to the Standard. In practice, that means people that attend and contribute to meetings, raise issues, pull requests (to submit patches to the Standard) and reviews.

- **"Editors"** are responsible for ensuring that the contents of the Standard's documents accurately reflect the decisions that have been made by the group, and that the specification adheres to formatting and content guidelines.

- **"Maintainers"** are responsible for organizing activities around developing, maintaining, and updating the specification(s) developed by the Working Group. Maintainers are also responsible for determining consensus and coordinating appeals.

Whilst all 3 roles require some amount of attention, being an Editor or Maintainer will obviously require a greater and more regular investment of time from anyone taking on that role.

### How do you become a Participant, Editor or Maintainer?

Becoming an FDC3 participant is as easy as attending meetings and/or raising issues for changes you'd like see in the Standard, commenting on issues others have raised or even asking questions (which can often result in the clarification of the Standard's documentation to help others with the same questions in future).

If you are going to use, implement or benefit from the FDC3 Standard, we also recommend that you sign up as a voting participant. To do so, please use this link: [fdc3-participants+subscribe@finos.org](mailto:fdc3-participants+subscribe@finos.org?subject=Please%20enroll%20me%20as%20FDC3%20standard%20participant&amp;cc=fdc3-pmc%40finos.org&amp;body=HI%2C%20my%20name%20is%20%3CFirstName%20LastName%3E%20and%20I%27d%20like%20to%20formally%20participate%20to%20the%20FDC3%20standard%20process.%20I%20plan%20to%20contribute%20as%20%3Cindividual%7Con%20behalf%20of%20organizationName%3E%20and%20I%20have%20reviewed%20the%20policies%20described%20at%20https%3A%2F%2Fgithub.com%2Ffinos%2Fcommunity%2Ftree%2Fmaster%2Fgovernance%2FStandards-Projects%20.%20Thank%20you!) to send a templated email email to join the enrolled voting participants group. Please note that standard participants are bound to the provisions in the [FINOS IP Policy](https://github.com/finos/community/blob/master/website/static/governance-docs/IP-Policy.pdf) as described in the [FINOS Standards governance document](https://github.com/finos/community/tree/master/governance/Standards-Projects).

Upon enrollment as an [FDC3 voting participant](https://github.com/orgs/finos/teams/fdc3-participants), you will be invited to join the [FINOS GitHub organization](https://github.com/orgs/finos/people) and the [fdc3-participants](https://github.com/orgs/finos/teams/fdc3-participants) GitHub team.

Once you are an enrolled participant in FDC3, you can apply to become an editor or maintainer by contacting the existing FDC3 maintainers at [fdc3-maintainers@finos.org](mailto:fdc3-maintainers@finos.org) and then seeking the approval of the FDC3 Standards Working Group. Generally, the maintainers will look for both a history of contribution to FDC3 and a commitment to investing sufficient time in the role from any prospective candidates before proposing them to the Standards Working Group for approval. If you are new to FDC3, but willing to make the investment of time, the maintainers can work with you to build up a history of contribution.

# License

Copyright 2017-2022 FINOS and FDC3 Participants

Version 1.0 of the FDC3 specification is licensed under the [FDC3 1.0 Final Specification License](PATENTS-FDC3-1.0.md).

Subsequent FDC3 specifications and draft specifications are subject to the [FINOS IP Policy](https://github.com/finos/community/blob/master/website/static/governance-docs/IP-Policy.pdf), which authorizes implementation of FDC3 specifications without charge, on a RAND basis, subject to the terms of the policy. For details of the IP commitments made by contributors to FDC3, please refer to the policy.

Reference implementations and other software contained in FDC3 repositories is licensed under the [Apache License, Version 2.0](LICENSE) unless otherwise noted. SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0).

## Intellectual Property Claims

Users of the FDC3 standard are requested to submit, with their comments, notification of
any relevant patent claims or other intellectual property rights of which they may be aware that
might be infringed by any implementation of the standard set forth in this document, and to provide 
supporting documentation.

THIS STANDARD IS BEING OFFERED WITHOUT ANY WARRANTY WHATSOEVER, AND IN PARTICULAR, ANY WARRANTY OF NON-INFRINGEMENT IS EXPRESSLY DISCLAIMED. ANY USE OF THIS STANDARD SHALL BE MADE ENTIRELY AT THE IMPLEMENTER'S OWN RISK, AND NEITHER THE FOUNDATION, NOR ANY OF ITS MEMBERS OR SUBMITTERS, SHALL HAVE ANY LIABILITY WHATSOEVER TO ANY IMPLEMENTER OR THIRD PARTY FOR ANY DAMAGES OF ANY NATURE WHATSOEVER, DIRECTLY OR INDIRECTLY, ARISING FROM THE USE OF THIS STANDARD.

# FDC3 Archive

An archive of FDC3 documentation and meeting notes is available at https://finosfoundation.atlassian.net/wiki/spaces/FDC3/overview. The mailing list archive for fdc3@finos.org is available at https://groups.google.com/a/finos.org/g/fdc3
