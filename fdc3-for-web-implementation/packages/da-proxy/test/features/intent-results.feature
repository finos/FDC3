Feature: Intents Can Return Different Results

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And app "chipShop/c1" resolves intent "OrderFood"
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: Context Data is returned in the result
    Given Raise Intent will return a context of "{instrumentContext}"
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |

  Scenario: App Channel is returned in the result
    Given Raise Intent will return an app channel
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | app  | result-channel |

  Scenario: User Channel is returned in the result
    Given Raise Intent will return a user channel
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | user | result-channel |

  Scenario: Private Channel is returned in the result
    Given Raise Intent will return a private channel
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type    | id             |
      | private | result-channel |
