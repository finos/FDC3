Feature: Desktop Agent Information

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And app "chipShop/c1"
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: Open An App
    When I call "api" with "open" with parameters "{c1}" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | appId     | instanceId          | 
      | chipShop  | c1                  | 

   Scenario: Open An App Using App ID
    When I call "api" with "open" with parameters "chipShop" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | appId     | instanceId          | 
      | chipShop  | c1                  | 
      