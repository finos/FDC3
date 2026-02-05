Feature: Intent Listeners

  Background: Desktop Agent API
    Given schemas loaded
    And "instrumentContext" is a "fdc3.instrument" context
    And A Desktop Agent in "api1"
    And "intentMessageOne" is a intentEvent message with intent "BuyStock" and context "{instrumentContext}"

  Scenario: Intent Listeners Work
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
      | context.type    | context.name | metadata.source.appId |
      | fdc3.instrument | Apple        | some-app-id           |
    And messaging will have posts
      | type                |
      | intentResultRequest |

  Scenario: Intent Listeners With non-matching Context does not handle message
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.order" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
      | context.type    | context.name | metadata.source.appId |
    And messaging will have posts
      | type                |

  Scenario: Intent Listeners With matching Context string does handle message
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
      | context.type    | context.name | metadata.source.appId |
      | fdc3.instrument | Apple        | some-app-id           |
    And messaging will have posts
      | type                |
      | intentResultRequest |

  Scenario: Intent Listeners With matching Context array does handle message
    Given "resultHandler" pipes intent to "intents"
    And "contextArray" is an array of contexts including "fdc3.instrument" and "fdc3.instrumentList"
    When I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "{contextArray}" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then "{intents}" is an array of objects with the following contents
      | context.type    | context.name | metadata.source.appId |
      | fdc3.instrument | Apple        | some-app-id           |
    And messaging will have posts
      | type                |
      | intentResultRequest |

  Scenario: Intent Listeners Can Return Results (Context)
    Given "resultHandler" returns a context item
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                | payload.intentResult.context.type | payload.intentResolution.intent |
      | intentResultRequest | fdc3.returned-intent              | {empty}                         |

  Scenario: Intent Listeners Can Return Results (Channel)
    Given "resultHandler" returns a channel
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                | payload.intentResult.channel.type | payload.intentResult.channel.id |
      | intentResultRequest | private                           | some-channel-id                 |

  Scenario: Intent Listeners Can Return A Void Result
    Given "resultHandler" returns a void promise
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And messaging receives "{intentMessageOne}"
    Then messaging will have posts
      | type                | payload.intentResult.channel | payload.intentResult.context |
      | intentResultRequest | {empty}                      | {empty}                      |
