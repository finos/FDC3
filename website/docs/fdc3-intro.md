---
id: fdc3-intro
title: Welcome to FDC3 3.1 (pre-draft)
sidebar_label: Introduction
---

The mission of the Financial Desktop Connectivity and Collaboration Consortium (FDC3) is to develop specific protocols and taxonomies to advance the ability of desktop applications in financial workflows to interoperate in a plug-and-play fashion, without prior bi-lateral agreements.

FDC3 provides an **open standard for interoperability** between applications on the financial desktop.

This includes standardized verbs to invoke actions between applications (**intents**), a standardized **context data** format, a REST-based **App Directory** standard, and standardized API operations for a **Desktop Agent**.

## Motivation

FDC3 codifies standard patterns that application developers have been using for cross-application workflows between web and native applications in the financial industry.

For more information, see [Why FDC3?](why-fdc3)

## Parts of the Standard

The [Standard](fdc3-standard) currently consists of five complementary parts:

- [API](api/spec)
- [Intents](intents/spec)
- [Context Data](context/spec)
- [App Directory](app-directory/spec)
- [Agent Bridging](agent-bridging/spec)

## Getting Started

FDC3 lets separate applications on a user's desktop work together as a single workflow. For example, when a trader selects a security in an order blotter, a chart, a news feed and a research app can all update to show that security, or the trader can open a chart for it in whichever charting app their firm uses, without the apps having been built to know about each other.

This section introduces the core concepts and walks through the most common patterns with short examples. The [API Part](api/spec) of the Standard has the full details.

### Core concepts

- **[Desktop Agent](api/spec#desktop-agent):** the service that connects applications. It may be provided by a desktop container or run inside the browser. Applications never talk to each other directly; they use the FDC3 API to talk to the Desktop Agent, which routes messages between them.
- **[Context](context/spec):** a standard JSON format for describing the things users work with, such as an [instrument](context/ref/Instrument), [contact](context/ref/Contact) or [portfolio](context/ref/Portfolio). Every context object has a `type` field, so any app can recognize it.
- **[Intents](intents/spec):** standard verbs that ask another application to do something with a piece of context, such as [`ViewChart`](intents/ref/ViewChart) or [`StartChat`](intents/ref/StartChat). The Desktop Agent finds an app that can handle the intent, asking the user to choose if there is more than one.
- **[Channels](api/spec#context-channels):** named groups that apps join to stay in sync. Context broadcast on a channel is delivered to every app listening on it. Users typically link apps together by assigning them to the same _User Channel_, often shown as a color.
- **[App Directory](app-directory/spec):** a catalog of the applications available to the user and the intents each one can handle, which the Desktop Agent uses to launch apps and resolve intents.

### Step 1: Connect to a Desktop Agent

Web applications install the [`@finos/fdc3`](https://www.npmjs.com/package/@finos/fdc3) npm package and call [`getAgent()`](api/ref/GetAgent), which finds and connects to the Desktop Agent the app is running in:

```ts
import { getAgent } from "@finos/fdc3";

const fdc3 = await getAgent();
```

The examples below use the `fdc3` object returned here.

### Step 2: Keep apps in sync with context on a channel

Broadcasting context is the simplest way to link apps. When a user selects a security in an order blotter, the blotter broadcasts it as an `fdc3.instrument` context:

```ts
const instrument = {
  type: "fdc3.instrument",
  name: "Microsoft",
  id: { ticker: "MSFT" }
};

await fdc3.broadcast(instrument);
```

A chart app on the same channel listens for instruments and updates when one arrives:

```ts
const listener = await fdc3.addContextListener("fdc3.instrument", (context) => {
  showChart(context.id.ticker);
});

// Stop listening when it is no longer needed
listener.unsubscribe();
```

Context is broadcast on the app's current User Channel. The user normally picks the channel through a channel selector provided by the Desktop Agent, and an app can also [join one itself](api/ref/DesktopAgent#joinuserchannel).

### Step 3: Ask another app to act by raising an intent

Raise an intent when the user wants a specific action, rather than simply keeping apps in sync. Here the blotter asks for a chart of the selected instrument:

```ts
const resolution = await fdc3.raiseIntent("ViewChart", instrument);
console.log(`Chart opened by ${resolution.source.appId}`);
```

The Desktop Agent opens an app that handles `ViewChart`, or delivers the request to one that is already running. The charting app registers a handler for the intent:

```ts
await fdc3.addIntentListener("ViewChart", (context) => {
  showChart(context.id.ticker);
});
```

An intent handler can also return data to the app that raised the intent. For example, a CRM that handles [`CreateInteraction`](intents/ref/CreateInteraction) returns a [transaction result](context/ref/TransactionResult) confirming the record it created, which the raising app reads with [`resolution.getResult()`](api/ref/Types#intentresolution).

### Step 4: Try it out and learn more

- Experiment with broadcasting context and raising intents in the browser using the [FDC3 Workbench](https://fdc3.finos.org/toolbox/fdc3-workbench/).
- See how these patterns combine into real workflows in the [use cases](use-cases/overview).
- Learn from FINOS and the community through the free [Introduction to FDC3](https://training.linuxfoundation.org/express-learning/introduction-to-fdc3-lfel1000/) course, the [Developing Solutions with FDC3](https://training.linuxfoundation.org/training/developing-solutions-with-fdc3-lfd237/) course and the [FDC3 Developer Training Workshop](https://youtu.be/9uUKTk2e-Xs) video. More options are listed on the [training page](/training).
- Browse the [Desktop Agent API reference](api/ref/DesktopAgent), the [context types](context/spec) and the [intents](intents/spec) for the full set of options.

## Use Cases

From its inception, the standards have been informed by real-world [business use cases](use-cases/overview), which you can view on this website, and form an important part of FDC3.

## Who is using FDC3?

The Financial Desktop Connectivity and Collaboration Consortium (FDC3) standards are created and used by [leading organizations across the financial industry](/users). For more detail on who's using FDC3, developer tools, training and examples, see the [community page](/community).

## How is FDC3 governed?

FDC3 is hosted within, and governed by the policies of, the [Fintech Open Source Foundation](http://finos.org/) (FINOS). FINOS is an independent nonprofit organization focused on promoting open innovation within financial services.

- See the [FDC3 Governance document](https://github.com/finos/FDC3/blob/main/GOVERNANCE.md) for details of how FDC3 is governed.
- See the [FDC3 Contribution Guide](https://github.com/finos/FDC3/blob/main/CONTRIBUTING.md) for details of how to contribute to FDC3.
- See the [FDC3 Charter](fdc3-charter#licensing) for details of how deliverables are licensed.

## Where should I go next?

- Have a look at the [API's supported platforms](api/supported-platforms) or [common use cases](use-cases/overview).
- Visit FDC3 [on GitHub](https://github.com/finos/FDC3).
- Download and install our [npm package](https://www.npmjs.com/package/@finos/fdc3).
- Try out an FDC3-compliant implementation, e.g. this [browser extension](https://github.com/finos/fdc3-desktop-agent).
- Join us in the [mailing list](mailto:fdc3+subscribe@finos.org) or on [Slack](https://app.slack.com/client/T01E7QRQH97/C01R0P7H5LH).
- [Participate](https://github.com/finos/FDC3#getting-involved) in the evolution of the standard.
