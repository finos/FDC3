Feature: Relaying Private Channel Broadcast messages

  Background:
    Given schemas loaded
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "App2/a2" is opened with connection id "a2"
    And "App2/a1" creates a private channel
    #TODO: have a2 retrieve the private channel by raising an intent - its currently using a1 reference to the channel
    And I refer to "uuid3" as "channel1Id"

  Scenario: Creating a new private channel
    When "App2/a1" creates a private channel
    Then messaging will have outgoing posts
      | msg.matches_type             | msg.payload.privateChannel.id | msg.payload.privateChannel.type | to.appId | to.instanceId |
      | createPrivateChannelResponse | uuid6                         | private                         | App2     | a1            |

  Scenario: Broadcast message to no-one
    When "App1/a1" broadcasts "fdc3.instrument" on "{channel1Id}"
    Then messaging will have outgoing posts
      | msg.matches_type  |
      | broadcastResponse |

  Scenario: Broadcast message sent to one listener
    When "App2/a2" adds a context listener on "{channel1Id}" with type "fdc3.instrument"
    And "App1/a1" broadcasts "fdc3.instrument" on "{channel1Id}"
    Then messaging will have outgoing posts
      | msg.matches_type           | msg.payload.channelId | msg.payload.context.id.ticker | msg.payload.context.type | to.appId | to.instanceId |
      | addContextListenerResponse | {null}                | {null}                        | {null}                   | App2     | a2            |
      | broadcastEvent             | {channel1Id}          | AAPL                          | fdc3.instrument          | App2     | a2            |
      | broadcastResponse          | {null}                | {null}                        | {null}                   | App1     | a1            |

  Scenario: Event Listener created for addContextListener and unsubscribe
    When "App2/a2" adds an "addContextListener" event listener on "{channel1Id}"
    And "App2/a2" adds an "unsubscribe" event listener on "{channel1Id}"
    And "App1/a1" adds a context listener on "{channel1Id}" with type "fdc3.instrument"
    And we wait for a period of "10" ms
    Then messaging will have outgoing posts
      | msg.matches_type                        | to.appId | to.instanceId | msg.payload.privateChannelId | msg.payload.contextType | msg.payload.listenerUUID |
      | privateChannelAddEventListenerResponse  | App2     | a2            | {null}                       | {null}                  | uuid6                    |
      | privateChannelAddEventListenerResponse  | App2     | a2            | {null}                       | {null}                  | uuid9                    |
      | privateChannelOnAddContextListenerEvent | App2     | a2            | {channel1Id}                 | fdc3.instrument         | {null}                   |
      | addContextListenerResponse              | App1     | a1            | {null}                       | {null}                  | uuid12                   |
    And "App1/a1" removes context listener with id "uuid12"
    Then messaging will have outgoing posts
      | msg.type                           | msg.payload.privateChannelId | msg.payload.contextType | to.appId | to.instanceId |
      | privateChannelOnUnsubscribeEvent   | {channel1Id}                 | fdc3.instrument         | App2     | a2            |
      | contextListenerUnsubscribeResponse | {null}                       | {null}                  | App1     | a1            |

  Scenario: Disconnecting from a channel sends unsubscribe and disconnect messages
    When "App2/a2" adds an "disconnect" event listener on "{channel1Id}"
    And "App1/a1" adds a context listener on "{channel1Id}" with type "fdc3.instrument"
    And "App2/a2" adds an "unsubscribe" event listener on "{channel1Id}"
    And "App1/a1" disconnects from private channel "{channel1Id}"
    Then messaging will have outgoing posts
      | msg.matches_type                 | msg.payload.privateChannelId | msg.payload.contextType | to.appId | to.instanceId |
      | privateChannelOnUnsubscribeEvent | {channel1Id}                 | fdc3.instrument         | App2     | a2            |
      | privateChannelOnDisconnectEvent  | {channel1Id}                 | {null}                  | App2     | a2            |
      | privateChannelDisconnectResponse | {null}                       | {null}                  | App1     | a1            |

  Scenario: addContextListener Event Listener add and removed, shouldn't fire when addContextListener called.
    When "App2/a2" adds an "addContextListener" event listener on "{channel1Id}"
    And "App2/a2" removes event listener "uuid6"
    And "App1/a1" adds a context listener on "{channel1Id}" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.matches_type                               | to.appId | to.instanceId | msg.payload.privateChannelId | msg.payload.contextType | msg.payload.listenerUUID |
      | privateChannelAddEventListenerResponse         | App2     | a2            | {null}                       | {null}                  | uuid6                    |
      | privateChannelUnsubscribeEventListenerResponse | App2     | a2            | {null}                       | {null}                  | {null}                   |
      | addContextListenerResponse                     | App1     | a1            | {null}                       | {null}                  | uuid11                   |

  Scenario: I can't register an app channel with the same ID as a private channel
    When "App2/a2" creates or gets an app channel called "{channel1Id}"
    Then messaging will have outgoing posts
      | msg.type                   | to.appId | to.instanceId | msg.payload.error |
      | getOrCreateChannelResponse | App2     | a2            | AccessDenied      |

  Scenario: Subscribe to a non-existent channel
    When "App2/a2" adds a context listener on "IDontExist" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.type                   | to.appId | to.instanceId | msg.payload.error |
      | addContextListenerResponse | App2     | a2            | NoChannelFound    |

  Scenario: Can't unsubscribe an unconnected listener
    When "App2/a2" adds a context listener on "{channelId}" with type "fdc3.instrument"
    And "App2/a2" removes context listener with id "uuid6"
    And "App2/a2" removes context listener with id "uuid6"
    Then messaging will have outgoing posts
      | msg.type                           | to.appId | to.instanceId | msg.payload.error |
      | contextListenerUnsubscribeResponse | App2     | a2            | {null}            |
      | contextListenerUnsubscribeResponse | App2     | a2            | ListenerNotFound  |

  Scenario: Can't unsubscribe an someone else's listener
    When "App2/a2" adds a context listener on "{channelId}" with type "fdc3.instrument"
    And "App1/a1" removes context listener with id "uuid6"
    Then messaging will have outgoing posts
      | msg.type                           | to.appId | to.instanceId | msg.payload.error |
      | addContextListenerResponse         | App2     | a2            | {null}            |
      | contextListenerUnsubscribeResponse | App1     | a1            | ListenerNotFound  |
