Feature: Basic Private Channels Support

  Background: Desktop Agent API
    Given schemas loaded
    And User Channels one, two and three
    And A Desktop Agent in "api"
    And I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And "instrumentMessageOne" is a BroadcastEvent message on channel "{privateChannel.id}" with context "fdc3.instrument"

  Scenario: Adding and then unsubscribing a context listener will send a notification of each event to the agent
    Given "contextHandler" pipes context to "context"
    When I call "{privateChannel}" with "addContextListener" with parameters "fdc3.instrument" and "{contextHandler}"
    And I refer to "{result}" as "theListener"
    And I call "{theListener}" with "unsubscribe"
    Then messaging will have posts
      | type                              | payload.channelId   | payload.contextType | payload.listenerUUID | matches_type                      |
      | addContextListenerRequest         | {privateChannel.id} | fdc3.instrument     | {null}               | addContextListenerRequest         |
      | contextListenerUnsubscribeRequest | {null}              | {null}              | {theListener.id}     | contextListenerUnsubscribeRequest |

  Scenario: Adding a Context Listener on a given Private Channel to receive a notification
    Given "resultHandler" pipes context to "contexts"
    When I call "{privateChannel}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |

  Scenario: Adding and then unsubscribing an "onAddContextListener" listener will send a notification of each event to the agent
    Given "typesHandler" pipes events to "types"
    When I call "{privateChannel}" with "addEventListener" with parameters "addContextListener" and "{typesHandler}"
    And I refer to "{result}" as "theListener"
    And we wait for a period of "100" ms
    And I call "{theListener}" with "unsubscribe"
    Then messaging will have posts
      | type                                          | payload.listenerType | payload.privateChannelId | payload.listenerUUID | matches_type                                  |
      | privateChannelAddEventListenerRequest         | addContextListener   | {privateChannel.id}      | {null}               | privateChannelAddEventListenerRequest         |
      | privateChannelUnsubscribeEventListenerRequest | {null}               | {null}                   | {theListener.id}     | privateChannelUnsubscribeEventListenerRequest |

  Scenario: Adding an "addContextListener" event handler on a given Private Channel to receive a notification
    Given "onAddContextListenerMessage" is a PrivateChannelOnAddContextListenerEvent message on channel "{privateChannel.id}" with contextType as "fdc3.instrument"
    And "typesHandler" pipes events to "types"
    When I call "{privateChannel}" with "addEventListener" with parameters "addContextListener" and "{typesHandler}"
    And we wait for a period of "100" ms
    And messaging receives "{onAddContextListenerMessage}"
    Then "{types}" is an array of objects with the following contents
      | contextType     |
      | fdc3.instrument |

  Scenario: Adding and then unsubscribing an "onUnsubscribe" listener will send a notification of each event to the agent
    Given "typesHandler" pipes events to "types"
    When I call "{privateChannel}" with "addEventListener" with parameters "unsubscribe" and "{typesHandler}"
    And we wait for a period of "100" ms
    And I refer to "{result}" as "theListener"
    And I call "{theListener}" with "unsubscribe"
    Then messaging will have posts
      | type                                          | payload.listenerType | payload.privateChannelId | payload.listenerUUID | matches_type                                  |
      | privateChannelAddEventListenerRequest         | unsubscribe          | {privateChannel.id}      | {null}               | privateChannelAddEventListenerRequest         |
      | privateChannelUnsubscribeEventListenerRequest | {null}               | {null}                   | {theListener.id}     | privateChannelUnsubscribeEventListenerRequest |

  Scenario: Adding an "unsubscribe" event handler on a given Private Channel to receive a notification
    Given "onUnsubscribeListenerMessage" is a PrivateChannelOnUnsubscribeEvent message on channel "{privateChannel.id}" with contextType as "fdc3.instrument"
    And "typesHandler" pipes events to "types"
    When I call "{privateChannel}" with "addEventListener" with parameters "unsubscribe" and "{typesHandler}"
    And we wait for a period of "100" ms
    And messaging receives "{onUnsubscribeListenerMessage}"
    Then "{types}" is an array of objects with the following contents
      | contextType     |
      | fdc3.instrument |

  Scenario: Adding and then unsubscribing an "disconnect" listener will send a notification of each event to the agent
    Given "voidHandler" is a invocation counter into "count"
    When I call "{privateChannel}" with "addEventListener" with parameters "disconnect" and "{voidHandler}"
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
    When I call "{privateChannel}" with "addEventListener" with parameters "disconnect" and "{voidHandler}"
    And we wait for a period of "100" ms
    And messaging receives "{onDisconnectListenerMessage}"
    Then "{count}" is "1"

  Scenario: I can broadcast context on a private channel
    Given "instrumentContext" is a "fdc3.instrument" context
    When I call "{privateChannel}" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | type             | payload.channelId   | payload.context.type | payload.context.name | matches_type     |
      | broadcastRequest | {privateChannel.id} | fdc3.instrument      | Apple                | broadcastRequest |

  Scenario: I disconnect from a private channel
    And I call "{privateChannel}" with "disconnect"
    And messaging will have posts
      | payload.channelId   | matches_type                    |
      | {null}              | createPrivateChannelRequest     |
      | {privateChannel.id} | privateChannelDisconnectRequest |
