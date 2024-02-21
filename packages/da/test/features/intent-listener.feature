
Feature:  Intent Listeners

  Background: Desktop Agent API
    Given "instrumentContext" is a "fdc3.instrument" context
    Given A Desktop Agent in "api1"
    Given "intentMessageOne" is a raiseIntentRequest message with intent "BuyStock" and context "{instrumentContext}" 

  Scenario: 

    Given "resultHandler" pipes intent to "intents"
    When I call "api1" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And  messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
            | context.type    | context.name | metadata.source.appId |
            | fdc3.instrument | Apple        | something             |