Feature: Basic User Channels Support

Background: Desktop Agent API

    Given A Desktop Agent in "api1"
    Given "instrumentOne" is a "fdc3.instrument" context

    Scenario: Broadcasting on a named app channel

        When I call "api1" with "getOrCreateChannel" with parameter "channel-name"
        And I refer to "result" as "channel1"
        And I call "channel1" with "broadcast" with parameters "{instrumentOne}" and "{resultHandler}" 
        Then messaging will have posts
            | payload.channelId    | payload.context.type              | payload.context.name         |
            | channel-name         | fdc3.instrument                   | Apple                        |
    