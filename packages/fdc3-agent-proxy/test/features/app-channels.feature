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
        In this version we are using the deprecated 1-arg approach
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameter "{resultHandler}"
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