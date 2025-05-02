---
id: User-Channel-Tests
sidebar_label: User Channel Tests
title: User Channel Tests
hide_title: true
---

# User Channel Tests
<!-- markdownlint-disable MD033 -->

## Basic Broadcast

| App | Step                  | Details                                                                          |
|-----|-----------------------|----------------------------------------------------------------------------------|
| A   | 1. addContextListener | A adds an _unfiltered_ Context Listener using `addContextListener(null,handler)`. <br/>A promise resolving to  a `Listener` object is returned <br />Check that this has an `unsubscribe` method. |
| A   | 2. joinUserChannel    | A joins the first available (non-global) user channel.  The available Channels are retrieved with: <br/>`fdc3.getUserChannels()` <br/> The first channel (that does not have the id 'global') is joined with: <br/>`fdc3.joinUserChannel(<channelId>)`  |
| B   | 3. joinUserChannel    | B joins the same channel as A, via the same process in 2. |
| B   | 4. Broadcast          | B broadcasts an `fdc3.instrument` context to the channel using `fdc3.broadcast(<fdc3.instrument>)`. <br/>Check a `void` promise is returned. |
| A   | 5. Receive Context    | A receives the instrument object, matching the one broadcast by B.  |

- `UCBasicUsage1` Perform above test.
- `UCBasicUsage2` Perform steps in order: 2,1,3,4,5 to confirm that the order of `joinUserChannel` and `addContextListener` calls doesn't matter.
- `UCBasicUsage3` Perform steps in order: 3,4,1,2,5 to confirm that the current context is automatically received on joining a channel.
- `UCBasicUsage4` Perform steps in order: 3,4,2,1,5  to confirm that the current context is automatically received on adding a context listener to an already joined a channel.

## Filtered Broadcast

| App | Step                  | Details                                                                          |
|-----|-----------------------|----------------------------------------------------------------------------------|
| A   | 1. addContextListener | A adds an `fdc3.instrument` _typed_ Context Listener using `addContextListener("fdc3.instrument",handler)`. <br/>A promise resolving a `Listener` object is returned <br />Check that this has an `unsubscribe` function.|
| A   | 2. joinUserChannel    | A joins the first available user channel using: <br/>`getUserChannels()` Check **user** channels are returned.<br/>Call `fdc3.joinChannel()` on the first non-global channel.|
| B   | 3. joinUserChannel    | B joins the same channel as A, via the same process in 2. |
| B   | 4. Broadcast          | B broadcasts: <br/> 1.`fdc3.broadcast(<fdc3.instrument>)`. <br/> 2. `fdc3.broadcast(<fdc3.contact>)` <br />Check a `void` promise is returned. |
| A   | 5. Receive Context    | A receives the `fdc3.instrument` object, matching the one broadcast by B. <br />Check that the `fdc3.contact` is NOT received. |

- `UCFilteredUsage1` Perform above test.
- `UCFilteredUsage2` Perform steps in order: 2,1,3,4,5.
- `UCFilteredUsage3` Perform steps in order: 3,4,1,2,5.
- `UCFilteredUsage4` Perform steps in order: 3,4,2,1,5.

## Broadcast With Multiple Listeners

| App | Step                   | Details                                                                                                     |
|-----|------------------------|-------------------------------------------------------------------------------------------------------------|
| A   | 1. addContextListeners | A sets up two Context Listeners.  One for `fdc3.instrument` and one for `fdc3.contact` by calling:  `addContextListener ("fdc3.instrument",handler)` <br/> `addContextListener("fdc3.contact",handler)` <br/>A promise resolving a `Listener` object is returned for each. <br />Check that this has an `unsubscribe` method for each.  |
| A   | 2. joinUserChannel     | A joins the first available user channel using: <br/>`getUserChannels()` Check **user** channels are returned.<br/>Call `fdc3.joinChannel()` on the first non-global channel.|
| B   | 3. joinUserChannel     | B joins the same channel as A, via the same process in 2. |
| B   | 4. Broadcast           | `fdc3.broadcast(<fdc3.instrument>)` <br/> `fdc3.broadcast(<fdc3.contact>)` . |
| A   | 5. Receive Context     | A's `fdc3.instrument` object matches the one broadcast by B, and arrives on the correct listener.<br />A's `fdc3.contact` object matches the one broadcast  by B, and arrives on the correct listener. |

- `UCFilteredUsage5`: Perform above test.
- `UCFilteredUsage6`: Perform above test, except B will join a _different_ channel to A. Check that you _don't_ receive anything.
- `UCFilteredUsageChange`: Perform above test, except that after joining, **A** changes channel to a _different_ channel via a further call to `fdc3.joinUserChannel`.  Check that **A** does NOT receive anything.
- `UCFilteredUsageUnsubscribe`: Perform above test, except that after joining, **A** then `unsubscribe()`s from the channel using the `listener.unsubscribe` function. Check that **A** does NOT receive anything.
- `UCFilteredUsageLeave`: Perform above test, except that immediately after joining, **A** _leaves the channel_, and so receives nothing.
- `UCFilteredUsageNoJoin`: Perform the above test, but skip step 2 so that **A** does NOT join a channel. Confirm that the _current channel_ for **A** is NOT set before continuing with the rest of the test.  **A** should receive nothing.

## Event on channel changed

![2.2+](https://img.shields.io/badge/FDC3-2.2+-purple) In FDC3 2.2, a new interface `addEventListener` function was added allowing an app to listen for events raised. In 2.2 only one event is supported, `userChannelChanged`.

An FDC3 Desktop Agent MUST provide a method to set the current User Channel for an application. This is often accomplished by providing a control within the user interface of a window or frame, allowing the user to select the desired channel.

As the method of setting the user channel is user interactive, it is either difficult or impossible to implement an automated test for this. Hence, manual tests should be performed as a final step in a conformance test. A separate manual test app should be provided to enable the test.

| App                 | Step                                       | Details |
|---------------------|--------------------------------------------|---------|
| ChannelChangedEvent | 1. Open the test application               | A dedicated test application for  FDC3ChannelChangedEvent should be opened. |
| ChannelChangedEvent | 2. Register for `userChannelChanged` event | `await fdc3.addEventListener("userChannelChanged", handler);`<br />The `handler` function should log or render details of events received|
| User                | 3. Set User Channel                        | The user should set the current user channel of the app and change it a few times. Details of each change should be displayed by the test app. |

- `2.2-ChannelChangedEvent`: ![2.2+](https://img.shields.io/badge/FDC3-2.2+-purple) Perform the above test.


## Broadcast With Multiple Listeners On The Same or Overlapping Types

| App | Step               | Details                                                                                                     |
|-----|--------------------|-------------------------------------------------------------------------------------------------------------|
| A   | 1.addContextListeners | A sets up two Context Listeners.  One _untyped_ and one for `fdc3.contact` by calling:  `addContextListener (null, handler1)` <br/> `addContextListener ("fdc3.contact", handler2)` <br/>![1.2](https://img.shields.io/badge/FDC3-1.2-green) A `Listener` object is returned for each.  <br />![2.0](https://img.shields.io/badge/FDC3-2.0-blue) A promise resolving a `Listener` object is returned for each. <br />Check that this has an `unsubscribe` method for each.  |
| A   | 2.joinUserChannel     |A joins the first available user channel using: <br/>![1.2](https://img.shields.io/badge/FDC3-1.2-green) `getSystemChannels()` Check channels are returned. <br/>![2.0](https://img.shields.io/badge/FDC3-2.0-blue) `getUserChannels()` Check **user** channels are returned.<br/>Call `fdc3.joinChannel()` on the first non-global channel.|
| B   | 3.joinUserChannel     |B joins the same channel as A, via the same process in 2. |
| B   | 4.Broadcast          |`fdc3.broadcast(<contact context>)` . |
| A   | 5.Receive Context    | A's `fdc3.contact` object matches the one broadcast  by B, both handlers from step 1 are triggered, and broadcast arrives on the correct listener.   |

- UCMultipleOverlappingListeners1: Perform above test
- UCMultipleOverlappingListeners2: Perform above test, but instead of _untyped_ context listener, in step 2, use `fdc3.instrument` (handler should remain different)