Feature: Basic Intents Support

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded
    And app "chipShop/c1" resolves intent "OrderFood" with result type "void"
    And app "chipShop/c2" resolves intent "OrderFood" with result type "channel<fdc3.chips>"
    And app "bank/b1" resolves intent "Buy" with context "fdc3.instrument" and result type "fdc3.order"
    And app "bank/b1" resolves intent "Sell" with context "fdc3.instrument" and result type "fdc3.order"
    And app "travelAgent/t1" resolves intent "BookFlight" with context "fdc3.country" and result type "fdc3.order"
    And "instrumentContext" is a "fdc3.instrument" context
    And "countryContext" is a "fdc3.country" context

  Scenario: Raising An Invalid Intent to the server (no instance)
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}" and "{c1}"
    Then "{result}" is an error with message "TargetInstanceUnavailable"
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type      |
      | Buy            | fdc3.instrument      | AAPL                      | findIntentRequest |

  Scenario: Raising An Invalid Intent to the server (no app)
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}" and "{chipShop}"
    Then "{result}" is an error with message "TargetAppUnavailable"
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type      |
      | Buy            | fdc3.instrument      | AAPL                      | findIntentRequest |

  Scenario: Raising An Invalid Intent to the server (non existent intent)
    When I call "{api}" with "raiseIntent" with parameters "NonExistentIntent" and "{instrumentContext}"
    Then "{result}" is an error with message "NoAppsFound"
    And messaging will have posts
      | payload.intent    | payload.context.type | payload.context.id.ticker | matches_type      |
      | NonExistentIntent | fdc3.instrument      | AAPL                      | findIntentRequest |

  Scenario: Raising An Invalid Intent to the server
    When I call "{api}" with "raiseIntentForContext" with parameters "{instrumentContext}" and "{t1}"
    Then "{result}" is an error with message "NoAppsFound"
    And messaging will have posts
      | payload.context.type | payload.context.id.ticker | matches_type                |
      | fdc3.instrument      | AAPL                      | findIntentsByContextRequest |

  Scenario: Raising an intent and invoking the intent resolver when it's not clear which intent is required
            The intent resolver will just take the first matching application
            that would resolve the intent.

    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | chipShop     | c1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | {null}            | {null}                 | findIntentRequest  |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: Raising Intent By Context and invoking the intent resolver when it's not clear which intent is required
            The intent resolver will just take the first matching application
            that would resolve an intent.

    When I call "{api}" with "raiseIntentForContext" with parameter "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | bank         | b1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type                |
      | {null}         | fdc3.instrument      | AAPL                      | {null}            | {null}                 | findIntentsByContextRequest |
      | Buy            | fdc3.instrument      | AAPL                      | bank              | b1                     | raiseIntentRequest          |

  Scenario: Raising Intent exactly right, so the resolver isn't required
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | bank         | b1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | Buy            | fdc3.instrument      | AAPL                      | {null}            | {null}                 | findIntentRequest  |
      | Buy            | fdc3.instrument      | AAPL                      | bank              | b1                     | raiseIntentRequest |

  Scenario: Raising Intent By Context exactly right, so the resolver isn't required
    When I call "{api}" with "raiseIntentForContext" with parameters "{countryContext}" and "{t1}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | travelAgent  | t1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.name | payload.app.appId | payload.app.instanceId | matches_type                |
      | {null}         | fdc3.country         | Sweden               | {null}            | {null}                 | findIntentsByContextRequest |
      | BookFlight     | fdc3.country         | Sweden               | travelAgent       | t1                     | raiseIntentRequest          |
