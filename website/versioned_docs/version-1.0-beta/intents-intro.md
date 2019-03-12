---
id: version-1.0-beta-intents-intro
sidebar_label: Intents Overview
title: Intents Overview
hide_title: true
original_id: intents-intro
---

# Intents Overview

Extending APIs from one application to another is powerful. However, it requires bi-lateral agreements where implementors build to proprietary APIs. A standard language for interaction between applications allows us to create workflows on the fly, so that applications can discover and link to another without any prior knowledge.


FDC3 Intents define a standard set of verbs that can be used to put together common cross-application workflows on the financial desktop.
* Applications register the Intents & [Context Data](context-intro) combinations they support in the [App Directory](appd-intro)
* The App Directory supports application discovery by Intents and/or Context Data
* Intents are not full RPC, apps don’t need to enumerate every function with an intent
* FDC3 Standard Intents are a limited set, organizations can create their own intents

## Using Intents
Combined with [Context Data](context-intro.md) and [App Directory](appd-intro.md) standards, Intents enable rich service discovery on the desktop. For example:

### Directing a market data platform to show a chart
```javascript
fdc3.open("my-platform","ViewChart",{
 type:"fdc3.instrument",
 name: "IBM",
 id:{
    ticker:"ibm"
    }
  });
```

### Discovering apps that can start a chat
```javascript
fdc3.raiseIntent("StartChat",{
 type:"fdc3.contact",
 name: "Nick Kolba",
 id:{
    email:"nick@openfin.co"
    }
  });
```