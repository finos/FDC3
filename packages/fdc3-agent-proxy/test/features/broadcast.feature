Feature: Broadcasting

  Background: Desktop Agent API
    Given schemas loaded
    Given User Channels one, two and three
    Given A Desktop Agent in "api"
    Given "instrumentMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.instrument"
    Given "countryMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.country"
    Given "instrumentContext" is a "fdc3.instrument" context

  Scenario: Broadcasting on a named app channel
    When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name | matches_type     |
      | channel-name      | fdc3.instrument      | Apple                | broadcastRequest |

  Scenario: Broadcasting using the api directly, with no user channel set
    When I call "{api}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name |

  Scenario: Broadcasting using the api directly, with user channel set
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name | matches_type             |
      | one               | {null}               | {null}               | joinUserChannelRequest   |
      | {null}            | {null}               | {null}               | getUserChannelsRequest   |
      | one               | fdc3.instrument      | Apple                | broadcastRequest         |

  Scenario: Context listener receives source metadata
    Given "resultHandler" pipes context and metadata to "contexts" and "metadatas"
    When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And "{metadatas}" is an array of objects with the following contents
      | source.appId      | source.instanceId     |
      | cucumber-app   | cucumber-instance |

  Scenario: Context listener receives full metadata including signature and custom
    Given "resultHandler" pipes context and metadata to "contexts" and "metadatas"
    Given "fullMetadataMessage" is a BroadcastEvent message on channel "channel-name" with context "fdc3.instrument" and metadata
    When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{fullMetadataMessage}"
    Then "{metadatas}" is an array of objects with the following contents
      | source.appId   | source.instanceId | signature.signature      | signature.protected      | custom.region |
      | cucumber-app   | cucumber-instance | test-sig (signature part) | test-sig (protected part) | EMEA          |

  Scenario: getCurrentContextWithMetadata returns context and metadata
    When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "broadcast" with parameter "{instrumentContext}"
    And I call "{channel1}" with "getCurrentContextWithMetadata" with parameter "fdc3.instrument"
    Then "{result}" is an object with the following contents
      | context.type    | context.name | metadata.source.appId | metadata.traceId | metadata.signature.signature      | metadata.signature.protected      | metadata.custom.key |
      | fdc3.instrument | Apple        | test-app              | test-trace-id    | test-signature (signature part) | test-signature (protected part) | value               |

  Scenario: getCurrentContextWithMetadata returns null for empty channel
    When I call "{api}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "getCurrentContextWithMetadata" with parameter "fdc3.instrument"
    Then "{result}" is null
