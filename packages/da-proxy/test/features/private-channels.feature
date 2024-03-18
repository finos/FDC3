Feature: Basic User Channels Support

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And I call "api" with "createPrivateChannel"
    And I refer to "result" as "privateChannel"
    And "instrumentMessageOne" is a "PrivateChannel.broadcastRequest" message on channel "{privateChannel}" with context "fdc3.instrument"

  Scenario: Adding and then unsubscribing a context listener will send a notification of each event to the agent
    Given "contextHandler" pipes context to "context"
    When I call "privateChannel" with "addContextListener" with parameters "fdc3.instrument" and "{contextHandler}"
    And I call "result" with "unsubscribe"
    Then messaging will have posts
      | type                                | payload.channelId   | payload.contextType |
      | PrivateChannel.onAddContextListener | {privateChannel.id} | fdc3.instrument     |
      | PrivateChannel.onUnsubscribe        | {privateChannel.id} | fdc3.instrument     |

  Scenario: Adding a Context Listener on a given Private Channel to receive a notification
    Given "instrumentMessageOne" is a "PrivateChannel.broadcast" message on channel "{privateChannel.id}" with context "fdc3.instrument"
    And "resultHandler" pipes context to "contexts"
    When I call "privateChannel" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |

  Scenario: Adding and then unsubscribing an "onAddContextListener" listener will send a notification of each event to the agent
    Given "typesHandler" pipes types to "types"
    When I call "privateChannel" with "onAddContextListener" with parameter "{typesHandler}"
    And I call "result" with "unsubscribe"
    Then messaging will have posts
      | type                                | payload.listenerType | payload.channelId   |
      | PrivateChannel.eventListenerAdded   | onAddContextListener | {privateChannel.id} |
      | PrivateChannel.eventListenerRemoved | onAddContextListener | {privateChannel.id} |

  Scenario: Adding an "onAddContextListener" on a given Private Channel to receive a notification
    Given "onAddContextListenerMessage" is a "PrivateChannel.onAddContextListener" message on channel "{privateChannel.id}" with contextType as "fdc3.instrument"
    And "typesHandler" pipes types to "types"
    When I call "privateChannel" with "onAddContextListener" with parameter "{typesHandler}"
    And messaging receives "{onAddContextListenerMessage}"
    Then "types" is an array of strings with the following values
      | value           |
      | fdc3.instrument |

  Scenario: Adding and then unsubscribing an "onUnsubscribe" listener will send a notification of each event to the agent
    Given "typesHandler" pipes types to "types"
    When I call "privateChannel" with "onUnsubscribe" with parameter "{typesHandler}"
    And I call "result" with "unsubscribe"
    Then messaging will have posts
      | type                                | payload.listenerType | payload.channelId   |
      | PrivateChannel.eventListenerAdded   | onUnsubscribe        | {privateChannel.id} |
      | PrivateChannel.eventListenerRemoved | onUnsubscribe        | {privateChannel.id} |

  Scenario: Adding an "onUnsubscribe" on a given Private Channel to receive a notification
    Given "onUnsubscribeListenerMessage" is a "PrivateChannel.onUnsubscribe" message on channel "{privateChannel.id}" with contextType as "fdc3.instrument"
    And "typesHandler" pipes types to "types"
    When I call "privateChannel" with "onUnsubscribe" with parameter "{typesHandler}"
    And messaging receives "{onUnsubscribeListenerMessage}"
    Then "types" is an array of strings with the following values
      | value           |
      | fdc3.instrument |

  Scenario: Adding and then unsubscribing an "onDisconnect" listener will send a notification of each event to the agent
    Given "voidHandler" is a invocation counter into "count"
    When I call "privateChannel" with "onDisconnect" with parameter "{voidHandler}"
    And I call "result" with "unsubscribe"
    Then messaging will have posts
      | type                                | payload.listenerType |
      | PrivateChannel.eventListenerAdded   | onDisconnect         |
      | PrivateChannel.eventListenerRemoved | onDisconnect         |

  Scenario: Adding an "onDisconnect" on a given Private Channel to receive a notification
    Given "onDisconnectListenerMessage" is a "PrivateChannel.onDisconnect" message on channel "{privateChannel.id}"
    And "voidHandler" is a invocation counter into "count"
    When I call "privateChannel" with "onDisconnect" with parameter "{voidHandler}"
    And messaging receives "{onDisconnectListenerMessage}"
    Then "{count}" is "1"

  Scenario: I can broadcast context on a private channel
    Given "instrumentContext" is a "fdc3.instrument" context
    When I call "privateChannel" with "broadcast" with parameter "{instrumentContext}"
    Then messaging will have posts
      | type                     | payload.channelId   | payload.context.type | payload.context.name |
      | PrivateChannel.broadcast | {privateChannel.id} | fdc3.instrument      | Apple                |

  Scenario: When disconnecting, a disconnect message is sent and unsubscribe is sent from each listener.
    Given "typesHandler" pipes types to "types"
    When I call "privateChannel" with "onAddContextListener" with parameter "{typesHandler}"
    And I call "privateChannel" with "onUnsubscribe" with parameter "{typesHandler}"
    And I call "privateChannel" with "disconnect"
    Then messaging will have posts
      | type                                | payload.channelId   | payload.listenerType |
      | PrivateChannel.eventListenerAdded   | {privateChannel.id} | onAddContextListener |
      | PrivateChannel.eventListenerAdded   | {privateChannel.id} | onUnsubscribe        |
      | PrivateChannel.eventListenerRemoved | {privateChannel.id} | onAddContextListener |
      | PrivateChannel.eventListenerRemoved | {privateChannel.id} | onUnsubscribe        |
      | PrivateChannel.onDisconnect         | {privateChannel.id} | {empty}              |
