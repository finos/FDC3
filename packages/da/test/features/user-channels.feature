Feature: Basic User Channels Support

Background: Desktop Agent API
    Given A Desktop Agent in "api"
    Given "instrumentMessageOne" is a "fdc3.instrument" broadcastRequest message on channel "one"

    Scenario: List User Channels    

        There should be a selection of user channels to choose from

        When I call "api" with "getUserChannels"
        Then "result" is an array of objects with the following contents
            | id    | type              | displayMetadata.color         |
            | one   | user              | red                           |
            | two   | user              | green                         |
            | three | user              | blue                          |

    Scenario: Initial User Channel

        At startup, the user channel shouldn't be set

        When I call "api" with "getCurrentChannel"
        Then "result" is null

    Scenario: Changing Channel

        You should be able to join a channel knowing it's ID.

        When I call "api" with "joinUserChannel" with parameter "one"
        When I call "api" with "getCurrentChannel"
        Then "result" is an object with the following contents
            | id    | type              | displayMetadata.color         |
            | one   | user              | red                           |

    Scenario: Adding a Listener on a given User Channel
        Given "resultHandler" pipes context to "contexts"
        When I call "api" with "joinUserChannel" with parameter "one"
        And I call "api" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
        And messaging receives "{instrumentMessageOne}"
        Then "contexts" is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |

    Scenario: If you haven't joined a channel, your listener receives nothing
        Given "resultHandler" pipes context to "contexts"
        When I call "api" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
        And messaging receives "{instrumentMessageOne}"
        Then "contexts" is empty

    Scenario: Adding a listener to a user channel replays Context

        Although the message is sent before the listener is added, history from the channel will get replayed

        Given "resultHandler" pipes context to "contexts"
        When messaging receives "{instrumentMessageOne}"
        And I call "api" with "joinUserChannel" with parameter "one"
        And I call "api" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
        Then "contexts" is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |

    Scenario: Joining a user channel replays Context to listeners

        Although the message is sent before the channel is joined, history from the channel will get replayed
        to the listener

        Given "resultHandler" pipes context to "contexts"
        When messaging receives "{instrumentMessageOne}"
        And I call "api" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
        And I call "api" with "joinUserChannel" with parameter "one"
        Then "contexts" is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |

    Scenario: After unsubscribing, my listener shouldn't receive any more messages

        Given "resultHandler" pipes context to "contexts"
        When I call "api" with "joinUserChannel" with parameter "one"
        And I call "api" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
        And I refer to "result" as "theListener"
        And messaging receives "{instrumentMessageOne}"
        And I call "theListener" with "unsubscribe"
        And messaging receives "{instrumentMessageOne}"
        Then "contexts" is an array of objects with the following contents
            | id.ticker    | type              | name         |
            | AAPL         | fdc3.instrument   | Apple        |
        

    Scenario: Rejoining a channel shouldn't replay context already seen


