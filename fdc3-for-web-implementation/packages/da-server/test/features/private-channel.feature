Feature: Relaying Private Channel Broadcast messages

  Background:
    Given A newly instantiated FDC3 Server
  # Scenario: Broadcast message to no-one
  #   When "App1/a1" broadcasts "fdc3.instrument" on private channel "channel1"
  #   Then messaging will have outgoing posts
  #     | msg.source.AppId |
  #   And messaging will have 0 posts
  # Scenario: Broadcast message sent to one listener
  #   When "App2/a2" adds a context listener on private channel "channel1" with type "fdc3.instrument"
  #   And "App1/a1" broadcasts "fdc3.instrument" on private channel "channel1"
  #   Then messaging will have outgoing posts
  #     | msg.meta.source.appId | msg.meta.source.instanceId | msg.payload.context.type | msg.meta.destination.appId | msg.meta.destination.instanceId |
  #     | App1                  | a1                         | fdc3.instrument          | App2                       | a2                              |
  # Scenario: Broadcast message sent but listener has unsubscribed
  #   When "App2/a2" adds a context listener on private channel "channel1" with type "fdc3.instrument"
  #   And "App2/a2" removes a context listener on private channel "channel1" with type "fdc3.instrument"
  #   And "App1/a1" broadcasts "fdc3.instrument" on private channel "channel1"
  #   Then messaging will have outgoing posts
  #     | msg.source.AppId | msg.source.instanceId | msg.payload.context.type |

  Scenario: Event Listener created for addContextListener
    When "App2/a2" adds an "onAddContextListener" on private channel "channel1"
    And "App2/a2" adds an "onUnsubscribe" on private channel "channel1"
    And "App2/a1" adds a context listener on private channel "channel1" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.type                            | msg.payload.channelId | msg.payload.contextType | to.appId | to.instanceId |
      | PrivateChannel.onAddContextListener | channel1              | fdc3.instrument         | App2     | a2            |
    And "App2/a1" removes a context listener on private channel "channel1" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.type                     | msg.payload.channelId | msg.payload.contextType | to.appId | to.instanceId |
      | PrivateChannel.onUnsubscribe | channel1              | fdc3.instrument         | App2     | a2            |

  Scenario: Event Listener for channel disconnect
    When "App2/a2" adds an "onDisconnect" on private channel "channel1"
    And "App2/a1" adds a context listener on private channel "channel1" with type "fdc3.instrument"
    And "App2/a2" adds an "onUnsubscribe" on private channel "channel1"
    And "App2/a1" disconnects from private channel "channel1"
    Then messaging will have outgoing posts
      | msg.type                     | msg.payload.channelId | to.appId | to.instanceId |
      | PrivateChannel.onUnsubscribe | channel1              | App2     | a2            |
      | PrivateChannel.onDisconnect  | channel1              | App2     | a2            |

  Scenario: Event Listener removed addContextListener
    When "App2/a2" adds an "onAddContextListener" on private channel "channel1"
    And "App2/a2" removes an "onAddContextListener" on private channel "channel1"
    And "App2/a1" adds a context listener on private channel "channel1" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.type | msg.payload.channelId | msg.payload.contextType | to.appId | to.instanceId |

  Scenario: I can't register an app channel with the same ID as a private channel
    When I call "{api1}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{api1}" with "getOrCreateChannel" with parameter "{privateChannel.id}"
    Then "{result}" is an error with message "AccessDenied"

  Scenario: When disconnecting, a disconnect message is sent and unsubscribe is sent from each listener.
    Given "typesHandler" pipes types to "types"
    When I call "{privateChannel}" with "onAddContextListener" with parameter "{typesHandler}"
    And I call "{privateChannel}" with "onUnsubscribe" with parameter "{typesHandler}"
    And we wait for a period of "100" ms
    And I call "{privateChannel}" with "disconnect"
    Then messaging will have posts
      | type                                | payload.channelId   | payload.listenerType |
      | PrivateChannel.eventListenerAdded   | {privateChannel.id} | onAddContextListener |
      | PrivateChannel.eventListenerAdded   | {privateChannel.id} | onUnsubscribe        |
      | PrivateChannel.eventListenerRemoved | {privateChannel.id} | onAddContextListener |
      | PrivateChannel.eventListenerRemoved | {privateChannel.id} | onUnsubscribe        |
      | PrivateChannel.onDisconnect         | {privateChannel.id} | {empty}              |
