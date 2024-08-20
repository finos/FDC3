Feature: Default Intent Resolver

  Background: Desktop Agent API
    Given a browser document in "document" and window in "window"
    And A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns a promise of "{dummy-api}"
    #And Testing ends after "5000" ms
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: App Requests Intent Resolution
    Given I call "{dummy-api}" with "raiseIntent" with parameters "viewNews" and "{instrumentContext}" for a promise
    And I refer to "{result}" as "theIntentPromise"
    And we wait for a period of "200" ms
    When "{document.iframes[1]}" receives a "SelectorMessageInitialize" message for the "intentResolver" and creates port "intentResolverPort"
    And "{intentResolverPort}" pipes messages to "output"
    And we wait for a period of "200" ms
    Then "{output}" is an array of objects with the following contents
      | type    | data.type       | data.appIntents[0].intent | data.appIntents[0].apps[0].appId | data.appIntents[0].apps[1].appId |
      | message | ResolverIntents | viewNews                  | test-app-1                       | test-app-2                       |
    When we wait for a period of "200" ms
    And "{intentResolverPort}" receives a "ResolverMessageChoice" message
    Then the promise "{theIntentPromise}" should resolve
    And "{result}" is an object with the following contents
      | intent   | target     |
      | viewNews | test-app-1 |
