Feature: Basic User Channels Support

Background: Desktop Agent API
    Given A Basic API Setup

    Scenario: List User Channels    

        There should be a selection of user channels to choose from

        When I call the API "getUserChannels"
        Then the result is an array of objects with the following contents
            | id    | type              | displayMetadata.color         |
            | one   | user              | red                           |
            | two   | user              | green                         |
            | three | user              | blue                          |

    Scenario: Initial User Channel

        At startup, the user channel shouldn't be set

        When I call the API "getCurrentChannel"
        Then the result is null

    Scenario: Changing Channel

        You should be able to join a channel knowing it's ID.

        When I call the API "joinUserChannel" with parameter "one"
        When I call the API "getCurrentChannel"
        Then the result is an object with the following contents
            | id    | type              | displayMetadata.color         |
            | one   | user              | red                           |

    Scenario: Adding a Listener on a given User Channel
        Given "resultHandler" pipes context to the result
        When I call the API "joinUserChannel" with parameter "one"
        And I call the API "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
        And messaging receives a "broadcastRequest" with payload:
"""
{
    "channelId" : "one",
    "context" : {
        "type": "fdc3.instrument",
        "name": "Apple",
        "id" : {
            "ticker": "AAPL"
        }
    }
}
"""
        Then the result is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |
