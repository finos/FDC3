Feature: App Disconnection and Cleanup

  Background:
    Given schemas loaded

  Scenario: Apps that disconnect and reconnect to the DA should receive one copy of a broadcast message from an app channel as state was cleaned up
    Given A newly instantiated FDC3 Server
    When "App1/a1" is opened with connection id "a1"
    And "App2/a2" is opened with connection id "a2"
    And "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And we wait for a period of "100" ms
    And "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type           | to.appId | to.instanceId | msg.payload.channelId | msg.payload.context.type | msg.payload.context.id.ticker |
      | addContextListenerResponse | App2     | a2            | {null}                | {null}                   | {null}                        |
      | broadcastEvent             | App2     | a2            | one                   | fdc3.instrument          | AAPL                          |
      | broadcastResponse          | App1     | a1            | {null}                | {null}                   | {null}                        |
    And "App2/a2" is closed
    And "App2/a2" is opened with connection id "a2"
    And "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And we wait for a period of "100" ms
    And "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type           | to.appId | to.instanceId | msg.payload.channelId | msg.payload.context.type | msg.payload.context.id.ticker |
      | addContextListenerResponse | App2     | a2            | {null}                | {null}                   | {null}                        |
      | broadcastEvent             | App2     | a2            | one                   | fdc3.instrument          | AAPL                          |
      | broadcastResponse          | App1     | a1            | {null}                | {null}                   | {null}                        |
  

  Scenario: Apps that disconnect and reconnect to the DA should NOT receive intent results from the previous connection as state was cleaned up
    Given "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And "App1" is an app with the following intents
      | Intent Name | Context Type    | Result Type |
      | viewNews    | fdc3.instrument | {empty}     |
    And A newly instantiated FDC3 Server
    When "LibraryApp/l1" is opened with connection id "l1"
    And "App1/a1" is opened with connection id "a1"
    And "LibraryApp/l1" registers an intent listener for "returnBook"
    And "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    And we wait for a period of "100" ms
    And "App1/a1" is closed
    And we wait for a period of "100" ms
    And "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and contextType "fdc3.book" and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | msg.meta.requestUuid | to.appId   | to.instanceId | msg.payload.raiseIntentRequestUuid | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.context.type |
      | intentEvent               | uuid7              | {null}               | LibraryApp | l1            | ABC123                             | {null}                                         | {null}                                |
      | raiseIntentResponse       | {null}             | ABC123               | App1       | a1            | {null}                             | l1                                             | {null}                                |
      | intentResultResponse      | {null}             | uuid10               | LibraryApp | l1            | {null}                             | {null}                                         | {null}                                |

Scenario: Disconnecting from the DA when subscribed to a private channel channel sends unsubscribe and disconnect messages
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "App2/a2" is opened with connection id "a2"
    And "App2/a1" creates a private channel
    #TODO: have a2 retrieve the private channel by raising an intent - its currently using a1 reference to the channel
    And I refer to "uuid3" as "channel1Id"
    When "App2/a2" adds an "disconnect" event listener on "{channel1Id}"
    And "App1/a1" adds a context listener on "{channel1Id}" with type "fdc3.instrument"
    And "App2/a2" adds an "unsubscribe" event listener on "{channel1Id}"
    And "App1/a1" is closed
    Then messaging will have outgoing posts
      | msg.matches_type                 | msg.payload.privateChannelId | msg.payload.contextType | to.appId | to.instanceId |
      | privateChannelOnUnsubscribeEvent | {channel1Id}                 | fdc3.instrument         | App2     | a2            |
      | privateChannelOnDisconnectEvent  | {channel1Id}                 | {null}                  | App2     | a2            |