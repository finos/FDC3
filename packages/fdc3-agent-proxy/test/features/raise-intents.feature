Feature: Basic Intents Support

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded
    And app "chipShop/c1" resolves intent "OrderFood" with result type "void"
    And app "chipShop/c2" resolves intent "OrderFood" with result type "channel<fdc3.chips>"
    And app "bank/b1" resolves intent "Buy" with context "fdc3.instrument" and result type "fdc3.order"
    And app "bank/b1" resolves intent "Sell" with context "fdc3.instrument" and result type "fdc3.order"
    And app "travelAgent/t1" resolves intent "BookFlight" with context "fdc3.country" and result type "fdc3.order"
    And app "notused/n1" resolves intent "Buy" with context "fdc3.cancel-me" and result type "fdc3.order"
    And app "notused/n2" resolves intent "Buy" with context "fdc3.cancel-me" and result type "fdc3.order"
    And "instrumentContext" is a "fdc3.instrument" context
    And "countryContext" is a "fdc3.country" context
    And "cancelContext" is a "fdc3.cancel-me" context

  Scenario: Raising an intent and invoking the intent resolver when it's not clear which intent is required
            The intent resolver will just take the first matching application
            that would resolve the intent.

    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | chipShop     | c1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | {null}                 | raiseIntentRequest |
      | OrderFood      | fdc3.instrument      | AAPL                      | c1                     | raiseIntentRequest |

  Scenario: Raising an intent and invoking the intent resolver, but the user cancels it.
    When I call "{api}" with "raiseIntent" with parameters "OrderFood" and "{cancelContext}"
    Then "{result}" is an error with message "UserCancelledResolution"
    And messaging will have posts
      | payload.intent | payload.context.type | matches_type       |
      | OrderFood      | fdc3.cancel-me       | raiseIntentRequest |

  Scenario: Raising Intent exactly right, so the resolver isn't required
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | bank         | b1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.newInstance | matches_type       |
      | Buy            | fdc3.instrument      | AAPL                      | {null}              | raiseIntentRequest |

  Scenario: Raising an intent forcing a new instance forwards newInstance true in the request payload
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}" and "{null}" and "{true}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | bank         | b1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.newInstance | matches_type       |
      | Buy            | fdc3.instrument      | {true}              | raiseIntentRequest |

  Scenario: Raising an intent requiring an existing instance forwards newInstance false in the request payload
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}" and "{null}" and "{false}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | bank         | b1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.newInstance | matches_type       |
      | Buy            | fdc3.instrument      | {false}             | raiseIntentRequest |

  Scenario: Raising an intent for context forcing a new instance forwards newInstance true in the request payload
    When I call "{api}" with "raiseIntentForContext" with parameters "{countryContext}" and "{t1}" and "{true}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | travelAgent  | t1                |
    And messaging will have posts
      | payload.context.type | payload.app.instanceId | payload.newInstance | matches_type                 |
      | fdc3.country         | t1                     | {true}              | raiseIntentForContextRequest |

  Scenario: Raising Intent By Context and invoking the intent resolver when it's not clear which intent is required
            The intent resolver will just take the first matching application
            that would resolve an intent.

    When I call "{api}" with "raiseIntentForContext" with parameter "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | chipShop     | c1                |
    And messaging will have posts
      | payload.context.type | payload.context.id.ticker | payload.app.instanceId | matches_type                 |
      | fdc3.instrument      | AAPL                      | {null}                 | raiseIntentForContextRequest |
      | fdc3.instrument      | AAPL                      | c1                     | raiseIntentRequest           |

  Scenario: Raising Intent By Context exactly right, so the resolver isn't required
    When I call "{api}" with "raiseIntentForContext" with parameters "{countryContext}" and "{t1}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | travelAgent  | t1                |
    And messaging will have posts
      | payload.context.type | payload.context.name | payload.app.appId | payload.app.instanceId | matches_type                 |
      | fdc3.country         | Sweden               | travelAgent       | t1                     | raiseIntentForContextRequest |

  Scenario: Raising an intent and invoking the intent resolver, but the user cancels it.
    When I call "{api}" with "raiseIntentForContext" with parameter "{cancelContext}"
    Then "{result}" is an error with message "UserCancelledResolution"
    And messaging will have posts
      | payload.context.type | matches_type                 |
      | fdc3.cancel-me       | raiseIntentForContextRequest |

  Scenario: Raising an intent with null app and metadata forwards traceId, signature, antiReplay and custom
    Given "intentMetadata" is metadata with traceId "trace-123" and signature "sig-abc" and antiReplay claims "1234/2345/intent-null-app-jti"
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}" and "{null}" and "{null}" and "{intentMetadata}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | bank         | b1                |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.metadata.traceId | payload.metadata.signature.signature | payload.metadata.signature.protected | payload.metadata.antiReplay.iat | payload.metadata.antiReplay.exp | payload.metadata.antiReplay.jti | payload.metadata.custom.priority | matches_type       |
      | Buy            | fdc3.instrument      | trace-123                | sig-abc (signature part)   | sig-abc (protected part)   | {1234}                          | {2345}                          | intent-null-app-jti             | high                             | raiseIntentRequest |

  Scenario: Raising an intent without metadata generates a traceId but omits signature and custom
    When I call "{api}" with "raiseIntent" with parameters "Buy" and "{instrumentContext}"
    And messaging will have posts
      | payload.intent | payload.context.type | payload.metadata.signature.signature | payload.metadata.signature.protected | payload.metadata.custom | matches_type       |
      | Buy            | fdc3.instrument      | {null}                     | {null}                     | {null}                  | raiseIntentRequest |

  Scenario: Raising an intent for context with null app and metadata forwards metadata through resolver
    Given "intentMetadata" is metadata with traceId "trace-456" and signature "sig-def" and antiReplay claims "1234/2345/intent-context-jti"
    When I call "{api}" with "raiseIntentForContext" with parameters "{countryContext}" and "{null}" and "{null}" and "{intentMetadata}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | chipShop     | c1                |
    And messaging will have posts
      | payload.context.type | payload.metadata.traceId | payload.metadata.signature.signature | payload.metadata.signature.protected | payload.metadata.antiReplay.iat | payload.metadata.antiReplay.exp | payload.metadata.antiReplay.jti | payload.metadata.custom.priority | payload.app.appId | matches_type                 |
      | fdc3.country         | trace-456                | sig-def (signature part)   | sig-def (protected part)   | {1234}                          | {2345}                          | intent-context-jti              | high                             | {null}            | raiseIntentForContextRequest |
      | fdc3.country         | trace-456                | sig-def (signature part)   | sig-def (protected part)   | {1234}                          | {2345}                          | intent-context-jti              | high                             | chipShop          | raiseIntentRequest           |
