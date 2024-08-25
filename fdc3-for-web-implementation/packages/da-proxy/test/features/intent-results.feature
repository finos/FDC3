Feature: Intents Can Return Different Results

  Background: Desktop Agent API
    Given schemas loaded
    And A Desktop Agent in "api"
    And app "chipShop/c1" resolves intent "OrderFood"
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: void is returned in the result
    Given Raise Intent will return no result
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is undefined
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: Context Data is returned in the result
    Given Raise Intent will return a context of "{instrumentContext}"
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: App Channel is returned in the result
    Given Raise Intent will return an app channel
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | app  | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: User Channel is returned in the result
    Given Raise Intent will return a user channel
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | user | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: Private Channel is returned in the result
    Given Raise Intent will return a private channel
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type    | id             |
      | private | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |
