---
id: uc-7
title: "Use Case 7: Real-Time voice trades -> trade ticket population"
sidebar_label: "7. Real-Time voice trades -> trade ticket population"
layout: use_case
---

## Persona
- Salesperson / Trader / Broker negotiating a trade via voice (over the phone).

## Workflow
1. User is on a call with a customer.
1. User conferences in Quote / Trade service.
1. DURING the call, user dictates trade/quote prefaced by key phrase (e.g. “Confirm…”) to distinguish final quote from negotiation.
1. Real-time quote/trade transcription service turns audio into structured data breakdown of trade.
1. Structured quote/trade data delivered to quote trade capture platform, displayed to user.
1. User may edit details, or correct errors.
1. User submits ticket to quote capture service.

## Interoperability Points
The service which turns voice into structured text and metadata will need to send this data to a separate trade ticket service via FDC3 intents/contexts.

## FDC3 Working groups affected
- Intents Working Group
- Contexts Working Group
