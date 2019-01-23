---
id: findIntent
sidebar_label: findIntent
title: findIntent
hide_title: true
---
# `findIntent`
Find out more information about a particular intent by passing its name, and optionally its context.

_findIntent_ is effectively granting programmatic access to the Desktop Agent's resolver. 
A promise resolving to the intent, its metadata and metadata about the apps that registered it is returned.
This can be used to raise the intent against a specific app.
 
 
 If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.
   
  ```javascript
   // I know 'StartChat' exists as a concept, and want to know more about it ...
   const appIntent = await agent.findIntent("StartChat");
   // returns a single AppIntent:
   // {
   //     intent: { name: "StartChat", displayName: "Chat" },
   //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   // }
 
   // raise the intent against a particular app
   await agent.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
   ```
   **See also** [`RaiseError`](RaiseError)