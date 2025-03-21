Feature: Broadcasting

  Background: Desktop Agent API
    Given schemas loaded
    Given User Channels one, two and three
    Given A Desktop Agent in "api"
    Given "instrumentMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.instrument"
    Given "countryMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.country"
    Given "instrumentContext" is a "fdc3.instrument" context

  Scenario: Broadcasting on a named app channel
    When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name | matches_type     |
      | channel-name      | fdc3.instrument      | Apple                | broadcastRequest |

  Scenario: Broadcasting using the api directly, with no user channel set
    When I call "{api}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name |

  Scenario: Broadcasting using the api directly, with user channel set
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name | matches_type             |
      | one               | {null}               | {null}               | joinUserChannelRequest   |
      | {null}            | {null}               | {null}               | getCurrentChannelRequest |
      | one               | fdc3.instrument      | Apple                | broadcastRequest         |
