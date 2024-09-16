Feature: Heartbeats

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded

  Scenario: Send A Heartbeat
    When messaging receives a heartbeat event
    And messaging will have posts
      | matches_type             |
      | heartbeatAcknowledgement |
