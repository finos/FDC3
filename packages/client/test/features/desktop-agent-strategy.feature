Feature: Different Strategies for Accessing the Desktop Agent

  Background: Desktop Agent API
    Given A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns "{dummy-api}"
    And a browser document in "document"
    And Parent Window listens for postMessage events

  Scenario: Running inside an Electron Container
In this scenario, window.fdc3 is set by the electron container and returned by getAgentAPI

    Given I call getAgentAPI for a promise result
    And I refer to "{result}" as "theAPIPromise"
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider |
      |         2.0 | Test App Id       | None     |
  # Scenario: Running inside a Browser and using post message
  #   And I call getAgentAPI for a promise result
  #   And I refer to "{result}" as "theAPIPromise"
  #   And we wait for a period of "200" ms
  #   Then the promise "{theAPIPromise}" should resolve
  #   And I call "{result}" with "getInfo"
  #   Then "{result}" is an object with the following contents
  #     | fdc3Version | appMetadata.appId | provider          |
  #     |         2.0 | Test App Id       | cucumber-provider |
  #   And I refer to "{document.body.children[0]}" as "channel-selector"
  #   And I refer to "{channel-selector.children[0]}" as "iframe"
  #   Then "{iframe}" is an object with the following contents
  #     | tag    | atts.name             | atts.src                                    | style.width | style.height |
  #     | iframe | FDC3 Channel Selector | http://localhost:4000/channel_selector.html |        100% |         100% |

  Scenario: Failover Strategy
# In this case, neither the window.fdc3 object nor the postMessage API is available, so the fallback strategy is used
# This results in a da-proxy which has the provider name "None"
    Given I call getAgentAPI for a promise result with the following options
      | fallbackStrategy | waitForMs |
      | {dummyFailover}  |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider |
      |         2.0 | Test App Id       | None     |
