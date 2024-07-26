Feature: Basic Intents Support

  Background: Desktop Agent API
    Given schemas loaded
    And A Desktop Agent in "api"
    And app "chipShop/c1" resolves intent "OrderFood" with result type "void"
    And app "chipShop/c2" resolves intent "OrderFood" with result type "channel<fdc3.chips>"
    And app "library/l1" resolves intent "BorrowBooks" with result type "channel<fdc3.book>"
    And app "bank/b1" resolves intent "Buy" with context "fdc3.instrument" and result type "fdc3.order"
    And app "bank/b1" resolves intent "Sell" with context "fdc3.instrument" and result type "fdc3.order"
    And app "travelAgent/t1" resolves intent "Buy" with context "fdc3.currency" and result type "fdc3.order"
    And "instrumentContext" is a "fdc3.instrument" context
    And "crazyContext" is a "fdc3.unsupported" context

  Scenario: Find Intent can return the same intent with multiple apps
    When I call "{api}" with "findIntent" with parameter "Buy"
    Then "{result.intent}" is an object with the following contents
      | name |
      | Buy  |
    And "{result.apps}" is an array of objects with the following contents
      | appId       | instanceId |
      | bank        | b1         |
      | travelAgent | t1         |
    And messaging will have posts
      | payload.intent | matches_type      |
      | Buy            | findIntentRequest |

  Scenario: Find Intent can return an error when an intent doesn't match
    When I call "{api}" with "findIntent" with parameter "Bob"
    Then "{result}" is an error with message "NoAppsFound"
    And messaging will have posts
      | payload.intent | matches_type      |
      | Bob            | findIntentRequest |

  Scenario: Find Intent can filter by a context type
    When I call "{api}" with "findIntent" with parameters "Buy" and "{instrumentContext}"
    Then "{result.intent}" is an object with the following contents
      | name |
      | Buy  |
    And "{result.apps}" is an array of objects with the following contents
      | appId |
      | bank  |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type      |
      | Buy            | fdc3.instrument      | AAPL                      | findIntentRequest |

  Scenario: Find Intent can filter by generic result type
    When I call "{api}" with "findIntent" with parameters "OrderFood" and "{empty}" and "channel<fdc3.chips>"
    Then "{result.intent}" is an object with the following contents
      | name      |
      | OrderFood |
    And "{result.apps}" is an array of objects with the following contents
      | appId    | instanceId |
      | chipShop | c2         |
    And messaging will have posts
      | payload.intent | payload.resultType  | matches_type      |
      | OrderFood      | channel<fdc3.chips> | findIntentRequest |

  Scenario: Find Intents By Context
    When I call "{api}" with "findIntentsByContext" with parameter "{instrumentContext}"
    Then "{result}" is an array of objects with the following contents
      | intent.name | apps[0].appId | apps.length |
      | Buy         | bank          |           1 |
      | Sell        | bank          |           1 |
    And messaging will have posts
      | payload.context.type | payload.context.id.ticker | matches_type                |
      | fdc3.instrument      | AAPL                      | findIntentsByContextRequest |

  Scenario: Find Intents By Context can return an error when an intent doesn't match
    When I call "{api}" with "findIntentsByContext" with parameter "{crazyContext}"
    Then "{result}" is an error with message "NoAppsFound"
    And messaging will have posts
      | payload.context.type | payload.context.bogus | matches_type                |
      | fdc3.unsupported     | {true}                | findIntentsByContextRequest |
