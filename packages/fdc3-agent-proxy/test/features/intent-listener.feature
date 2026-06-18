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
      | fdc3.instrument | Apple        | cucumber-app           |
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
      | fdc3.instrument | Apple        | cucumber-app          |
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
      | fdc3.instrument | Apple        | cucumber-app          |
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

  Scenario: Adding a second unfiltered intent listener for the same intent throws a conflict
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    Then "{result}" is an error with message "IntentListenerConflict"

  Scenario: Adding a filtered intent listener when an unfiltered one exists throws a conflict
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.instrument" and "{resultHandler}"
    Then "{result}" is an error with message "IntentListenerConflict"

  Scenario: Adding an unfiltered intent listener when a filtered one exists throws a conflict
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.instrument" and "{resultHandler}"
    And I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    Then "{result}" is an error with message "IntentListenerConflict"

  Scenario: Adding a filtered intent listener with an overlapping context type throws a conflict
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.instrument" and "{resultHandler}"
    And I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.instrument" and "{resultHandler}"
    Then "{result}" is an error with message "IntentListenerConflict"

  Scenario: Adding filtered intent listeners for the same intent with different context types is allowed
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.instrument" and "{resultHandler}"
    And I call "{api1}" with "addIntentListenerWithContext" with parameters "BuyStock" and "fdc3.order" and "{resultHandler}"
    Then messaging will have posts
      | type                     |
      | addIntentListenerRequest |
      | addIntentListenerRequest |

  Scenario: Adding an intent listener for a different intent is allowed
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And I call "{api1}" with "addIntentListener" with parameters "SellStock" and "{resultHandler}"
    Then messaging will have posts
      | type                     |
      | addIntentListenerRequest |
      | addIntentListenerRequest |

  Scenario: An intent listener can be re-added once the conflicting listener is unsubscribed
    Given "resultHandler" pipes intent to "intents"
    When I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    And I refer to "{result}" as "firstListener"
    And I call "{firstListener}" with "unsubscribe"
    And I call "{api1}" with "addIntentListener" with parameters "BuyStock" and "{resultHandler}"
    Then "{result}" is not null
    And messaging will have posts
      | type                     |
      | addIntentListenerRequest |
