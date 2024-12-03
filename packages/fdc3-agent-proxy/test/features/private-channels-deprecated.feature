Feature: Basic Private Channels Support

  Background: Desktop Agent API
    Given schemas loaded
    And User Channels one, two and three
    And A Desktop Agent in "api"
    And I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And "instrumentMessageOne" is a BroadcastEvent message on channel "{privateChannel.id}" with context "fdc3.instrument"

  Scenario: Adding and then unsubscribing an "onAddContextListener" listener will send a notification of each event to the agent
    Given "typesHandler" pipes types to "types"
    When I call "{privateChannel}" with "onAddContextListener" with parameter "{typesHandler}"
    And I refer to "{result}" as "theListener"
    And we wait for a period of "100" ms
    And I call "{theListener}" with "unsubscribe"
    Then messaging will have posts
      | type                                          | payload.listenerType | payload.privateChannelId | payload.listenerUUID | matches_type                                  |
      | privateChannelAddEventListenerRequest         | addContextListener   | {privateChannel.id}      | {null}               | privateChannelAddEventListenerRequest         |
      | privateChannelUnsubscribeEventListenerRequest | {null}               | {null}                   | {theListener.id}     | privateChannelUnsubscribeEventListenerRequest |

  Scenario: Adding an "onAddContextListener" on a given Private Channel to receive a notification
    Given "onAddContextListenerMessage" is a PrivateChannelOnAddContextListenerEvent message on channel "{privateChannel.id}" with contextType as "fdc3.instrument"
    And "typesHandler" pipes types to "types"
    When I call "{privateChannel}" with "onAddContextListener" with parameter "{typesHandler}"
    And we wait for a period of "100" ms
    And messaging receives "{onAddContextListenerMessage}"
    Then "{types}" is an array of strings with the following values
      | value           |
      | fdc3.instrument |

  Scenario: Adding and then unsubscribing an "onUnsubscribe" listener will send a notification of each event to the agent
    Given "typesHandler" pipes types to "types"
    When I call "{privateChannel}" with "onUnsubscribe" with parameter "{typesHandler}"
    And we wait for a period of "100" ms
    And I refer to "{result}" as "theListener"
    And I call "{theListener}" with "unsubscribe"
    Then messaging will have posts
      | type                                          | payload.listenerType | payload.privateChannelId | payload.listenerUUID | matches_type                                  |
      | privateChannelAddEventListenerRequest         | unsubscribe          | {privateChannel.id}      | {null}               | privateChannelAddEventListenerRequest         |
      | privateChannelUnsubscribeEventListenerRequest | {null}               | {null}                   | {theListener.id}     | privateChannelUnsubscribeEventListenerRequest |

  Scenario: Adding an "onUnsubscribe" on a given Private Channel to receive a notification
    Given "onUnsubscribeListenerMessage" is a PrivateChannelOnUnsubscribeEvent message on channel "{privateChannel.id}" with contextType as "fdc3.instrument"
    And "typesHandler" pipes types to "types"
    When I call "{privateChannel}" with "onUnsubscribe" with parameter "{typesHandler}"
    And we wait for a period of "100" ms
    And messaging receives "{onUnsubscribeListenerMessage}"
    Then "{types}" is an array of strings with the following values
      | value           |
      | fdc3.instrument |

  Scenario: Adding and then unsubscribing an "onDisconnect" listener will send a notification of each event to the agent
    Given "voidHandler" is a invocation counter into "count"
    When I call "{privateChannel}" with "onDisconnect" with parameter "{voidHandler}"
    And I refer to "{result}" as "theListener"
    And we wait for a period of "100" ms
    And I call "{theListener}" with "unsubscribe"
    Then messaging will have posts
      | type                                          | payload.listenerType | payload.privateChannelId | payload.listenerUUID | matches_type                                  |
      | privateChannelAddEventListenerRequest         | disconnect           | {privateChannel.id}      | {null}               | privateChannelAddEventListenerRequest         |
      | privateChannelUnsubscribeEventListenerRequest | {null}               | {null}                   | {theListener.id}     | privateChannelUnsubscribeEventListenerRequest |

  Scenario: Adding an "onDisconnect" on a given Private Channel to receive a notification
    Given "onDisconnectListenerMessage" is a PrivateChannelOnDisconnectEvent message on channel "{privateChannel.id}"
    And "voidHandler" is a invocation counter into "count"
    When I call "{privateChannel}" with "onDisconnect" with parameter "{voidHandler}"
    And we wait for a period of "100" ms
    And messaging receives "{onDisconnectListenerMessage}"
    Then "{count}" is "1"
