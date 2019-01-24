# Contributing to FDC3
:+1: First off, thanks for taking the time to contribute! :+1:

# Contributor License Agreement (CLA)
A CLA is a document that specifies how a project is allowed to use your
contribution; they are commonly used in many open source projects.

**_All_ contributions to _all_ projects hosted by [FINOS](https://www.finos.org/)
must be made with a
[Foundation CLA](https://finosfoundation.atlassian.net/wiki/spaces/FINOS/pages/83034172/Contribute)
in place, and there are [additional legal requirements](https://finosfoundation.atlassian.net/wiki/spaces/FINOS/pages/75530375/Legal+Requirements)
that must also be met.**

As a result, PRs submitted to the FDC3 project cannot be accepted until you have a CLA in place with the Foundation.

# Contributing Issues

## Prerequisites

* [ ] Have you [searched for duplicates](https://github.com/FDC3/FDC3/issues?utf8=%E2%9C%93&q=)?  A simple search for exception error messages or a summary of the unexpected behaviour should suffice.
* [ ] Are you running the latest version?
* [ ] Are you sure this is a bug or missing capability?

## Raising an Issue
* Create your issue [here](https://github.com/FDC3/FDC3/issues/new).
* New issues contain two templates in the description: bug report and enhancement request. Please pick the most appropriate for your issue, **then delete the other**.
  * Please also tag the new issue with either "Bug" or "Enhancement".
* Please use [Markdown formatting](https://help.github.com/categories/writing-on-github/)
liberally to assist in readability.
  * [Code fences](https://help.github.com/articles/creating-and-highlighting-code-blocks/) for exception stack traces and log entries, for example, massively improve readability.

# Contributing Pull Requests (Code & Docs)
To make review of PRs easier, please:

 * Please make sure your PRs will merge cleanly - PRs that don't are unlikely to be accepted.
 * For code contributions, follow the existing code layout.
 * For documentation contributions, follow the general structure, language, and tone of the [existing docs](https://github.com/FDC3/FDC3/wiki).
 * Keep commits small and cohesive - if you have multiple contributions, please submit them as independent commits (and ideally as independent PRs too).
 * Reference issue #s if your PR has anything to do with an issue (even if it doesn't address it).
 * Minimise non-functional changes (e.g. whitespace shenanigans).
 * Ensure all new files include a header comment block containing the [Apache License v2.0 and your copyright information](http://www.apache.org/licenses/LICENSE-2.0#apply).
 * If necessary (e.g. due to 3rd party dependency licensing requirements), update the [NOTICE file](https://github.com/FDC3/FDC3/blob/master/NOTICE) with any new attribution or other notices


## Commit and PR Messages

* **Reference issues, wiki pages, and pull requests liberally!**
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move button left..." not "Moves button left...")
* Limit the first line to 72 characters or less
* Please start the commit message with one or more applicable emoji:

| Emoji | Raw Emoji Code | Description |
|:---:|:---:|---|
| :tada: | `:tada:` | **initial** commit |
| :construction: | `:construction:` | **WIP** (Work In Progress) commits |
| :ambulance: | `:ambulance:` | when fixing a **bug** |
| :bug: | `:bug:` | when **identifying a bug**, via an inline comment (please use the `@FIXME` tag in the comment) |
| :new: | `:new:` | when introducing **new** features |
| :art: | `:art:` | when improving the **format** / structure of the code |
| :pencil: | `:pencil:` | when **performing minor changes / fixing** the code or language |
| :ballot_box_with_check: | `:ballot_box_with_check:` | when completing a task |
| :arrow_up: | `:arrow_up:` | when upgrading **dependencies** |
| :arrow_down: | `:arrow_down:` | when downgrading **dependencies** |
| :racehorse: | `:racehorse:` | when improving **performance** |
| :fire: | `:fire:` | when **removing code** or files |
| :speaker: | `:speaker:` | when adding **logging** |
| :mute: | `:mute:` | when reducing **logging** |
| :books: | `:books:` | when writing **docs** |
| :bookmark: | `:bookmark:` | when adding a **tag** |
| :gem: | `:gem:` | new **release** |
| :zap: | `:zap:` | when introducing **backward incompatible** changes or **removing functionality** |
| :bulb: | `:bulb:` | new **idea** identified in the code, via an inline comment (please use the `@IDEA` tag in the comment) |
| :snowflake: | `:snowflake:` | changing **configuration** |
| :lipstick: | `:lipstick:` | when improving **UI** / cosmetic |
| :umbrella: | `:umbrella:` | when adding **tests** |
| :green_heart: | `:green_heart:` | when fixing the **CI** build |
| :lock: | `:lock:` | when dealing with **security** |
| :shirt: | `:shirt:` | when removing **linter** / strict / deprecation / reflection warnings |
| :fast_forward: | `:fast_forward:` | when **forward-porting features** from an older version/branch |
| :rewind: | `:rewind:` | when **backporting features** from a newer version/branch |
| :wheelchair: | `:wheelchair:` | when improving **accessibility** |
| :globe_with_meridians: | `:globe_with_meridians:` | when dealing with **globalisation** / internationalisation |
| :rocket: | `:rocket:` | anything related to deployments / **DevOps** |
| :non-potable_water: | `:non-potable_water:` | when plugging memory leaks
| :penguin: | `:penguin:` | when fixing something on **Linux** |
| :apple: | `:apple:` | when fixing something on **Mac OS** |
| :checkered_flag: | `:checkered_flag:` | when fixing something on **Windows** |
| :handbag: | `:handbag:` | when a commit contains multiple unrelated changes that don't fit into any one category (but please try not to do this!) |
