Feature: Default Intent Resolver

  Background: Desktop Agent API
    Given a parent window document in "parentDoc", window in "parentWin", child window document in "childDoc" and window in "childWin"
    And An Intent Resolver in "intent-resolver"
    And "instrumentContext" is a "fdc3.instrument" context
    And "appIntents" is an AppIntents array with a ViewNews intent and two apps

  Scenario: App Requests Intent Resolution
    Given I call "{intent-resolver}" with "chooseIntent" with parameters "{appIntents}" and "{instrumentContext}" for a promise
    And I refer to "{result}" as "theIntentPromise"
    And we wait for a period of "200" ms
    Given The intent resolver sends an intent selection message
    Then the promise "{theIntentPromise}" should resolve
    And "{result}" is an object with the following contents
      | intent   | appId.appId |
      | ViewNews | app1        |
    And I call "{intent-resolver}" with "disconnect"

  Scenario: Intent Resolution Cancelled
    Given I call "{intent-resolver}" with "chooseIntent" with parameters "{appIntents}" and "{instrumentContext}" for a promise
    And I refer to "{result}" as "theIntentPromise"
    And we wait for a period of "200" ms
    Given The intent resolver cancels the intent selection message
    Then the promise "{theIntentPromise}" should resolve
    And "{result}" is undefined
    And I call "{intent-resolver}" with "disconnect"
