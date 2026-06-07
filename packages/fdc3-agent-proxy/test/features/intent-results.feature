Feature: Intents Can Return Different Results

  Background: Desktop Agent API
    Given schemas loaded
    And A Desktop Agent in "api"
    And app "chipShop/c1" resolves intent "OrderFood"
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: Raise Intent times out
    Given Raise Intent times out
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    Then "{result}" is an error with message "ApiTimeout"

  Scenario: Raise Intent Fails With An Error
    Given Raise Intent will throw a "TargetAppUnavailable" error
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    Then "{result}" is an error with message "TargetAppUnavailable"

  Scenario: void is returned in the result
    Given Raise Intent returns no result
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is undefined
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: Raising An intent With The App Parameter
    When I call "{api}" with "raiseIntent" using arguments "OrderFood", "{instrumentContext}", and "{c1}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId | intent    |
      | chipShop     | c1                | OrderFood |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: Context Data is returned in the result
    Given Raise Intent returns a context of "{instrumentContext}"
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: App Channel is returned in the result
    Given Raise Intent returns an app channel
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | app  | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: User Channel is returned in the result
    Given Raise Intent returns a user channel
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | user | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: Private Channel is returned in the result
    Given Raise Intent returns a private channel
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResult"
    Then "{result}" is an object with the following contents
      | type    | id             |
      | private | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: Destructured getResult returns context data
    Given Raise Intent returns a context of "{instrumentContext}"
    When I destructure method "raiseIntent" from "{api}"
    And I call destructured "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I destructure method "getResult" from "{result}"
    And I call destructured "getResult"
    Then "{result}" is an object with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: Destructured raiseIntent with app parameter
    When I destructure method "raiseIntent" from "{api}"
    And I call destructured "raiseIntent" using arguments "OrderFood" and "{instrumentContext}" and "{c1}"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId | intent    |
      | chipShop     | c1                | OrderFood |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | payload.app.appId | payload.app.instanceId | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | chipShop          | c1                     | raiseIntentRequest |

  Scenario: Destructured getResult returns app channel
    Given Raise Intent returns an app channel
    When I destructure method "raiseIntent" from "{api}"
    And I call destructured "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I destructure method "getResult" from "{result}"
    And I call destructured "getResult"
    Then "{result}" is an object with the following contents
      | type | id             |
      | app  | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: Destructured getResult returns private channel
    Given Raise Intent returns a private channel
    When I destructure method "raiseIntent" from "{api}"
    And I call destructured "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I destructure method "getResult" from "{result}"
    And I call destructured "getResult"
    Then "{result}" is an object with the following contents
      | type    | id             |
      | private | result-channel |
    And messaging will have posts
      | payload.intent | payload.context.type | payload.context.id.ticker | matches_type       |
      | OrderFood      | fdc3.instrument      | AAPL                      | raiseIntentRequest |

  Scenario: getResultMetadata returns DA-generated metadata for a context result
    Given Raise Intent returns a context of "{instrumentContext}"
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResultMetadata"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | some-app     | abc123            |

  Scenario: getResultMetadata returns merged metadata when ContextWithMetadata is returned
    Given Raise Intent returns a context of "{instrumentContext}" with traceId "my-trace-123" and signature "sig-abc" and antiReplay claims "1234/2345/result-jti"
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResultMetadata"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId | traceId       | signature.signature | signature.protected | antiReplay.iat | antiReplay.exp | antiReplay.jti |
      | some-app     | abc123            | my-trace-123  | sig-abc (signature part)   | sig-abc (protected part) | {1234}       | {2345}       | result-jti |

  Scenario: getResultMetadata returns DA-generated metadata for a channel result
    Given Raise Intent returns a private channel
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResultMetadata"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | some-app     | abc123            |

  Scenario: getResultMetadata returns DA-generated metadata for a void result
    Given Raise Intent returns no result
    When I call "{api}" with "raiseIntent" using arguments "OrderFood" and "{instrumentContext}"
    And I call "{result}" with "getResultMetadata"
    Then "{result}" is an object with the following contents
      | source.appId | source.instanceId |
      | some-app     | abc123            |
