---
id: uc-1
title: "Use Case 1: Equity sell side trader"
sidebar_label: 1. Equity sell side trader
layout: use_case
---

![A diagrammatic representation of the applications available to the trader](/img/use-cases/1.png)

On their desktop, this user has:

- Their firm's internal research & analytics platform, providing liquidity tools and internal research. The product is running and the **liquidity tool** is open.
- An installed **chat application** is running.
A **Watchlist** of stocks the trader is interested in
A third-party **Charting Application** is available that the user accesses via a browser window. This is not open. 
An **Overview** which gives pricing and fundamental data for stocks

## Workflow 1
The user receives a message in the chat application containing an instrument identifier for Tesla. They want to do some analysis on Tesla and so see what applications are available through right clicking on the identifier for Tesla. A menu will appear within the chat application showing applications that can be launched from the Messenger tool. The menu shows two apps, both for analysis; one in the internal platform, the other in the market data terminal. 

## Workflow 2
The user wants to see his firm's internal research on Tesla and so decides to open the analysis app from his internal platform. The application is launched showing all internal research available for Tesla. 

## Workflow 3
The user wants to do further analysis on Tesla and so they open (themselves) a new app in the market data terminal that has Tesla's financial statement and other calculated financial data (such as market capitalization, P/E ratio, growth rate, earnings margins, etc). The user sees the third party charting app listed in a menu in the market data terminal and decides to do some technical analysis using that app. They select the chart app, which opens in a browser window. 

## Workflow 4
Having done technical analysis in the Chart app, the user wants to do the same analysis on BMW, and also use the open pricing and fundamental app. The user creates a link between the financial statement app, the pricing data app (both in the market data terminal) and the charting app. The user changes the instrument in the financial statement app and the other applications update to show information on BMW. 

## Workflow 5
The user adds BMW and Tesla to a shared group of companies (aka a Watchlist) named "Automotive comparables" to a list within the open Watchlist. All linked applications update with the new companies.

## Interoperability Points
- API
- Intents
- Context
