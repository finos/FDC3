Feature: User Channels Support where the Desktop Agent puts the app on a channel

  Background: Desktop Agent API
    Given User Channels one, two and three
    Given schemas loaded
    Given A Desktop Agent in "api" that puts apps on channel "one"
    Given "instrumentMessageOne" is a BroadcastEvent message on channel "one" with context "fdc3.instrument"
    
  Scenario: Initial User Channel
        At startup, the user channel should be set

    When I call "{api}" with "getCurrentChannel"
    Then "{result}" is an object with the following contents
      | id  | type | displayMetadata.color |
      | one | user | red                   |

  Scenario: Adding a Typed Listener on a given User Channel
    Given "resultHandler" pipes context to "contexts"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | {null}            | fdc3.instrument     | addContextListenerRequest |
      | one               | fdc3.instrument     | getCurrentContextRequest  |

  Scenario: I should be able to leave a user channel, and not receive messages on it
    Given "resultHandler" pipes context to "contexts"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "{api}" with "leaveCurrentChannel"
    Then messaging will have posts
      | payload.channelId | payload.contextType | payload.listenerUUID | matches_type               |
      | {null}            | fdc3.instrument     | {null}               | addContextListenerRequest  |
      | one               | fdc3.instrument     | {null}               | getCurrentContextRequest   |
      | {null}            | {null}              | {null}               | leaveCurrentChannelRequest |
      | {null}            | {null}              | {null}               | getUserChannelsRequest     |
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type | name |
