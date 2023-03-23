---
id: Order
sidebar_label: Order
title: Order
hide_title: true
---
# `Order`

:::caution Experimental

**Note:** This feature has been designated as experimental to indicate that its design may change in the future.  To read more about the FDC3 experimental policy pleae visit our [Experimental Features](https://fdc3.finos.org/docs/fdc3-compliance#experimental-features) page.

:::

A context type representing the details of an order, which may be used to transmit a new order to a third party or share details of an existing order.

When the intent is to create an Order in a downstream system at least one OrderLeg MUST be populated.

When the intent is to lookup an Order in a downstream system at least one entry MUST be populated in the id field and other fields are not required.

## Type

`fdc3.order`

## Schema

https://fdc3.finos.org/scehmas/next/order.schema.json

## Details

| Property| Type| Required| Example
| -| -| -| -
| `id` | object | Yes | `{'OMS': '123456789'}`
| `id.OMS` | string | No | `'123456789'`
| `id.EMS` | string | No | `'EMSID1234'`
| `id.PMS` | string | No | `'PMS12345'`
| `sendingTime` | string | Yes | `'2022-03-30T15:44:44+00:00'`
| `timeInForce` | fdc3.timeRange| No | `{type: "fdc3.timeRange", startTime: "2020-09-01T08:00:00.000Z", endTime: "2020-10-31T08:00:00.000Z"}`
| `orderLegs` | fdc3.orderLeg[] | Yes | 
| `notes` |  String |  No


