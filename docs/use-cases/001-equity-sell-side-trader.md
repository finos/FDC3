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

## First Workflow

![The “TSLA” ticker is mentioned in a chat.](/img/use-cases/2.png)


1. The user receives a message in the **chat application** containing an instrument identifier for Tesla “TSLA” (as shown above)
1. They want to do some analysis on Tesla and so see what applications are available through right clicking on the identifier for Tesla in the **chat application**.
1. A menu will appear within the **chat application** showing applications that can handle the identifier. 
1. The menu shows two apps, both for analysis; the **liquidity tool** and the **overview** 
1. The user is then able to click the menu item to open the **liquidity tool** and pass it the instrument representing Tesla.
1. The **liquidity tool** updates to show the TSLA stock’s liquidity levels.

![The user is able to push the “TSLA” ticker into the liquidity tool and see the liquidity of the stock.](/img/use-cases/3.png)


## Second Workflow


1. The user wants to do further analysis on Tesla and so they open the **overview app** that has Tesla's financial statement and other calculated financial data (such as market capitalization, P/E ratio, growth rate, earnings margins, etc). 

![The user is now looking at the TSLA stock in the Overview application.](/img/use-cases/4.png)

2. They want to see a chart of how Tesla’ share price has changed, so they pull up the action menu, which contains an option to “View Chart”
3. They click the menu item and the **charting application** opens, showing a chart of Tesla’s share price over time.

![The user is able to easily open a **chart** showing the TSLA stock.](/img/use-cases/5.png)

## Third Workflow

1. The user decides the share price for Tesla is too high, but based on recent events expects it to go down.
1. They right click to get the action menu again, and see there is an option to “Add to **watchlist**”.
1. By selecting this menu option, the **Watchlist application** activates and adds the TSLA ticker to the trader’s **watchlist**.

![The user is able to easily add a stock to the watch list.](/img/use-cases/6.png)

## Interoperability Points
- API
- Intents
- Context
