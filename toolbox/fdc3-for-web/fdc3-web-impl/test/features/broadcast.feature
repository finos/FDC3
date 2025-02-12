Feature: Relaying Broadcast messages

  Background:
    Given schemas loaded
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "App2/a2" is opened with connection id "a2"

  Scenario: Broadcast message to no-one
    When "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type  |
      | broadcastResponse |
    And messaging will have 1 posts

  Scenario: Broadcast message sent to one listener
    When "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And we wait for a period of "100" ms
    And "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type           | to.appId | to.instanceId | msg.payload.channelId | msg.payload.context.type | msg.payload.context.id.ticker |
      | addContextListenerResponse | App2     | a2            | {null}                | {null}                   | {null}                        |
      | broadcastEvent             | App2     | a2            | one                   | fdc3.instrument          | AAPL                          |
      | broadcastResponse          | App1     | a1            | {null}                | {null}                   | {null}                        |

  Scenario: Broadcast message sent but listener has unsubscribed
    When "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And "App2/a2" removes context listener with id "uuid3"
    And "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type                   | to.appId | to.instanceId | msg.payload.listenerUUID |
      | addContextListenerResponse         | App2     | a2            | uuid3                    |
      | contextListenerUnsubscribeResponse | App2     | a2            | {null}                   |
      | broadcastResponse                  | App1     | a1            | {null}                   |

  Scenario: Get The Latest Context From A Channel
    Given "App1/a1" broadcasts "fdc3.instrument" on "one"
    And "App1/a1" asks for the latest context on "one" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.matches_type          | to.appId | to.instanceId | msg.payload.context.id.ticker | msg.payload.context.type |
      | getCurrentContextResponse | App1     | a1            | AAPL                          | fdc3.instrument          |
