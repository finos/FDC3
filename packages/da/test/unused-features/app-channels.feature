Feature: Basic User Channels Support

  Background: Desktop Agent API
    Given A Desktop Agent in "api1"
    Given "instrumentMessageOne" is a "broadcastRequest" message on channel "channel-name" with context "fdc3.instrument" 
    Given "countryMessageOne" is a "broadcastRequest" message on channel "channel-name" with context "fdc3.country" 
    Given "instrumentContext" is a "fdc3.instrument" context

    Scenario: Broadcasting on a named app channel

        When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
        And I refer to "result" as "channel1"
        And I call "channel1" with "broadcast" with parameter "{instrumentContext}"
        Then messaging will have posts
            | payload.channelId    | payload.context.type              | payload.context.name         |
            | channel-name         | fdc3.instrument                   | Apple                        |
    

  Scenario: Configuring two context listeners should mean they both pick up data

    Given "resultHandler" pipes context to "contexts"
    When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
    And I refer to "result" as "channel1"
    And I call "channel1" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "channel1" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |
            | AAPL         | fdc3.instrument   | Apple        |

    Scenario: I can create a listener which listens for any context type

        In this version we are using the deprecated no-args approach

        Given "resultHandler" pipes context to "contexts"
        When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
        And I refer to "result" as "channel1"
        And I call "channel1" with "addContextListener" with parameter "{resultHandler}"
        And messaging receives "{instrumentMessageOne}"
        And messaging receives "{countryMessageOne}"
        Then "{contexts}" is an array of objects with the following contents
                | type              | name                   |
                | fdc3.instrument   | Apple                  |
                | fdc3.country      | Sweden                 |

    Scenario: I can create a listener which listens for any context type

        In this version we are using the non-deprecated 2 args approach

        Given "resultHandler" pipes context to "contexts"
        When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
        And I refer to "result" as "channel1"
        And I call "channel1" with "addContextListener" with parameters "{null}" and "{resultHandler}"
        And messaging receives "{instrumentMessageOne}"
        And messaging receives "{countryMessageOne}"
        Then "{contexts}" is an array of objects with the following contents
                | type              | name                   |
                | fdc3.instrument   | Apple                  |
                | fdc3.country      | Sweden                 |