---
id: spec
sidebar_label: Overview
title: Intents Overview (next)
---

FDC3 Intents define a standard set of verbs that, in conjunction with context data acting as nouns, can be used to put together common cross-application workflows on the financial desktop.
* Applications register the intents and [context data](../context/spec) combinations they support in the [App Directory](../app-directory/spec).
* The App Directory supports application discovery by intents and/or context data.
* Intents are not full RPC, apps don’t need to enumerate every function with an intent.
* FDC3 standard intents are a limited set, organizations can create their own intents.

## Naming Syntax
* Intent names should be free of non-alphanumeric characters.
* ‘.’ will be used to namespace the intent (see below).
* Intent names should be in UpperCamelCase.

## Characteristics
Intents shoulde be:
* Recognizable
    * Generally self-evident what the thing is
* Repeatable
    * Many instances across the industry
* Stateless
    * Workflows should not require callbacks or endpoints to maintain references to each other.  Once an Intent is passed to an endpoint - it controls the rest of that workflow.
* Specific
    * Terms should not be so open-ended that one endpoint could fulfill the Intent in a completely different way than another
* Distinct
    * Granular enough that Intent handlers can communicate key functional differences

## Namespaces
All standard intent names are reserved. Applications may use their own intents ad hoc.
However, there is a need for applications to ensure that their intents avoid collision. The recommended approach here is to use the app name as the noun. For example, the ‘myChart’ App may expose the ‘ViewChart’ intent and the ‘myChart.Foo’ proprietary intent.

## Using Intents
Combined with [context data](../context/overview) and [App Directory](../app-directory/overview) standards, intents enable rich service discovery on the desktop. For example:

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

## Using Intents without a context
As the [Desktop Agent API](../api/ref/DesktopAgent) and [App Directory](../app-directory/overview) both
require a context to be specified wherever intents are used, using an intent without a context is
achieved through the use of an explcit `null` context type `fdc3.nothing`. By using an explicit type
to represent a lack of context we allow applications to declare their support for a lack of 
context.

```javascript
const intentsAndApps = await fdc3.findIntentsByContext({
  type: "fdc3.nothing",
});

const result = await fdc3.raiseIntent("StartChat", {
  type: "fdc3.nothing"
});
```
