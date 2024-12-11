---
id: uc-4
title: "Use Case 4: Client-side FX Trader Credit Check"
sidebar_label: 4. Client-side FX Trader Credit Check
layout: use_case
---

## Preconditions

- Running a client in-house proprietary application capable of conducting a user credit check
- Running third-party trading app (e.g. Autobahn FX)

## Workflow 1

1. The FX Trader clicks button to book a trade in the third-party trading app (e.g. Autobahn FX)
1. The trading app executes an interop action to the client in-house proprietary credit check application to check the trader's credit limit. If this check indicates the limit has been reached, the trading app presents a rejection dialog as a standard error dialog box with an informational message which may be a standard message (e.g. "Credit Limit Reached") or may include an interop link/action (provided by the credit check application) to resolve the limit breach.

![Use Case 4 Workflow](/assets/uc4.png)

## Required Features

- Point-to-point RPC invocation.  Current FDC3 API proposal doesn't define response message for "open" and "send" methods as they both returns `Promise<void>`:

https://github.com/finos/FDC3/blob/main/src/api/interface.ts#L66

https://github.com/finos/FDC3/blob/main/src/api/interface.ts#L34
