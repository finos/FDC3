Feature: Client can add an event Listener

  Background:
    Given schemas loaded
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"

  Scenario: App Adds A typed Event Listener
    When "App1/a1" adds an event listener for "USER_CHANNEL_CHANGED"
    And we wait for a period of "100" ms
    And "App1/a1" removes event listener with id "uuid2"
    And we wait for a period of "100" ms
    Then messaging will have outgoing posts
      | msg.matches_type                 | to.instanceId | to.appId | msg.payload.listenerUUID |
      | addEventListenerResponse         | a1            | App1     | uuid2                    |
      | eventListenerUnsubscribeResponse | a1            | App1     | {null}                   |

  Scenario: App Adds An Untyped Event Listener
    When "App1/a1" adds an event listener for "{null}"
    And we wait for a period of "100" ms
    When "App1/a1" removes event listener with id "uuid2"
    And we wait for a period of "100" ms
    Then messaging will have outgoing posts
      | msg.matches_type                 | to.instanceId | to.appId | msg.payload.listenerUUID |
      | addEventListenerResponse         | a1            | App1     | uuid2                    |
      | eventListenerUnsubscribeResponse | a1            | App1     | {null}                   |

  Scenario: App Receives User Channel Changed Events After Registering
    When "App1/a1" adds an event listener for "USER_CHANNEL_CHANGED"
    And "App1/a1" joins user channel "one"
    Then messaging will have outgoing posts
      | msg.matches_type         | to.instanceId | to.appId | msg.payload.listenerUUID | msg.payload.newChannelId |
      | addEventListenerResponse | a1            | App1     | uuid2                    | {null}                   |
      | channelChangedEvent      | a1            | App1     | {null}                   | one                      |
      | joinUserChannelResponse  | a1            | App1     | {null}                   | {null}                   |
    And messaging will have 3 posts

  Scenario: App Receives User Channel Changed Events With An Untyped Listener
    When "App1/a1" adds an event listener for "{null}"
    And "App1/a1" joins user channel "one"
    Then messaging will have outgoing posts
      | msg.matches_type         | to.instanceId | to.appId | msg.payload.listenerUUID | msg.payload.newChannelId |
      | addEventListenerResponse | a1            | App1     | uuid2                    | {null}                   |
      | channelChangedEvent      | a1            | App1     | {null}                   | one                      |
      | joinUserChannelResponse  | a1            | App1     | {null}                   | {null}                   |
    And messaging will have 3 posts

  Scenario: App Does Not Receive User Channel Changed Events Without A Listener
    When "App1/a1" joins user channel "one"
    Then messaging will have outgoing posts
      | msg.matches_type        | to.instanceId | to.appId |
      | joinUserChannelResponse | a1            | App1     |
    And messaging will have 1 posts

  Scenario: Unsubscribe a non-existent Event Listener
    When "App1/a1" removes event listener with id "uuid-na"
    Then messaging will have outgoing posts
      | msg.matches_type                 | to.instanceId | to.appId | msg.payload.error |
      | eventListenerUnsubscribeResponse | a1            | App1     | ListenerNotFound  |
