---
id: intents-intro
sidebar_label: Intents Overview
title: Intents Overview
hide_title: true
---

# Intents Overview

FDC3 Intents specifications, schemas, and examples

* Extending APIs from one App to another is powerful...
* However, it requires building to a specific API ahead of time
* Using a standard language for interaction between applications using verbs (Intents) and [context] (context-intro.md) let us create workflows on the fly

FDC3 Intents define a standard set of verbs that can be used to put together common cross-application workflows on the financial desktop.
* Applications register the intents & context combinations they support in the [App directory](appd-intro)
* The App directory supports application discovery by intents and/or context
* Intents are not full RPC, apps don’t need to enumerate every function with an intent
* FDC3 Standard intents are a limited set, organizations can create their own intents

## Using Intents
Combined with [Context Data](context-intro.md) and [App Directory](appd-intro.md) standards, Intents enable rich service discovery on the the desktop. For example:

### Directing to a market data platform to show a chart
```javascript
fdc3.open("my-platform","ViewChart",{
 type:"fdc3.instrument",
 name: "IBM",
 id:{
    ticker:"ibm"
    }
  });
```

### Discovering an app that can start a chat
```javascript
fdc3.open(null,"StartChat",{
 type:"fdc3.contact",
 name: "Nick Kolba",
 id:{
    email:"nick@openfin.co"
    }
  });
```

### Discovering apps that have intents for context type "contact"
```javascript
let availableContactHandlers = fdc3.resolve(null,"contact");
```