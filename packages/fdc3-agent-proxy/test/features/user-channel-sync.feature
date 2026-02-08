Feature: Updating User Channel State

  Background:
    Given schemas loaded
    Given User Channels one, two and three
    Given "instrumentContext" is a "fdc3.instrument" context
    And "crazyContext" is a "fdc3.unsupported" context
    And channel "one" has context "{instrumentContext}"
    And channel "two" has context "{crazyContext}"
    And A Desktop Agent in "api"

  Scenario: Joining A User Channel Receives Correct Context on Listener
    Given "resultHandler" pipes context to "contexts"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And we wait for a period of "1000" ms
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And I call "{api}" with "getCurrentChannel"
    And I call "{result}" with "getCurrentContext" with parameter "fdc3.instrument"
    Then "{result}" is an object with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | payload.listenerUUID | matches_type             |
      | one               | {null}              | {null}               | joinUserChannelRequest   |
      | {null}            | {null}              | {null}               | getUserChannelsRequest   |
      | one               | fdc3.instrument     | {null}               | getCurrentContextRequest |
      | {null}            | {null}              | {null}               | getCurrentChannelRequest |
      | one               | fdc3.instrument     | {null}               | getCurrentContextRequest |

  Scenario: Changing User Channel Doesn't Receive Incorrect Context on Listener
    Given "resultHandler" pipes context to "contexts"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    When I call "{api}" with "joinUserChannel" with parameter "two"
    Then "{contexts}" is an array of objects with the following contents
      | type | name |
    And I call "{api}" with "getCurrentChannel"
    And I call "{result}" with "getCurrentContext" with parameter "fdc3.instrument"
    Then "{result}" is null

  Scenario: disconnection
    When I call "{api}" with "disconnect"
    Then "{result}" is undefined
