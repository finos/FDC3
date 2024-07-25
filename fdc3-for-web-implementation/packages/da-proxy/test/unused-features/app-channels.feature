Feature: Channel Listeners Support

  Background: Desktop Agent API
    Given A Desktop Agent in "api1"
    Given "instrumentMessageOne" is a "broadcastRequest" message on channel "channel-name" with context "fdc3.instrument"
    Given "countryMessageOne" is a "broadcastRequest" message on channel "channel-name" with context "fdc3.country"
    Given "instrumentContext" is a "fdc3.instrument" context

  Scenario: Configuring two context listeners should mean they both pick up data
    Given "resultHandler" pipes context to "contexts"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "{channel1}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
      | AAPL      | fdc3.instrument | Apple |

  Scenario: I can create a listener which listens for any context type
        In this version we are using the deprecated no-args approach

    Given "resultHandler" pipes context to "contexts"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameter "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    And messaging receives "{countryMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name   |
      | fdc3.instrument | Apple  |
      | fdc3.country    | Sweden |

  Scenario: I can create a listener which listens for any context type
        In this version we are using the non-deprecated 2 args approach

    Given "resultHandler" pipes context to "contexts"
    When I call "{api1}" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    And messaging receives "{countryMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name   |
      | fdc3.instrument | Apple  |
      | fdc3.country    | Sweden |

  Scenario: I can't register an app channel with the same ID as a private channel
    When I call "{api1}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{api1}" with "getOrCreateChannel" with parameter "{privateChannel.id}"
    Then "{result}" is an error with message "AccessDenied"
