Feature: Signing Contexts

  Background: Desktop Agent API
    Given A Mock Desktop Agent in "mock"
    Given A Signing Desktop Agent in "api" wrapping "{mock}" with Dummy Signing Middleware
    Given "instrumentContext" is a "fdc3.instrument" context
    Given "instrumentContextIH" is a "fdc3.instrument" context
    And "trueFunction" is a function which returns "{true}"

  Scenario: Call delegate functions and make sure they pass through to the underlying desktop agent
    When I call "{api}" with "open" with parameters "a" and "b"
    And I call "{api}" with "findIntent" with parameters "a" and "b" and "c"
    And I call "{api}" with "findIntentsByContext" with parameters "a" and "b"
    And I call "{api}" with "findInstances" with parameter "a"
    And I call "{api}" with "leaveCurrentChannel"
    And I call "{api}" with "getInfo"
    And I call "{api}" with "getSystemChannels"
    And I call "{api}" with "joinChannel" with parameter "a"
    And I call "{api}" with "addEventListener" with parameter "a"
    And I call "{api}" with "getAppMetadata" with parameter "a"
    Then "{api.delegate.tracking}" is an array of objects with the following contents
      | method               | args[0] | args[1] | args[2] |
      | open                 | a       | b       | {null}  |
      | findIntent           | a       | b       | c       |
      | findIntentsByContext | a       | b       | {null}  |
      | findInstances        | a       | {null}  | {null}  |
      | leaveCurrentChannel  | {null}  | {null}  | {null}  |
      | getInfo              | {null}  | {null}  | {null}  |
      | getSystemChannels    | {null}  | {null}  | {null}  |
      | joinChannel          | a       | {null}  | {null}  |
      | addEventListener     | a       | {null}  | {null}  |
      | getAppMetadata       | a       | {null}  | {null}  |
