Feature: Different Strategies for Accessing the Desktop Agent

  Background: Desktop Agent API
    Given a parent window document in "parentDoc", window in "parentWin", child window document in "childDoc" and window in "childWin"
  #  And Testing ends after "8000" ms

  Scenario: Running inside a Browser and using post message with direct message ports and no identityUrl
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |    8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I refer to "{document.body.children[0]}" as "channel-selector"
    And I refer to "{channel-selector.children[0]}" as "iframe"
    And "{childWin.fdc3}" is undefined
    And "{childWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP3Handshake |
    And "{parentWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP1Hello     |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Connecting with a specified identityUrl
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | identityUrl                              | timeoutMs | intentResolver | channelSelector |
      | true              | https://dummyOrigin.test/alternativePath | 8000     | false     | false          |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId        | appMetadata.instanceId        | provider               |
      |         2.0 | cucumber-alternative-app | cucumber-alternative-instance | cucumber-provider      |
    And "{childWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP3Handshake |
    And "{parentWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP1Hello     |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Connecting with a unknown identityUrl fails
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | identityUrl                     | timeoutMs | intentResolver | channelSelector |
      | true              | "https://bad.identity.com/path" | 4000      | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "AccessDenied"

  Scenario: Running inside a Browser using the embedded iframe strategy
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns iframe response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs |
      | false             |    8000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I refer to "{childDoc.iframes[0]}" as "embedded-iframe"
    Then "{embedded-iframe}" is an object with the following contents
      | tag    | atts.name           | style.width | style.height |
      | iframe | FDC3 Communications |         0px |          0px |
    And I refer to "{childDoc.iframes[1]}" as "intent-resolver-iframe"
    And I refer to "{childDoc.iframes[2]}" as "channel-selector-iframe"
    Then "{channel-selector-iframe}" is an object with the following contents
      | tag    | atts.name             | atts.src                              | style.width | style.height |
      | iframe | FDC3 Channel Selector | https://mock.fdc3.com/channelSelector |        100% |         100% |
    Then "{intent-resolver-iframe}" is an object with the following contents
      | tag    | atts.name            | atts.src                       | style.width | style.height |
      | iframe | FDC3 Intent Resolver | https://mock.fdc3.com/resolver |        100% |         100% |
    And "{childWin.fdc3}" is not null
    And "{childWin.events}" is an array of objects with the following contents
      | type      | data.type              |
      | message   | WCP2LoadUrl            |
      | message   | WCP3Handshake          |
      | message   | Fdc3UserInterfaceHello |
      | message   | Fdc3UserInterfaceHello |
      | fdc3Ready | {null}                 |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Running inside an Electron Container.
    In this scenario, window.fdc3 is set by the electron container and returned by getAgent

    Given A Dummy Desktop Agent in "dummy-api"
    And I call fdc3Ready for a promise result
    And I refer to "{result}" as "theAPIPromise"
    And we wait for a period of "500" ms
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"

  Scenario: Failover Strategy returning desktop agent
    Given A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns a promise of "{dummy-api}"
    And I call getAgent for a promise result with the following options
      | failover        | timeoutMs |
      | {dummyFailover} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"

  Scenario: Failover Strategy returning a proxy
    Given "dummyFailover2" is a function which opens an iframe for communications on "{childDoc}"
    And I call getAgent for a promise result with the following options
      | failover         | timeoutMs |
      | {dummyFailover2} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"

  Scenario: Recovery from SessionState
  Here, we recover the details of the session from the session state, obviating the need to 
  make a request to the parent iframe.

    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And an existing app instance in "instanceID"
    And the session identity is set to "{instanceID}" with identityUrl "https://dummyOrigin.test/path"
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |    8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"


  # Scenario: Failed Recovery from SessionState
  # App tries to recover with an ID that doesn't exist. 
  # It should be allowed to connect but issued a different instanceId
  # needs more thought to complete...
  #   Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
  #   And we wait for a period of "200" ms
  #   And the session identity is set to "BAD_INSTANCE" with identityUrl "https://dummyOrigin.test/path"
  #   And I call getAgent for a promise result with the following options
  #     | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
  #     | true              |    8000   | false          | false           |
  #   And I refer to "{result}" as "theAPIPromise"
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I call "{result}" with "getInfo"
  #   Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | cucumber-app      | cucumber-provider |
  #   Then I call "{parentDoc}" with "shutdown"
  #   Then I call "{childDoc}" with "shutdown"

  Scenario: Nothing works and we timeout
    When I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      1000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "AgentNotFound"

  Scenario: Someone calls getAgent twice
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise1"
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise2"
    Then the promise "{theAPIPromise1}" should resolve
    And I refer to "{result}" as "desktopAgent1"
    And the promise "{theAPIPromise2}" should resolve
    And I refer to "{result}" as "desktopAgent2"
    And "{desktopAgent1}" is "{desktopAgent2}"
    Then I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"
    And I call "{desktopAgent1}" with "disconnect"
