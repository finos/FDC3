Feature: Heartbeats

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded

  Scenario: Send A Heartbeat
    When messaging receives a heartbeat event
    And messaging will have posts
      | matches_type                    |
      | heartbeatAcknowledgementRequest |

  Scenario: Saying Goodbye
    When I call "{api}" with "disconnect"
    And we wait for a period of "100" ms
    Then messaging will have posts
      | matches_type |
      | WCP6Goodbye  |
