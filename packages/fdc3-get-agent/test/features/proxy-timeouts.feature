Feature: Message exchange timeouts

  Background: Desktop Agent API
    Given a parent window document in "parentDoc", window in "parentWin", child window document in "childDoc" and window in "childWin"
    And SessionStorage is clear

  Scenario: Desktop Agent times out message exchanges when running inside a Browser with custom timeout
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response and times out message exchanges
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |    8000   | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call broadcast with an fdc3.instrument context on "{desktopAgent}" and allow 12 seconds
    Then "{result}" is an error with message "ApiTimeout"
    And I call "{desktopAgent}" with "disconnect"

  # Scenario: Desktop Agent times out app launch when running inside a Browser with custom timeout
  #   Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response, times out message exchanges and uses message exchange timeout "{1000}" ms and app launch timeout "{2000}" ms
  #   And we wait for a period of "200" ms
  #   And I call getAgent for a promise result with the following options
  #     | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
  #     | true              |    8000   | false          | false           |
  #   And I refer to "{result}" as "theAPIPromise"
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I refer to "{result}" as "desktopAgent"
  #   And I call "{desktopAgent}" with "getInfo" and allow 12 seconds
  #    Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | cucumber-app      | cucumber-provider |
  #   And I call "{desktopAgent}" with "disconnect"

  Scenario: Desktop Agent times out message exchanges when running in browser and connected via failover with custom timeout
    Given "dummyFailover" is a function which opens an iframe for communications on "{childDoc}", times out message exchanges and uses message exchange timeout "{1000}" ms and app launch timeout "{2000}" ms
    And I call getAgent for a promise result with the following options
      | failover         | timeoutMs |
      | {dummyFailover2} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call broadcast with an fdc3.instrument context on "{desktopAgent}" and allow 12 seconds
    Then "{result}" is an error with message "ApiTimeout"
    And I call "{desktopAgent}" with "disconnect"

  # Scenario: Desktop Agent times out app launch when running in browser and connected via failover with custom timeout
  #   Given "dummyFailover" is a function which opens an iframe for communications on "{childDoc}", times out message exchanges and uses message exchange timeout "{1000}" ms and app launch timeout "{2000}" ms
  #   And I call getAgent for a promise result with the following options
  #     | failover         | timeoutMs |
  #     | {dummyFailover2} |      1000 |
  #   And I refer to "{result}" as "theAPIPromise"
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I refer to "{result}" as "desktopAgent"
  #   And I call "{desktopAgent}" with "getInfo" and allow 12 seconds
  #   Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | cucumber-app      | cucumber-provider |
  #   And I call "{desktopAgent}" with "disconnect"


