Feature: Desktop Agent Information

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And app "chipShop/c1"

  Scenario: Getting App metadata
    When I call "{api}" with "getAppMetadata" with parameter "{c1}"
    Then "{result}" is an object with the following contents
      | appId    | name          | description          |
      | chipShop | Metadata Name | Metadata Description |

  Scenario: Getting own info
    When I call "{api}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | provider          |
      |         2.0 | cucumber-provider |
    And "{result.appMetadata}" is an object with the following contents
      | appId       | name          | description          |
      | Test App Id | Metadata Name | Metadata Description |

  Scenario: Getting instance information
    When I call "{api}" with "findInstances" with parameter "{c1}"
    Then "{result}" is an array of objects with the following contents
      | appId | instanceId |
      | One   |          1 |
      | Two   |          2 |
      | Three |          3 |

  Scenario: Checking own info caching (called twice)
    When I call "{api}" with "getInfo"
    And I call "{api}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | provider          |
      |         2.0 | cucumber-provider |
    And "{result.appMetadata}" is an object with the following contents
      | appId       | name          | description          |
      | Test App Id | Metadata Name | Metadata Description |
