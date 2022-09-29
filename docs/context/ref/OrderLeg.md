---
id: OrderLeg
sidebar_label: OrderLeg
title: OrderLeg
hide_title: true
---
# `OrderLeg`

A context type representing the details of an individual order leg, which MAY be used as part of an Order context when creating a new Order and MAY be transmitted separately to look up details of an existing OrderLeg.

When the OrderLeg is part of an Order context with the intent to CREATE a new Order fields MUST be populated as indicated.

When the intent is to lookup an OrderLeg in a downstream system at least one entry MUST be populated in the id field and other fields are NOT required.

## Type

`fdc3.orderLeg`

## Schema

https://fdc3.finos.org/scehmas/next/orderLeg.schema.json

| Property| Type| Required| Example
| -| -| -| -
| `type` | String | Yes | `fdc3.orderLeg`
| `id` | object | Yes | `{'OMS': '123456789-leg1'}`
| `product` | object | Yes | `{'instrument': {'ticker':'MSFT'}} \| {'productDefinition': '...'}`
| `product.instrument` | fdc3.Instrument | No | `{'instrument': {'ticker':'MSFT'}}`
| `product.productDefinition` | object | No | `{'productDefinition': '...'}`
| `quantity` | object | Yes | `{'units': 100000.00}`
| `quantity.units` | double | No | `1000000.00`
| `quantity.cashValue` | double | No | `5000000.00`
| `quantity.proceedsFrom` | string | No | `{'OMS': '123456789-leg2'}`
| `currency` | fdc3.currency | No | `{type: 'fdc3.currency', name: 'US Dollar', id: {CURRENCY_ISOCODE: "USD"}}`
| `side` | string | Yes | `'B' \| 'S' \| 'P' \| 'R'...`
| `price` | object | Yes | `{'orderType': 'limit', 'limitPrice': 123.45}`
| `price.priceType` | string | No | `'absolute' \| 'percentage' \| 'yield' \| 'spread'...`
| `price.orderType` | string | Yes | `'limit' \| 'market' \| 'stopMarket' \| 'stopLimit'...`
| `price.limitPrice` | double | No | `1.15`
| `price.stopPrice` | double | No | `1.20`
| `settlement` | object | No | `{currency: {type: 'fdc3.currency', name: 'Pound Sterling', id: {CURRENCY_ISOCODE: "GBP"}, 'date': '2022-03-30T15:44:44+00:00'}`
| `settlement.currency` | fdc3.currency | No | `{type: 'fdc3.currency', name: 'Pound Sterling', id: {CURRENCY_ISOCODE: "GBP"}`
| `settlement.date` | string | No | `'2022-03-30T15:44:44+00:00'`
| `allocations` | object[] | No | `[{'account': 'TRADEACCOUNT1', 'quantity': 1000000.00, 'positionEffect': 'O'}]`
| `allocations[i].account` | string | Yes | `TRADEACCOUNT1`
| `allocations[i].quantity` | double | No | `1000000.00`
| `allocations[i].positionEffect` | string | No | `'O' \| 'C'`
| `partyIdentifiers` |  object[] |  No | `[{'role': 'executingFirm', 'id': {'LEI': '549300UO56I4KIWC0U51'}]`
| `partyIdentifiers[i].role` | string | Yes | `'executingFirm'`
| `partyIdentifiers[i].id` | string | Yes | `{'LEI': '549300UO56I4KIWC0U51'}`
