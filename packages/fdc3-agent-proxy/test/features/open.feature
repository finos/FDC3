Feature: Desktop Agent Information

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded
    And app "chipShop/c1"
    And "instrumentContext" is a "fdc3.instrument" context

  Scenario: Open An App
    When I call "{api}" with "open" with parameters "{c1}" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | appId    | instanceId |
      | chipShop | abc123     |
    And messaging will have posts
      | payload.app.appId | payload.context.type | payload.context.id.ticker | matches_type |
      | chipShop          | fdc3.instrument      | AAPL                      | openRequest  |

  Scenario: Open An App Using App ID
    When I call "{api}" with "open" with parameters "chipShop" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | appId    | instanceId |
      | chipShop | abc123     |
    And messaging will have posts
      | payload.app.appId | payload.context.type | payload.context.id.ticker | matches_type |
      | chipShop          | fdc3.instrument      | AAPL                      | openRequest  |

  Scenario: Opening a non-existent App
    When I call "{api}" with "open" with parameters "nonExistent" and "{instrumentContext}"
    Then "{result}" is an error with message "AppNotFound"
    And messaging will have posts
      | payload.app.appId | payload.context.type | payload.context.id.ticker | matches_type |
      | nonExistent       | fdc3.instrument      | AAPL                      | openRequest  |

  Scenario: Open An App - Destructured
    When I destructure method "open" from "{api}"
    And I call destructured "open" with parameters "{c1}" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | appId    | instanceId |
      | chipShop | abc123     |
    And messaging will have posts
      | payload.app.appId | payload.context.type | payload.context.id.ticker | matches_type |
      | chipShop          | fdc3.instrument      | AAPL                      | openRequest  |

  Scenario: Open An App Using App ID - Destructured
    When I destructure method "open" from "{api}"
    And I call destructured "open" with parameters "chipShop" and "{instrumentContext}"
    Then "{result}" is an object with the following contents
      | appId    | instanceId |
      | chipShop | abc123     |
    And messaging will have posts
      | payload.app.appId | payload.context.type | payload.context.id.ticker | matches_type |
      | chipShop          | fdc3.instrument      | AAPL                      | openRequest  |

  Scenario: Open An App with null context and metadata
    Given "openMetadata" is metadata with traceId "trace-open" and signature "sig-open" and antiReplay claims "1234/2345/open-jti"
    When I call "{api}" with "open" with parameters "{c1}" and "{null}" and "{openMetadata}"
    Then "{result}" is an object with the following contents
      | appId    | instanceId |
      | chipShop | abc123     |
    And messaging will have posts
      | payload.app.appId | payload.context | payload.metadata.traceId | payload.metadata.signature.signature | payload.metadata.signature.protected | payload.metadata.antiReplay.iat | payload.metadata.antiReplay.exp | payload.metadata.antiReplay.jti | matches_type |
      | chipShop          | {null}          | trace-open               | sig-open (signature part)   | sig-open (protected part)   | {1234}                          | {2345}                          | open-jti                        | openRequest  |
