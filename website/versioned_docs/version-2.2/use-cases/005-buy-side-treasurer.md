---
id: uc-5
title: "Use Case 5: Buy side Treasurer - client rates across providers"
sidebar_label: 5. Buy side Treasurer - client rates across providers
layout: use_case
---

## Preconditions

- Several trading applications from different providers - all running
- UI which aggregates rates from different providers by entered parameters and allows to quickly execute trade with the most appropriate one

## Workflow 1

1. A Corporate Treasurer enters or chooses the required trade parameters in an aggregator app which then sends requests to different providers to subscribe to rates updates
1. The aggregator app shows screen with all the rates received from the running provider apps and updates them in real-time as soon as provider sends new rate.

![Use Case 5 Workflow](/assets/uc5.png)


## Workflow 2

1. The Treasurer chooses one option to execute from the list of rates shown in the aggregator app
1. The chosen provider app shows booking UI with pre-populated trade parameters

## Workflow 3

1. The Treasurer closes the screen with aggregated rates
1. All the providers receive notification that listener has unsubscribed and they can stop providing updates

## Required Features

- Discovery
- Ability to get invocation response as stream. Current FDC3 API proposal doesn't define API to get stream of responses

