# Contributing to FDC3

This document provides the contribution policy for the FDC3 Standard (the [Working Group](GOVERNANCE.md)) and is based on the [Community Specification Contribution Policy 1.0](https://spdx.org/licenses/Community-Spec-1.0.html).

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those participants with an active, executed Individual Contributor License Agreement (ICLA) with FINOS, _OR_ who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the [Linux Foundation `EasyCLA` tool](https://easycla.lfx.linuxfoundation.org/#/). Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org).*

## 1.	Contribution Guidelines.

This Working Group accepts contributions via pull requests. The following section outlines the process for merging contributions to the specification

**1.1.	Issues.**  Issues are used as the primary method for tracking anything to do with this specification Working Group.

**1.1.1.	Issue Types.**  A number of issue templates are available in the FDC3 respository:

**1.1.1.1.	Meetings.** Templates for issues that represent meetings and include agendas, teleconference details and minutes.

**1.1.1.2.	Proposals and Enhancement Requests.** Used for items that propose a new ideas or functionality that require a larger discussion. This allows for feedback from others before a specification change is actually written.

**1.1.1.3.	Minor Issue:** These track minor changes or corrections that don't alter the Standard significantly but rather correct minor errors or ommisions.

**1.1.1.4.	Question:** May be used to ask questions about FDC3, requests support etc..

## 2.	Issue Lifecycle.

The issue lifecycle is mainly driven by the Maintainer.  All issue types follow the same general lifecycle. Differences are noted below.

**Prerequisites**

 * Have you [searched for duplicates](https://github.com/finos/FDC3/issues?utf8=%E2%9C%93&q=)?  A simple search for exception error messages or a summary of the unexpected behaviour should suffice.
 * Are you using the latest version of the Standard?
   * Changes that have been merged but not yet released can be found in the [next](https://fdc3.finos.org/docs/next/fdc3-standard) version of the website and details found in the [CHANGELOG](https://github.com/finos/FDC3/blob/main/CHANGELOG.md)
 * Are you sure this is a bug or missing capability?

**2.1.	Issue Creation.**

 * Create your issue [here](https://github.com/finos/FDC3/issues/new).
 * New issues contain two templates in the description: bug report and enhancement request. Please pick the most appropriate for your issue, **then delete the other**.

 * Please also tag the new issue with either "Bug" or "Enhancement".

 * Please use [Markdown formatting](https://help.github.com/categories/writing-on-github/)
liberally to assist in readability.
 
 * [Code fences](https://help.github.com/articles/creating-and-highlighting-code-blocks/) for exception stack traces and log entries, for example, massively improve readability.

**2.2.	Triage.**

- The FDC3 Maintainers will apply the proper labels for the issue. This may include labels for priority, type, and metadata.

- (If needed) Clean up the title to succinctly and clearly state the issue.

**2.3.	Discussion.**

- Issues that change the Standard usually need discussion. You can post comments directly on the issue or can ask for it to be added to a Standards Working Group meeting agenda by emailing [fdc3@finos.org](mailto:fdc3@finos.org), sending a message to the [#fdc3 channel on the FINOS slack](https://finos-lf.slack.com/messages/fdc3/) or tag the FDC3 maintainers (`@finos/fdc3-maintainers`) in your issue.

- Issues that enhance or otherwise change the Standard should be connected to the pull request that resolves it. That can be achieved by prefixing your pull request's description with a keyword and issue number, e.g. `resolves #123`. For more details on linking issues and PRs see [Github's documentation](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).

**2.4.	Issue Closure.**

## 3.	How to Contribute a Patch.

The Working Group uses pull requests to track changes. To submit a change to the Standard:

**3.1.	Fork the Repo**
- (<https://github.com/finos/FDC3/fork>)

**3.2.	Create your feature branch**
- `git checkout -b feature/fooBar`

**3.3.	Commit your changes**
- `git commit -am 'Describe what you changed'`

**3.4.	Push to the branch**
- `git push origin feature/fooBar`

**3.5.	Create a Pull Request**
- For help creating a pull request from your fork, [see Github's documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

To contribute a patch for a New Intent, see the [Submit New Intent](docs/guides/submit-new-intent) guide.

**3.6. Test Policy**

- The FDC3 project takes very seriously code quality, especially with respect to production-grade sub-modules.  This includes:

|Module | Test Policy |
|---|---|
|`packages/fdc3-agent-proxy` | Contributions must improve or maintain coverage at the current levels |
|`packages/fdc3-get-agent` |Contributions must improve or maintain coverage at the current levels 
|`packages/fdc3-commonjs` | Code should not be added here |
|`packages/fdc3-context` | Must contain only JSON Schemas |
|`packages/fdc3-schema` | Must contain only JSON Schemas |
|`packages/fdc3-context` | Must contain only JSON Schemas |
|`packages/fdc3-standard` | Contributions must improve or maintain coverage at the current levels |
|`toolbox/fdc3-for-web/fdc3-web-impl` | Contributions must improve or maintain coverage at the current levels |

Please note that the FDC3 project uses the following test policy:

  * Code should have tests (coverage is reported in the PR comments)
  * All tests must pass. (checked automatically by the PR comments)
  * All new code must be covered by tests.
  * All tests must be meaningful.
  * All tests must be kept up-to-date.
  * All tests must be run locally before submitting a PR.
  * Finally, the `toolbox/fdc3-for-web/demo` project is expected to pass the FDC3 conformance framework prior to new FDC3 releases (not currently automated).

## 4.	Pull Request Workflow.

The next section contains more information on the workflow followed for Pull Requests.

**4.1.	Pull Request Creation.**

- We welcome pull requests that are currently in progress. They are a great way to keep track of important work that is in-flight, but useful for others to see. If a pull request is a work in progress, it should be prefaced with "WIP: [title]". Once the pull request is ready for review, remove "WIP" from the title and label.

- It is preferred, but not required, to have a pull request tied to a specific issue. Prefix your PR's description with `resolves #<issue number>` to link it to your issue.

- There can be circumstances where if it is a quick fix then an issue might be overkill. The details provided in the pull request description would suffice in this case.

- Ensure that pull requests include a proposed update to the [FDC3 Changelog (CHANGELOG.md)](CHANGELOG.md)

To make review of PRs easier, please:

 * Please make sure your PRs will merge cleanly - PRs that don't are unlikely to be accepted.
 
 * For code contributions, follow the existing code layout.
 
 * For documentation contributions, follow the general structure, language, and tone of the [existing docs](https://fdc3.finos.org).
 
 * Keep commits small and cohesive - if you have multiple contributions, please submit them as independent commits (and ideally as independent PRs too).
 
 * Reference issue #s if your PR has anything to do with an issue (even if it doesn't address it).
 
 * Minimise non-functional changes (e.g. whitespace shenanigans).
 
 * Ensure all new source files include a header comment block containing the [Apache License v2.0 and your copyright information](http://www.apache.org/licenses/LICENSE-2.0#apply).
 
 * If necessary (e.g. due to 3rd party dependency licensing requirements), update the [NOTICES.md file](https://github.com/finos/FDC3/blob/main/NOTICES.md) with any new attribution or other notices

**4.2.	Triage**

- The Maintainers will apply the proper labels for the issue. This may include an indication of the subject area or type (e.g. `deprecation`).

**4.3.	Reviewing/Discussion.**

- All PRs will be reviewed by at least one of the FDC3 Maintainers and any appointed Editors. PRs are also open to review by FDC3 Participants.

- The FDC3 Maintainers are responsible for ensuring that the Standard Working Group has been consulted on either an issue (that provides a high-level of detail on the proposed changes) or on the PR itself, a decision has been reached that the change should be made and that that decision has been documented.

- All reviews will be completed using the Github review tool.

- A "Comment" review should be used when there are questions about the spec that should be answered, but that don't involve spec changes. This type of review does not count as approval.

- A "Changes Requested" review indicates that changes to the spec need to be made before they will be merged.

- Reviewers should update labels as needed (such as needs rebase).

- When a review is approved, the reviewer should add LGTM as a comment.

**4.4.	Responsive.** Pull request owner should try to be responsive to comments by answering questions or changing text. Once all comments have been addressed, the pull request is ready to be merged.

**4.5.	Merge or Close.**

- A pull request should stay open until a Maintainer has marked the pull request as approved.

- Pull requests can be closed by the author without merging.

- Pull requests may be closed by a Maintainer if the decision is made that it is not going to be merged.

## 5. Adoption of Contributions.
Contributions merged into the main branch of the FDC3 repository will form part of the next pre-draft of the FDC3 Standard (as defined by the [FDC3 Governance document](./GOVERNANCE.md)), which must be approved by the Standard Working Group voting participants before it is accepted as a draft and subsequently released as the next version of the Standard.


