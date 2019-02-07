---
id: use-case-6
title:  "Use Case 6: Dynamic discovery in chat"
sidebar_label: Dynamic discovery in chat
layout: use_case
---

## Preconditions
- A running chat application
- Several installed trading and research apps - some running, some not running

## Workflow 1
1. User receives message with attached structured context.
2. Chat executes interop engine to resolve the list of apps / intents on user desktop which can handle the received structured context.
3. For each discovered intent a button is rendered with user-friendly title, icon and state of the target app - whether it is running or not.
4. User clicks an intent from the list to execute it.
5. The target application is started if not already running.
6. Context and the chosen intent is sent to the target app.

## Required Features
- Discovery of both running and launchable apps; *current FDC3 API proposal doesn't define API to discover launchable instances available on desktop. You can only discover running instances or launch app by its name. In the latter case you need to know exact app name, so you can't add dynamic flows when new apps can appear on user desktop and start appearing in intent list.*
- Custom intent attributes to get user-friendly names and icons of resolved intents. Current FDC3 API proposal doesn't define API to get any details about the resolved intents except their ID defined as simple string