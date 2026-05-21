Feature: Broadcasting

  Background: Desktop Agent API
    Given schemas loaded
    Given User Channels one, two and three
    Given A Desktop Agent in "api"
    Given "instrumentMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.instrument"
    Given "countryMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.country"
    Given "instrumentContext" is a "fdc3.instrument" context

  Scenario: Broadcasting on a named app channel
    When I call "{api}" with "getOrCreateChannel" using argument "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "broadcast" using argument "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name | matches_type     |
      | channel-name      | fdc3.instrument      | Apple                | broadcastRequest |

  Scenario: Broadcasting using the api directly, with no user channel set
    When I call "{api}" with "broadcast" using argument "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name |

  Scenario: Broadcasting using the api directly, with user channel set
    When I call "{api}" with "joinUserChannel" using argument "one"
    And I call "{api}" with "broadcast" using argument "{instrumentContext}"
    Then messaging will have posts
      | payload.channelId | payload.context.type | payload.context.name | matches_type             |
      | one               | {null}               | {null}               | joinUserChannelRequest   |
      | {null}            | {null}               | {null}               | getUserChannelsRequest   |
      | one               | fdc3.instrument      | Apple                | broadcastRequest         |

  Scenario: Context listener receives source metadata
    Given "resultHandler" pipes context and metadata to "contexts" and "metadatas"
    When I call "{api}" with "getOrCreateChannel" using argument "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" using arguments "fdc3.instrument" and "{resultHandler}"
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
    When I call "{api}" with "getOrCreateChannel" using argument "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" using arguments "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{fullMetadataMessage}"
    Then "{metadatas}" is an array of objects with the following contents
      | source.appId   | source.instanceId | signature     | custom.region |
      | cucumber-app   | cucumber-instance | test-sig      | EMEA          |

  Scenario: getCurrentContextWithMetadata returns context and metadata
    When I call "{api}" with "getOrCreateChannel" using argument "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "broadcast" using argument "{instrumentContext}"
    And I call "{channel1}" with "getCurrentContextWithMetadata" using argument "fdc3.instrument"
    Then "{result}" is an object with the following contents
      | context.type    | context.name | metadata.source.appId | metadata.traceId | metadata.signature | metadata.custom.key |
      | fdc3.instrument | Apple        | test-app              | test-trace-id    | test-signature     | value               |

  Scenario: getCurrentContextWithMetadata returns null for empty channel
    When I call "{api}" with "getOrCreateChannel" using argument "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "getCurrentContextWithMetadata" using argument "fdc3.instrument"
    Then "{result}" is null
