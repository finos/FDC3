Feature: Different Strategies for Accessing the Desktop Agent

  Background: Desktop Agent API
    Given a browser document in "document" and window in "window"
   # And Testing ends after "8000" ms

  Scenario: Running inside a Browser and using post message with direct message ports
    Given Parent Window desktop "da" listens for postMessage events in "{window}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgentAPI for a promise result with the following options
      | dontSetWindowFdc3 | timeout | intentResolver | channelSelector |
      | true              |    8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | Test App Id       | cucumber-provider |
    And I refer to "{document.body.children[0]}" as "channel-selector"
    And I refer to "{channel-selector.children[0]}" as "iframe"
    And "{window.fdc3}" is undefined
    And "{window.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP1Hello     |
      | message | WCP3Handshake |
    Then I call "{document}" with "shutdown"
    And I call "{desktopAgent}" with "disconnect"
  # Scenario: Running inside a Browser using the embedded iframe strategy
  #   Given Parent Window desktop "da" listens for postMessage events in "{window}", returns iframe response
  #   And we wait for a period of "200" ms
  #   And I call getAgentAPI for a promise result with the following options
  #     | dontSetWindowFdc3 | timeout |
  #     | false             |    8000 |
  #   And I refer to "{result}" as "theAPIPromise"
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I refer to "{result}" as "desktopAgent"
  #   And I call "{desktopAgent}" with "getInfo"
  #   Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | Test App Id       | cucumber-provider |
  #   And I refer to "{document.iframes[0]}" as "embedded-iframe"
  #   Then "{embedded-iframe}" is an object with the following contents
  #     | tag    | atts.name           | style.width | style.height |
  #     | iframe | FDC3 Communications |         0px |          0px |
  #   And I refer to "{document.iframes[1]}" as "intent-resolver-iframe"
  #   And I refer to "{document.iframes[2]}" as "channel-selector-iframe"
  #   Then "{channel-selector-iframe}" is an object with the following contents
  #     | tag    | atts.name             | atts.src                              | style.width | style.height |
  #     | iframe | FDC3 Channel Selector | https://mock.fdc3.com/channelSelector |        100% |         100% |
  #   Then "{intent-resolver-iframe}" is an object with the following contents
  #     | tag    | atts.name            | atts.src                       | style.width | style.height |
  #     | iframe | FDC3 Intent Resolver | https://mock.fdc3.com/resolver |        100% |         100% |
  #   And "{window.fdc3}" is not null
  #   And "{window.events}" is an array of objects with the following contents
  #     | type      | data.type     |
  #     | message   | WCP1Hello     |
  #     | message   | WCP2LoadUrl   |
  #     | message   | WCP3Handshake |
  #     | message   | iframeHello   |
  #     | message   | iframeHello   |
  #     | fdc3Ready | {null}        |
  #   Then I call "{document}" with "shutdown"
  #   And I call "{desktopAgent}" with "disconnect"
  # Scenario: Running inside an Electron Container.
  #   In this scenario, window.fdc3 is set by the electron container and returned by getAgentAPI
  #   Given A Dummy Desktop Agent in "dummy-api"
  #   And I call getAgentAPI for a promise result
  #   And I refer to "{result}" as "theAPIPromise"
  #   And we wait for a period of "500" ms
  #   And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I call "{result}" with "getInfo"
  #   Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | cucumber-app      | cucumber-provider |
  #   Then I call "{document}" with "shutdown"
  # Scenario: Failover Strategy.
  #   Given A Dummy Desktop Agent in "dummy-api"
  #   And "dummyFailover" is a function which returns a promise of "{dummy-api}"
  #   And I call getAgentAPI for a promise result with the following options
  #     | failover        | timeout |
  #     | {dummyFailover} |    8000 |
  #   And I refer to "{result}" as "theAPIPromise"
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I call "{result}" with "getInfo"
  #   Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | cucumber-app      | cucumber-provider |
  #   Then I call "{document}" with "shutdown"
  # Scenario: Recovery from SessionState
  # Here, we recover the details of the session from the session state, obviating the need to 
  # make a request to the parent iframe.
  # Scenario: Failed Recovery from SessionState
  # App tries to recover with an ID that doesn't exist.
