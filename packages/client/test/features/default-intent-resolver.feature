Feature: Default Intent Resolver

  Background: Desktop Agent API
    Given a browser document in "document" and window in "window"
    And A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns a promise of "{dummy-api}"
    And Testing ends after "5000" ms
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: App Requests Intent Resolution
    Given "{document.iframes[0]}" receives a "SelectorMessageInitialize" message for the intent resolver and pipes comms to "output"
    And we wait for a period of "200" ms
    And I call "{dummy-api}" with "raiseIntent" with parameters "viewNews" and "{intstrumentContext}"
    When messaging receives a {string} with payload:
