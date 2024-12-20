Feature: Death of the Desktop Agent

  Background: Desktop Agent API
    # Given a browser document in "document" and window in "window"
    Given a parent window document in "parentDoc", window in "parentWin", child window document in "childDoc" and window in "childWin"
    #And Testing ends after "8000" ms

  Scenario: Loaded in the browser, but the user navigates away
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    And the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    When "{childWin}" pagehide occurs with persisted = "{false}"
    And we wait for a period of "200" ms
    Then The Desktop Agent receives a WCP6Goodbye message
