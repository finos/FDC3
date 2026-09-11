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

  Scenario: A Desktop Agent-level CONTEXT_CLEARED listener receives events for its current User channel
    When "App1/a1" joins user channel "one"
    And "App1/a1" adds an event listener for "CONTEXT_CLEARED"
    And "App2/a2" clears context "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type    | to.instanceId | to.appId | msg.payload.channelId | msg.payload.contextType |
      | contextClearedEvent | a1            | App1     | one                   | fdc3.instrument         |
      | clearContextResponse | a2           | App2     | {null}                | {null}                  |

  Scenario: A Desktop Agent-level CONTEXT_CLEARED listener does NOT receive events for a channel it has not joined
    When "App1/a1" joins user channel "one"
    And "App1/a1" adds an event listener for "CONTEXT_CLEARED"
    And "App2/a2" clears context "fdc3.instrument" on "two"
    Then messaging will have outgoing posts
      | msg.matches_type     | to.instanceId | to.appId |
      | clearContextResponse | a2            | App2     |
    And messaging will have 3 posts

  Scenario: A wildcard Desktop Agent listener receives contextClearedEvent for its current User channel
    When "App1/a1" joins user channel "one"
    And "App1/a1" adds an event listener for "{null}"
    And "App2/a2" clears context "{null}" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type    | to.instanceId | to.appId | msg.payload.channelId | msg.payload.contextType |
      | contextClearedEvent | a1            | App1     | one                   | {null}                  |
      | clearContextResponse | a2           | App2     | {null}                | {null}                  |

  Scenario: A Channel-scoped CONTEXT_CLEARED listener receives events for that channel
    When "App2/a2" creates or gets an app channel called "appChannel"
    And "App1/a1" adds an event listener for "CONTEXT_CLEARED" on channel "appChannel"
    And "App2/a2" clears context "fdc3.instrument" on "appChannel"
    Then messaging will have outgoing posts
      | msg.matches_type     | to.instanceId | to.appId | msg.payload.channelId | msg.payload.contextType |
      | contextClearedEvent  | a1            | App1     | appChannel            | fdc3.instrument         |
      | clearContextResponse | a2            | App2     | {null}                | {null}                  |

  Scenario: An app clearing context does NOT receive its own contextClearedEvent
    When "App1/a1" joins user channel "one"
    And "App1/a1" adds an event listener for "CONTEXT_CLEARED"
    And "App1/a1" clears context "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type     | to.instanceId | to.appId |
      | clearContextResponse | a1            | App1     |

  Scenario: Registering an event listener on an unknown channel returns NoChannelFound
    When "App1/a1" adds an event listener for "CONTEXT_CLEARED" on channel "missing-channel"
    Then messaging will have outgoing posts
      | msg.type                 | to.instanceId | to.appId | msg.payload.error |
      | addEventListenerResponse | a1            | App1     | NoChannelFound    |
    And messaging will have 1 posts

  Scenario: Clearing context on an unknown channel returns NoChannelFound and emits no event
    When "App1/a1" adds an event listener for "CONTEXT_CLEARED"
    And "App1/a1" clears context "fdc3.instrument" on "missing-channel"
    Then messaging will have outgoing posts
      | msg.type                 | to.instanceId | to.appId | msg.payload.error |
      | addEventListenerResponse | a1            | App1     | {undefined}       |
      | clearContextResponse     | a1            | App1     | NoChannelFound    |
    And messaging will have 2 posts
