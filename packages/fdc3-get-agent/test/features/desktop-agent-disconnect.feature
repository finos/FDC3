Feature: Death of the Desktop Agent

  Background: Desktop Agent API
    Given a browser document in "document" and window in "window"

  Scenario: Loaded in the browser, but the user navigates away
    Given Parent Window desktop "da" listens for postMessage events in "{window}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    And the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    When "{window}" pagehide occurs
    Then theAgentPromise is cleared
    And I call "{document}" with "shutdown"
