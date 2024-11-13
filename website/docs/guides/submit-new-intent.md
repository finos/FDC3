---
id: SubmitNewIntent
sidebar_label: How To Submit New Intent
title: How to Submit a New Intent PR
---

## Getting Started

Prepare to submit a patch as described in [How to Contribute a Patch](https://github.com/finos/FDC3/blob/main/CONTRIBUTING.md#3how-to-contribute-a-patch) in CONTRIBUTING.md. Use the issue number and issue title as the branch name, e.g.

```git checkout -b 587-intent-proposal-view-research```

To install all the necessary packages to run the website locally, change to the website directory and run yarn

```bash
cd website
yarn
```

To run the website locally

```yarn start```

This will open the home page or browse to <https://localhost:3000>

Note that the page opens on the current release version of the docs and you will be changing the latest version. Click the version selector in the top left hand corner

![Version Selector](/assets/version_selector.png)

and then select 'Documentation' under 'Latest Version'

![Latest Version Selector](/assets/latest_version_selector.png)

The 'next' version will be indicated in the header:

![Next Version](/assets/next_version.png)

## Create Intent File

Add the new intent markdown file to docs/intents/ref. Use one of the existing intent markdown files as a template. E.g. the [ViewResearch](../intents/ref/ViewResearch) intent was created using [ViewProfile](../intents/ref/ViewProfile) as an example:

![View Research](/assets/view_research.png)

## Link to Intent File

Add links to your Intent File to the following:

- [src/intents/Intents.ts](https://github.com/finos/FDC3/blob/main/src/intents/Intents.ts)
- [src/intents/standard intents.json](https://github.com/finos/FDC3/blob/main/src/intents/standard%20intents.json)
- [website/sidebars.json](https://github.com/finos/FDC3/blob/main/website/sidebars.json) (look for the 'Intents' property and the 'ids' property within it)

At this point your new Intent should appear on the sidebar (you may need to restart yarn to get this).

Also add to:

- [docs/intents/spec.md](https://github.com/finos/FDC3/blob/main/docs/intents/spec.md) in the 'Standard Intents' section (also add the summary from your Intent page)
- Any of the Context documents in [docs/context/ref](https://github.com/finos/FDC3/blob/main/docs/context/ref) that are utilized by the Intent (e.g. for the [ViewResearch](../intents/ref/ViewResearch) intent, each of the [Contact](../context/ref/Contact), [Instrument](../context/ref/Instrument) and [Organization](../context/ref/Organization) Contexts are valid and so links were added to their Context pages)
- Any of the Intents documents in [docs/intents/ref](https://github.com/finos/FDC3/blob/main/docs/intents/ref) that are related or relevant to the new Intent (e.g. for the [ViewResearch](../intents/ref/ViewResearch) intent a link was added to the [ViewAnalysis](../intents/ref/ViewAnalysis) document)

## Finishing Off

Commit your changes and push as described in [How to Contribute a Patch](https://github.com/finos/FDC3/blob/main/CONTRIBUTING.md#3how-to-contribute-a-patch). Then submit the branch as a Pull Request (in github, go to the Branches tab and click 'New Pull Request')
