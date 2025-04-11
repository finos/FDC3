---
id: spec
sidebar_label: Overview
title: Intents Overview (2.2)
---

FDC3 Intents define a standard set of verbs that, in conjunction with context data acting as nouns, can be used to put together common cross-application workflows on the financial desktop.

- Applications register the intents and [context data](../context/spec) combinations they support in the [App Directory](../app-directory/spec).
- The App Directory supports application discovery by intents and/or context data.
- Intents are not full RPC, apps don’t need to enumerate every function with an intent.
- FDC3 standard intents are a limited set, organizations can create their own intents.

## Naming Conventions

Naming of Intents SHOULD follow the below guidelines:

- Intent names should be free of non-alphanumeric characters.
- ‘.’ will be used to namespace the intent (see below).
- Intent names should be in UpperCamelCase.

:::note
The naming guidelines should be adhered to when creating future Intents.  This is to ensure they meet the criteria for addition to the FDC3 standard and to provide a consistent user experience.
:::

### Characteristics

When creating Intents they should be:

- Recognizable
  - Generally self-evident what the thing is
- Repeatable
  - Many instances across the industry
- Stateless
  - Workflows should not require callbacks or endpoints to maintain references to each other.  Once an Intent is passed to an endpoint - it controls the rest of that workflow.
- Specific
  - Terms should not be so open-ended that one endpoint could fulfill the Intent in a completely different way than another
- Distinct
  - Granular enough that Intent handlers can communicate key functional differences

### Namespaces

All standard intent names are reserved. Applications may use their own intents ad hoc.
However, there is occasionally a need for applications to ensure that their intents avoid collision, for example, where a workflow is highly specific to or internal to an application. The recommended approach is to namespace the intent with the application name. For example, the ‘myChart’ App may expose the ‘ViewChart’ intent and the ‘myChart.Foo’ proprietary intent.

### Intent Name Prefixes

Early versions of the FDC3 standard included 8 intents, which used one of two different prefixes ( `View___` and `Start___`) that are focused on UI interactions.  The prefixes are used to help define the expected behavior of an app when resolving an intent with that prefix. The list of intent name prefixes was expanded in FDC3 2.0 to include prefixes that indicate that CRUD operations should be performed on data.

#### `View___`

- Expected behavior: Content should be displayed to the user.

#### `Start___`
  
- Expected behavior: An interaction, such as a chat room or email thread, should be initiated.

As more use cases were identified it was clear further Intents were required.  FDC3 2.0 expanded this set to include the following:

#### `Create___`

- Expected behavior: A new record or entity should be created. The operation should fail if it already exists.

#### `Update___`

- Expected behavior: An existing record or entity should be updated. The operation should fail if it does not exist.

#### `CreateOrUpdate___`

- Expected behavior: A new record or entity should be created, or an existing one updated if it exists.

#### `Delete___`

- Expected behavior: An existing record or entity should be deleted. The operation should fail if it does not exist.

#### `Get___`

- Expected behavior: A record or entity should be retrieved and returned as an intent result. The operation should fail if the record does not exist.

#### `Share___`

- Expected behavior: A record or entity should shared. The operation should fail if it does not exist

## Using Intents

Combined with [context data](../context/spec) and [App Directory](../app-directory/overview) standards, intents enable rich service discovery on the desktop. For example:

### Ask for a chart to be displayed

```javascript
const result = await fdc3.raiseIntent("ViewChart", {
  type: "fdc3.instrument",
  name: "IBM",
  id: {
    ticker:"ibm"
  }
});
```

### Ask a specific application to display a chart

```javascript
const result = await fdc3.raiseIntent("ViewChart", {
  type: "fdc3.instrument",
  name: "IBM",
  id: {
    ticker:"ibm"
  }
}, "market-data-app");
```

### Find applications that can start a chat

```javascript
const intentApps = await fdc3.findIntent("StartChat");
```

### Find available intents for a contact

```javascript
const intentsAndApps = await fdc3.findIntentsByContext({
  type: "fdc3.contact",
  name: "Jane Doe",
  id: {
    email:"jane@doe.com"
  }
});
```

## Intents that return data

From FDC3 2.0, intents raised through the Desktop Agent API may return results in the form of a `Context` object or a `Channel`. Where an intent implements a transaction with another application, for example for a CRUD operation, the [`fdc3.transactionResult` context type](../context/ref/TransactionResult) SHOULD be used to provide a result status for the transaction and may wrap a context object that would otherwise be returned.

For more details on retrieving a result from a raised intent, see the [documentation for `raiseIntent`](../api/ref/DesktopAgent#raiseintent).

## Intents Standard Compliance

An FDC3 Standard compliant application that supports intents **MUST**:

- Meet the expected context and behavior defined for any FDC3-defined standard intents used.
- Where an app is intended to be launched in order to resolve a raised intent, use the [`fdc3.addIntentListener`](../api/ref/DesktopAgent#addintentlistener) API call to set up the necessary handler function(s) after it is launched. This facilitates delivery of raised intents to the application.

An FDC3 Standard compliant application that supports intents **SHOULD**:

- Prefer FDC3-defined standard intents over proprietary intents, where a suitable standardized intent is available.
- Ensure that proprietary intents follow the recommended naming conventions in the specification.
- Apply [namespacing](#namespaces) to proprietary intent names, where it is necessary to avoid collision with those created by other applications.
- Where an app is intended to be launched in order to resolve a raised intent, use the [`fdc3.addIntentListener`](../api/ref/DesktopAgent#addintentlistener) API call to set up the necessary handler function(s) within 15 seconds of the application launch (the minimum timeout Desktop Agents are required to provide) in order to be widely compatible with Desktop Agent implementations.
- Use the `fdc3.transactionResult` context type to return a status for any transactions relating to CRUD operations.

An FDC3 Standard compliant application that supports intents **MAY**:

- Define proprietary intents to support use cases not currently supported via FDC3-defined standard intents.

For more details on FDC3 Standards compliance (including the versioning, deprecation and experimental features policies) please see the [FDC3 Compliance page](../fdc3-compliance).

## Standard Intents

A list of standardized intents are defined in the following pages:

- [`CreateInteraction`](ref/CreateInteraction)
- [`CreateOrUpdateProfile`](ref/CreateOrUpdateProfile)
- [`StartCall`](ref/StartCall)
- [`StartChat`](ref/StartChat)
- [`StartEmail`](ref/StartEmail)
- [`ViewAnalysis`](ref/ViewAnalysis)
- [`ViewChat`](ref/ViewChat)
- [`ViewChart`](ref/ViewChart)
- [`ViewHoldings`](ref/ViewHoldings)
- [`ViewInstrument`](ref/ViewInstrument)
- [`ViewInteractions`](ref/ViewInteractions)
- [`ViewMessages`](ref/ViewMessages)
- [`ViewNews`](ref/ViewNews)
- [`ViewOrders`](ref/ViewOrders)
- [`ViewProfile`](ref/ViewProfile)
- [`ViewQuote`](ref/ViewQuote)
- [`ViewResearch`](ref/ViewResearch)

### Deprecated Intents

- [`ViewContact`](ref/ViewContact)

## Using Intents without a context

As the [Desktop Agent API](../api/ref/DesktopAgent) and [App Directory](../app-directory/overview) both require a context to be specified wherever intents are used, using an intent without a context is achieved through the use of the explicit `null` context type [`fdc3.nothing`](../context/ref/Nothing). By using an explicit type to represent an absence of context we allow applications to declare their support for an absence of context.

```javascript
const intentsAndApps = await fdc3.findIntentsByContext({
  type: "fdc3.nothing",
});

const result = await fdc3.raiseIntent("StartChat", {
  type: "fdc3.nothing"
});
```
