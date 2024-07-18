Feature: Intent Listeners

  Background: Desktop Agent API
    Given "instrumentContext" is a "fdc3.instrument" context
    Given A Desktop Agent in "api1"
    Given "intentMessageOne" is a raiseIntentRequest message with intent "BuyStock" and context "{instrumentContext}"

  Scenario: Intent Listeners Work
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
      | context.type    | context.name | metadata.source.appId |
      | fdc3.instrument | Apple        | something             |
    And messaging will have posts
      | type                | payload.intentResolution.intent |
      | raiseIntentResponse | BuyStock                        |

  Scenario: Intent Listeners Can Return Results (Context)
    Given "resultHandler" returns a context item
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                      | payload.intentResult.context.type | payload.intentResolution.intent |
      | raiseIntentResponse       | {empty}                           | BuyStock                        |
      | raiseIntentResultResponse | fdc3.returned-intent              | {empty}                         |

  Scenario: Intent Listeners Can Return Results (Channel)
    Given "resultHandler" returns a channel
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                      | payload.intentResult.channel.type | payload.intentResult.channel.id | payload.intentResult.channel.displayMetadata.color |
      | raiseIntentResultResponse | user                              | one                             | red                                                |

  Scenario: Intent Listeners Can Return A Void Result
    Given "resultHandler" returns a void promise
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                      | payload.intentResult.channel | payload.intentResult.context |
      | raiseIntentResultResponse | {empty}                      | {empty}                      |
