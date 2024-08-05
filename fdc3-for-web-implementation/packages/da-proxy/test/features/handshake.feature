Feature: Handshaking with the Desktop Agent Server

  Background:
    Given "instrumentContext" is a "fdc3.instrument" context
    And "crazyContext" is a "fdc3.unsupported" context
    And channel "one" has context "{instrumentContext}"
    And channel "two" has context "{crazyContext}"
    And A Desktop Agent in "api"

  Scenario: User Channel Synchronisation
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "getCurrentChannel"
    And I call "{result}" with "getCurrentContext" with parameter "fdc3.instrument"
    Then "{result}" is an object with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |

  Scenario: disconnection
    When I call "{api}" with "disconnect"
    Then "{result}" is undefined
