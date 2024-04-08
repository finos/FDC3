---
id: uc-11
title: "Use Case 11: Fine-tuning InterOp with Channels"
sidebar_label: 11. Fine-tuning InterOp with Channels
layout: use_case
---

## Persona
A user in a multi-monitor desktop environment with a fairly hectic, time-sensitive and unpredictable working day based on market movement and interactions with clients and colleagues.

## User Goal
I want to be able to create "siloed" workflows on my desktop so that I can quickly switch context to serve a client or execute a trade while still keep an eye on the general market.

## Preconditions
The end-user's app desktop environment consists of:
- an FDC3 compliant in-house application
- several FDC3-compliant vendor applications

## Workflow 1
The user's organisation maintains a coverage list in the in-house application. When selecting a company in there, the user wants a chart and a news component to update in vendor application 1, an options montage to update in vendor application 2.

## Workflow 2
In vendor application 1, the user maintains a personal watchlist. When selecting a company in there, the user wants a research portal in vendor application 3 to update as well as a trading screen in vendor application 4.

## Workflow 3
In vendor application 2, the user have a tool for ad-hoc company look ups. When selecting a company there, the user wants a chart and a news component in vendor application 1 to update (not the ones from WF 1), a detailed company report in vendor application 2 and a separate trading screen in vendor application 4 (not the one in WF2).

![Use Case 17 Workflow](/assets/uc17.png)

## Interoperability Points
- API
- Context
- Financial Objects Program
