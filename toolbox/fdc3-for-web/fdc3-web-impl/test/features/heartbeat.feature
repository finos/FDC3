Feature: Heartbeat Messages Between Apps and Server

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And A newly instantiated FDC3 Server with heartbeat checking

  Scenario: App Responds to heartbeats
    When "libraryApp/a1" is opened with connection id "a1"
    And "a1" sends validate
    And we wait for a period of "500" ms
    And "libraryApp/a1" sends a heartbeat response to eventUuid "a1_1"
    And we wait for a period of "500" ms
    And "libraryApp/a1" sends a heartbeat response to eventUuid "a1_2"
    And we wait for a period of "500" ms
    And "libraryApp/a1" sends a heartbeat response to eventUuid "a1_3"
    And we wait for a period of "500" ms
    And "libraryApp/a1" sends a heartbeat response to eventUuid "a1_4"
    And we wait for a period of "500" ms
    And "libraryApp/a1" sends a heartbeat response to eventUuid "a1_5"
    And we wait for a period of "500" ms
    Then I test the liveness of "libraryApp/a1"
    Then "{result}" is true
    And messaging will have outgoing posts
      | msg.matches_type | to.instanceId | to.appId   |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
    And I stop the heartbeat handler
    And I get the heartbeat times
    Then "{result}" is an array of objects with the following contents
      | instanceId | state     |
      | a1         | Connected |
    And I shutdown the server

  Scenario: App Doesn't Respond to heartbeats
  Apps are considered dead if they don't respond to a heartbeat request within 2 seconds

    When "libraryApp/a1" is opened with connection id "a1"
    And "a1" sends validate
    And we wait for a period of "3000" ms
    Then I test the liveness of "libraryApp/a1"
    Then "{result}" is false
    And messaging will have outgoing posts
      | msg.matches_type | to.instanceId | to.appId   |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
      | heartbeatEvent   | a1            | libraryApp |
    And I stop the heartbeat handler
    And I get the heartbeat times
    Then "{result}" is empty
    And I shutdown the server

  Scenario: App says Goodbye
    When "libraryApp/a1" is opened with connection id "a1"
    And "a1" sends validate
    And we wait for a period of "500" ms
    And "libraryApp/a1" sends a goodbye message
    Then I test the liveness of "libraryApp/a1"
    Then "{result}" is false
    And I shutdown the server
