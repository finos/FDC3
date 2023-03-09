---
sidebar_label: Intents Overview
title: Intents Overview
hide_title: true
original_id: overview
---

# Intents Overview

Extending APIs from one application to another is powerful. However, it requires bi-lateral agreements where implementors build to proprietary APIs. A standard language for interaction between applications allows us to create workflows on the fly, so that applications can discover and link to another without any prior knowledge.


FDC3 Intents define a standard set of verbs that can be used to put together common cross-application workflows on the financial desktop.
* Applications register the Intents & [Context Data](../context/spec) combinations they support in the [App Directory](../app-directory/overview)
* The App Directory supports application discovery by Intents and/or Context Data
* Intents are not full RPC, apps don’t need to enumerate every function with an intent
* FDC3 Standard Intents are a limited set, organizations can create their own intents

## Using Intents
Combined with [Context Data](../context/spec) and [App Directory](../app-directory/overview) standards, Intents enable rich service discovery on the desktop. For example:

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
