Feature: Channel Listeners Support

  Background: Desktop Agent API
    Given schemas loaded
    Given User Channels one, two and three
    Given A Desktop Agent in "api1"
    Given "instrumentMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.instrument"
    Given "countryMessageOne" is a BroadcastEvent message on channel "channel-name" with context "fdc3.country"
    Given "instrumentContext" is a "fdc3.instrument" context
    Given "resultHandler" pipes context to "contexts"

  Scenario: Configuring two context listeners should mean they both pick up data
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
      | AAPL      | fdc3.instrument | Apple |
    Then messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | channel-name      | {null}              | getOrCreateChannelRequest |
      | channel-name      | fdc3.instrument     | addContextListenerRequest |
      | channel-name      | fdc3.instrument     | addContextListenerRequest |

  Scenario: Unsubscribing a context listener prevents it collecting data.
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "{result}" with "unsubscribe"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is empty
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type                      |
      | channel-name      | {null}              | getOrCreateChannelRequest         |
      | channel-name      | fdc3.instrument     | addContextListenerRequest         |
      | {null}            | {null}              | contextListenerUnsubscribeRequest |

  Scenario: I can create a listener which listens for any context type
        In this version we are using the non-deprecated 2 args approach
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    And messaging receives "{countryMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name   |
      | fdc3.instrument | Apple  |
      | fdc3.country    | Sweden |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | channel-name      | {null}              | getOrCreateChannelRequest |
      | channel-name      | {null}              | addContextListenerRequest |

  Scenario: Passing invalid arguments to an app channel's addContextListener fn throws an error
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    # Specific error message not tested as its not currently standardized
    # TODO: Fix when #1490 is resolved
    And I call "{channel1}" with "addContextListener" with parameters "{true}" and "{resultHandler}"
    Then "{result}" is an error
    And I call "{channel1}" with "addContextListener" with parameters "{null}" and "{true}"
    Then "{result}" is an error

  Scenario: Adding a contextCleared event listener registers it with the Desktop Agent, scoped to the channel
    Given "typesHandler" pipes events to "types"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addEventListener" with parameters "contextCleared" and "{typesHandler}"
    And we wait for a period of "100" ms
    Then messaging will have posts
      | payload.type    | payload.channelId | matches_type            |
      | CONTEXT_CLEARED | channel-name      | addEventListenerRequest |

  Scenario: Adding a "null" (wildcard) event listener on a channel registers a channel-scoped registration
    Given "typesHandler" pipes events to "types"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addEventListener" with parameters "{null}" and "{typesHandler}"
    And we wait for a period of "100" ms
    Then messaging will have posts
      | payload.type | payload.channelId | matches_type            |
      | {null}       | channel-name      | addEventListenerRequest |

  Scenario: A channel contextCleared listener receives only events for its channel
    Given "typesHandler" pipes events to "types"
    And "contextClearedMessage" is a ContextClearedEvent message on channel "channel-name" with contextType as "fdc3.instrument"
    And "otherContextClearedMessage" is a ContextClearedEvent message on channel "other-channel" with contextType as "fdc3.country"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addEventListener" with parameters "contextCleared" and "{typesHandler}"
    And messaging receives "{otherContextClearedMessage}"
    And messaging receives "{contextClearedMessage}"
    Then "{types}" is an array of objects with the following contents
      | channelId    | contextType     |
      | channel-name | fdc3.instrument |

  Scenario: Unsubscribing a channel contextCleared listener stops event delivery and notifies the Desktop Agent
    Given "typesHandler" pipes events to "types"
    And "contextClearedMessage" is a ContextClearedEvent message on channel "channel-name" with contextType as "fdc3.instrument"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addEventListener" with parameters "contextCleared" and "{typesHandler}"
    And I refer to "{result}" as "theListener"
    And we wait for a period of "100" ms
    And I call "{theListener}" with "unsubscribe"
    And messaging receives "{contextClearedMessage}"
    Then "{types}" is an array of objects with length "0"
    And messaging will have posts
      | payload.channelId | payload.listenerUUID | matches_type                    |
      | channel-name      | {null}               | addEventListenerRequest         |
      | {null}            | {theListener.id}     | eventListenerUnsubscribeRequest |

  Scenario: Passing an invalid event type to an app Channel returns InvalidArguments
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addEventListener" with parameters "unsupported" and "{resultHandler}"
    Then "{result}" is an error with message "InvalidArguments"

  Scenario: Destructured channel methods - broadcast and addContextListener
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I destructure methods "addContextListener", "broadcast" from "{channel1}"
    And I call destructured "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | channel-name      | {null}              | getOrCreateChannelRequest |
      | channel-name      | fdc3.instrument     | addContextListenerRequest |

  Scenario: Destructured getCurrentContext after broadcast
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I destructure methods "broadcast", "getCurrentContext" from "{channel1}"
    And I call destructured "broadcast" with parameter "{instrumentContext}"
    And I call destructured "getCurrentContext" with parameter "fdc3.instrument"
    Then "{result}" is an object with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |

  Scenario: Destructured listener receives filtered context
    Given "countryContext" is a "fdc3.country" context
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I destructure methods "addContextListener", "broadcast" from "{channel1}"
    And I call destructured "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |

  Scenario: App channel context listener receives source metadata
    Given "resultHandler" pipes context and metadata to "contexts" and "metadatas"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And "{metadatas}" is an array of objects with the following contents
      | source.appId      | source.instanceId     |
      | cucumber-app   | cucumber-instance |
