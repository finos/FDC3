Feature: Basic User Channels Support

Background: Desktop Agent API
    Given A Desktop Agent in "api1"
    Given "instrumentMessageOne" is a "fdc3.instrument" broadcastRequest message on channel "channel-name"

    Scenario: Creating an App Channel and Receiving A Context on it

        Given "resultHandler" pipes context to "contexts"
        When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
        And I refer to "result" as "channel1"
        And I call "channel1" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}" 
        And messaging receives "{instrumentMessageOne}"
        Then "contexts" is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |
    