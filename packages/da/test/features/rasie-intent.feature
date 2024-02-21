
Feature:  Intent Listeners

  Background: Desktop Agent API
    Given A Desktop Agent in "api1"
    Given "intentMessageOne" is a "intentRequest" message with intent "BuyStock" and context "fdc3.instrument" 

  Scenario: 

    Given "resultHandler" pipes intent to "intents"
    When I call "api1" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And  messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
            | id.ticker    | type              | name         |