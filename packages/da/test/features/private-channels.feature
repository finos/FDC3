Feature: Basic User Channels Support

Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And I call "api" with "createPrivateChannel"
    And I refer to "result" as "privateChannel" 

    Scenario: Adding a context listener will send a notification to the agent

        Given "contextHandler" pipes context to "context"
        When I call "privateChannel" with "addContextListener" with parameters "fdc3.instrument" and "{contextHandler}"
        Then messaging will have posts
             | type                                   | payload.channelId     | payload.contextType |
             | PrivateChannel.onAddContextListener    | {privateChannel.id}   | fdc3.instrument     |

    Scenario: Adding an "onAddContextListener" listener will send a notification to the agent

        Given "typesHandler" pipes types to "types"
        When I call "privateChannel" with "onAddContextListener" with parameter "{typesHandler}"
        Then messaging will have posts
             | type                               | payload.listenerType | payload.channelId   |
             | PrivateChannel.eventListenerAdded  | onAddContextListener | {privateChannel.id} |


    #     Given "resultHandler" pipes types to "types"
    #     When I call "api1" with "createPrivateChannel"
    #     And I refer to "result" as "private-channel"
    #     And I call "private-channel" with "onAddContextListener" with parameter "{resultHandler}"
    #     Then messaging will have posts
    #         | type                                 | payload.listenerType                   | 
    #         | PrivateChannel.eventListenerAdded    | onAddContextListener                   | 
     
    #     # Now we're going to send the message to the private channel listener

    #     Given "pcUnsubscribe" is a "PrivateChannel.onAddContextListener" message on channel "{private-channel.id}" with contextType as "fdc3.instrument"
    #     And messaging receives "{pcUnsubscribe}"
    #     Then "types" is an array of objects with the following contents
    #         | type              |
    #         | fdc3.instrument   |
