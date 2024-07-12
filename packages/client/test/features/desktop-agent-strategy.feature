Feature: Different Strategies for Accessing the Desktop Agent

  Background: Desktop Agent API
    Given A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns "{dummy-api}"

  Scenario: Running inside an Electron Container
In this scenario, window.fdc3 is set by the electron container and returned by getAgentAPI

    Given I call getAgentAPI for a promise result
    And I refer to "result" as "theAPIPromise"
    And we wait for a period of "200" ms
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider |
      |         2.0 | Test App Id       | None     |

  Scenario: Running inside a Browser and using post message
    Given I call "getAgentAPI"
    And I refer to "{result}" as "theAPIPromise"
    Then postMessage is sent with the following contents
    And I receive a postMessage message with the following contents
      | blah  | blah  |
      | thing | thang |
    Then the promise "{theAPIPromise}" should resolve
    And "{result.getInfo()}" should be an object with the following fields
      | blah  | blah  |
      | thing | thang |

  Scenario: Failover desktop agent
    Given I call "getAgentAPI" with the following options
      | failover        | waitTimeMs |
      | {dummyFailover} |       1000 |
    Then the promise "{theAPIPromise}" should resolve
    And "{result.getInfo()}" should be an object with the following fields
      | blah  | blah  |
      | dummy | thang |
