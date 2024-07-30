Feature: Intent Listeners

  Background: Desktop Agent API
    Given schemas loaded
    And "instrumentContext" is a "fdc3.instrument" context
    And A Desktop Agent in "api1"
    And "intentMessageOne" is a raiseIntentRequest message with intent "BuyStock" and context "{instrumentContext}"

  Scenario: Intent Listeners Work
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
      | context.type    | context.name | metadata.source.appId |
      | fdc3.instrument | Apple        | something             |
    And messaging will have posts
      | type                | payload.intentResolution.intent | payload.intentResolution.source.appId | matches_type        |
      | raiseIntentResponse | BuyStock                        | SomeDummyApp                          | raiseIntentResponse |

  Scenario: Intent Listeners Can Return Results (Context)
    Given "resultHandler" returns a context item
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                      | payload.intentResult.context.type | payload.intentResolution.intent | matches_type              |
      | raiseIntentResponse       | {empty}                           | BuyStock                        | raiseIntentResponse       |
      | raiseIntentResultResponse | fdc3.returned-intent              | {empty}                         | raiseIntentResultResponse |

  Scenario: Intent Listeners Can Return Results (Channel)
    Given "resultHandler" returns a channel
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                      | payload.intentResult.channel.type | payload.intentResult.channel.id | matches_type              |
      | raiseIntentResultResponse | private                           | some-channel-id                 | raiseIntentResultResponse |

  Scenario: Intent Listeners Can Return A Void Result
    Given "resultHandler" returns a void promise
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                      | payload.intentResult.channel | payload.intentResult.context | matches_type              |
      | raiseIntentResultResponse | {empty}                      | {empty}                      | raiseIntentResultResponse |
