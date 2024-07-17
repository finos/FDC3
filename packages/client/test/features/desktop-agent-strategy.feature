Feature: Different Strategies for Accessing the Desktop Agent

  Background: Desktop Agent API
    Given A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns a promise of "{dummy-api}"
    And a browser document in "document" and window in "window"

  Scenario: Running inside a Browser and using post message with direct message ports
    Given Parent Window desktop "da" listens for postMessage events in "{window}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgentAPI for a promise result with the following options
      | setWindowGlobal | fireFdc3Ready |
      | true            | true          |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | Test App Id       | cucumber-provider |
    And I refer to "{document.body.children[0]}" as "channel-selector"
    And I refer to "{channel-selector.children[0]}" as "iframe"
    Then "{iframe}" is an object with the following contents
      | tag    | atts.name             | atts.src                                    | style.width | style.height |
      | iframe | FDC3 Channel Selector | http://localhost:4000/channel_selector.html |        100% |         100% |
    And "{window.fdc3}" is not null
    And "{window.events}" is an array of objects with the following contents
      | type      | data.type         | data.methods | data.method  |
      | message   | FDC3-API-Request  | post-message | {null}       |
      | message   | FDC3-API-Response | {null}       | message-port |
      | fdc3Ready | {null}            | {null}       | {null}       |
    Then I call "{document}" with "shutdown"

  Scenario: Running inside a Browser using the embedded iframe strategy
    Given Parent Window desktop "da" listens for postMessage events in "{window}", returns iframe response
    And we wait for a period of "200" ms
    And I call getAgentAPI for a promise result with the following options
      | setWindowGlobal | fireFdc3Ready |
      | true            | true          |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | Test App Id       | cucumber-provider |
    And I refer to "{document.body.children[0]}" as "embedded-iframe"
    Then "{embedded-iframe}" is an object with the following contents
      | tag    | atts.name           | style.width | style.height |
      | iframe | FDC3 Communications |         0px |          0px |
    And I refer to "{document.body.children[1]}" as "channel-selector"
    And I refer to "{channel-selector.children[0]}" as "channel-selector-iframe"
    Then "{channel-selector-iframe}" is an object with the following contents
      | tag    | atts.name             | atts.src                                    | style.width | style.height |
      | iframe | FDC3 Channel Selector | http://localhost:4000/channel_selector.html |        100% |         100% |
    And "{window.fdc3}" is not null
    And "{window.events}" is an array of objects with the following contents
      | type      | data.type                   | data.methods | data.method  | data.uri                                   |
      | message   | FDC3-API-Request            | post-message | {null}       | {null}                                     |
      | message   | FDC3-API-Response           | {null}       | message-port | http://localhost:8080/static/da/embed.html |
      | message   | FDC3-Port-Transfer-Response | {null}       | {null}       | {null}                                     |
      | fdc3Ready | {null}                      | {null}       | {null}       | {null}                                     |
    Then I call "{document}" with "shutdown"

  Scenario: Running inside an Electron Container.
    In this scenario, window.fdc3 is set by the electron container and returned by getAgentAPI

    Given I call getAgentAPI for a promise result
    And I refer to "{result}" as "theAPIPromise"
    And we wait for a period of "500" ms
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider |
      |         2.0 | Test App Id       | None     |
    Then I call "{document}" with "shutdown"

  Scenario: Failover Strategy.
    In this case, neither the window.fdc3 object nor the postMessage API is available, so the fallback strategy is used. 
    This results in a da-proxy which has the provider name "None"

    Given I call getAgentAPI for a promise result with the following options
      | fallbackStrategy | waitForMs |
      | {dummyFailover}  |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider |
      |         2.0 | Test App Id       | None     |
    Then I call "{document}" with "shutdown"
