Feature: Desktop Agent Information

  Background: Desktop Agent API
    Given schemas loaded
    And A Desktop Agent in "api"
    And app "chipShop/c1"

  Scenario: Getting App metadata
    When I call "{api}" with "getAppMetadata" with parameter "{c1}"
    Then "{result}" is an object with the following contents
      | appId    | name          | description          |
      | chipShop | Metadata Name | Metadata Description |
    And messaging will have posts
      | payload.app.appId | payload.app.instanceId | matches_type          |
      | chipShop          | c1                     | getAppMetadataRequest |

  Scenario: Getting own info
    When I call "{api}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | provider          |
      |         2.0 | cucumber-provider |
    And "{result.appMetadata}" is an object with the following contents
      | appId        | instanceId        |
      | cucumber-app | cucumber-instance |

  Scenario: Getting instance information
    When I call "{api}" with "findInstances" with parameter "{c1}"
    Then "{result}" is an array of objects with the following contents
      | appId | instanceId | instanceMetadata.title |
      | One   |          1 | AAPL Stock Chart       |
      | Two   |          2 | {null}                 |
      | Three |          3 | {null}                 |
    And messaging will have posts
      | payload.app.appId | payload.app.instanceId | matches_type         |
      | chipShop          | c1                     | findInstancesRequest |

  Scenario: Setting instance metadata
    Given "instanceMeta" is instance metadata with title "AAPL Stock Chart"
    When I call "{api}" with "updateInstanceMetadata" with parameter "{instanceMeta}"
    And messaging will have posts
      | payload.instanceMetadata.title | matches_type                  |
      | AAPL Stock Chart               | updateInstanceMetadataRequest    |
