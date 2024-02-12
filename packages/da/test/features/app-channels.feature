Feature: Basic User Channels Support

Background: Desktop Agent API
    Given A Desktop Agent in "api1"
    Given "instrumentMessageOne" is a "fdc3.instrument" context

    Scenario: Creating an App Channel and Receiving A Context on it

        Given "resultHandler" pipes context to "contexts"
        When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
        And I refer to "result" as "channel1"
        And I call "channel1" with "broadcast" with parameter "{instrumentMessageOne}" 
        Then messaging receives "{instrumentMessageOne}"
    