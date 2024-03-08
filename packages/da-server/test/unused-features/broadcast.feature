Feature: Relaying Broadcast messages

  Background: 
    Given A newly instantiated FDC3 Server

  Scenario: Broadcast message to no-one
    When "App1/a1" broadcasts "fdc3.instrument" on "channel1"
    Then messaging will have outgoing posts
      | source.AppId |

  Scenario: Broadcast message sent to one listener
    When "App2/a2" adds a context listener on "channel1" with type "fdc3.instrument"
    And "App1/a1" broadcasts "fdc3.instrument" on "channel1"
    Then messaging will have outgoing posts
      | meta.source.appId | meta.source.instanceId | payload.context.type | meta.destination.appId | meta.destination.instanceId |
      | App1              | a1                     | fdc3.instrument      | App2                   | a2                          |

  Scenario: Broadcast message sent but listener has unsubscribed
    When "App2/a2" adds a context listener on "channel1" with type "fdc3.instrument"
    And "App2/a2" removes context listener on "channel1" with type "fdc3.instrument"
    And "App1/a1" broadcasts "fdc3.instrument" on "channel1"
    Then messaging will have outgoing posts
      | source.AppId | source.instanceId | payload.context.type |
