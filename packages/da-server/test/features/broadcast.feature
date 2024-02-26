Feature:  Relaying Broadcast messages

    Background:  Desktop Agent Server
    
    Given A Desktop Agent Server in "server"
    
    Scenario: Broadcast message to no-one

        When "App1/a1" broadcasts "fdc3.instrument" on "channel1"
        Then messaging will have outgoing posts
            | source.AppId |

    Scenario: Broadcast message sent to one listener

        When "App2/a2" adds a context listener on "channel1" with id "abc123"
        And  "App1/a1" broadcasts "fdc3.instrument" on "channel1"

        Then messaging will have outgoing posts
            | source.AppId | source.instanceId | payload.context.type |
            | App1         | a1                | fdc3.instrument      |

    Scenario: Broadcast message sent but listener has unsubscribed

        When "App2/a2" adds a context listener on "channel1" with id "abc123"
        And  "App2/a2" removes context listener with id "abc123"
        And  "App1/a1" broadcasts "fdc3.instrument" on "channel1"

        Then messaging will have outgoing posts
            | source.AppId | source.instanceId | payload.context.type |
