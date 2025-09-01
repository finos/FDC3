Feature: Basic User Channels Support

  Background: Desktop Agent API
    Given User Channels one, two and three
    Given schemas loaded
    Given A Desktop Agent in "api"
    Given "instrumentMessageOne" is a BroadcastEvent message on channel "one" with context "fdc3.instrument"
    Given "countryMessageOne" is a BroadcastEvent message on channel "one" with context "fdc3.country"
    Given "openMessage" is a BroadcastEvent message on channel "{null}" with context "fdc3.instrument"
    Given "instrumentContext" is a "fdc3.instrument" context
    Given "userChannelMessage1" is a channelChangedEvent message on channel "one"
    Given "userChannelMessage2" is a channelChangedEvent message on channel "two"
    Given "userChannelMessage3" is a channelChangedEvent message on channel "three"
    Given "userChannelMessageBroken" is a channelChangedEvent message on channel "nonexistent"

  Scenario: List User Channels
        There should be a selection of user channels to choose from

    When I call "{api}" with "getUserChannels"
    Then "{result}" is an array of objects with the following contents
      | id    | type | displayMetadata.color | displayMetadata.glyph | displayMetadata.name |
      | one   | user | red                   | triangle              | The one channel      |
      | two   | user | red                   | triangle              | The two channel      |
      | three | user | red                   | triangle              | The three channel    |
    And messaging will have posts
      | meta.source.appId | meta.source.instanceId | matches_type           |
      | cucumber-app      | cucumber-instance      | getUserChannelsRequest |

  Scenario: List User Channels via Deprecated API call
        There should be a selection of user channels to choose from

    When I call "{api}" with "getSystemChannels"
    Then "{result}" is an array of objects with the following contents
      | id    | type | displayMetadata.color | displayMetadata.glyph | displayMetadata.name |
      | one   | user | red                   | triangle              | The one channel      |
      | two   | user | red                   | triangle              | The two channel      |
      | three | user | red                   | triangle              | The three channel    |
    And messaging will have posts
      | meta.source.appId | meta.source.instanceId | matches_type           |
      | cucumber-app      | cucumber-instance      | getUserChannelsRequest |

  Scenario: Initial User Channel
        At startup, the user channel shouldn't be set

    When I call "{api}" with "getCurrentChannel"
    Then "{result}" is null
    And messaging will have posts
      | meta.source.appId | meta.source.instanceId | matches_type             |
      | cucumber-app      | cucumber-instance      | getCurrentChannelRequest |

  Scenario: Changing Channel
        You should be able to join a channel knowing it's ID.

    When I call "{api}" with "joinUserChannel" with parameter "one"
    When I call "{api}" with "getCurrentChannel"
    Then "{result}" is an object with the following contents
      | id  | type | displayMetadata.color |
      | one | user | red                   |
    And messaging will have posts
      | payload.channelId | matches_type             |
      | one               | joinUserChannelRequest   |
      | {null}            | getUserChannelsRequest   |
      | {null}            | getCurrentChannelRequest |

  Scenario: Changing Channel via Deprecated API
        You should be able to join a channel knowing it's ID.

    When I call "{api}" with "joinChannel" with parameter "one"
    When I call "{api}" with "getCurrentChannel"
    Then "{result}" is an object with the following contents
      | id  | type | displayMetadata.color |
      | one | user | red                   |
    And messaging will have posts
      | payload.channelId | matches_type             |
      | one               | joinUserChannelRequest   |
      | {null}            | getUserChannelsRequest   |
      | {null}            | getCurrentChannelRequest |

  Scenario: Adding a Typed Listener on a given User Channel
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | one               | {null}              | joinUserChannelRequest    |
      | {null}            | {null}              | getUserChannelsRequest    |
      | {null}            | fdc3.instrument     | addContextListenerRequest |
      | one               | fdc3.instrument     | getCurrentContextRequest  |

  Scenario: Adding an Un-Typed Listener on a given User Channel
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "addContextListener" with parameters "{empty}" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | one               | {null}              | joinUserChannelRequest    |
      | {null}            | {null}              | getUserChannelsRequest    |
      | {null}            | {null}              | addContextListenerRequest |
      | one               | {null}              | getCurrentContextRequest  |

  Scenario: Adding an Un-Typed Listener on a given User Channel (deprecated API)
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "addContextListener" with parameter "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | one               | {null}              | joinUserChannelRequest    |
      | {null}            | {null}              | getUserChannelsRequest    |
      | {null}            | {null}              | addContextListenerRequest |
      | one               | {null}              | getCurrentContextRequest  |

  Scenario: If you haven't joined a channel, your listener receives nothing
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is empty
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | {null}            | fdc3.instrument     | addContextListenerRequest |

  Scenario: After unsubscribing, my listener shouldn't receive any more messages
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I refer to "{result}" as "theListener"
    And messaging receives "{instrumentMessageOne}"
    And I call "{theListener}" with "unsubscribe"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | payload.listenerUUID | matches_type                      |
      | one               | {null}              | {null}               | joinUserChannelRequest            |
      | {null}            | {null}              | {null}               | getUserChannelsRequest            |
      | {null}            | fdc3.instrument     | {null}               | addContextListenerRequest         |
      | one               | fdc3.instrument     | {null}               | getCurrentContextRequest          |
      | {null}            | {null}              | {theListener.id}     | contextListenerUnsubscribeRequest |

  Scenario: I should be able to leave a user channel, and not receive messages on it
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "{api}" with "leaveCurrentChannel"
    Then messaging will have posts
      | payload.channelId | payload.contextType | payload.listenerUUID | matches_type               |
      | one               | {null}              | {null}               | joinUserChannelRequest     |
      | {null}            | {null}              | {null}               | getUserChannelsRequest     |
      | {null}            | fdc3.instrument     | {null}               | addContextListenerRequest  |
      | one               | fdc3.instrument     | {null}               | getCurrentContextRequest   |
      | {null}            | {null}              | {null}               | leaveCurrentChannelRequest |
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type | name |

  Scenario: Joining a user channel that doesn't exist throws an error
    When I call "{api}" with "joinUserChannel" with parameter "nonexistent"
    Then "{result}" is an error with message "NoChannelFound"

  Scenario: Passing invalid arguments to a user channel's addContextListener fn throws an error
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "addContextListener" with parameters "{true}" and "{resultHandler}"
    # Specific error message not tested as its not currently standardized
    # TODO: Fix when #1490 is resolved
    Then "{result}" is an error
    And I call "{api}" with "addContextListener" with parameters "{null}" and "{true}"
    Then "{result}" is an error

  Scenario: You can get the details of the last context type sent
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "getCurrentChannel"
    And I refer to "{result}" as "theChannel"
    And I call "{api}" with "broadcast" with parameter "{instrumentContext}"
    And I call "{theChannel}" with "getCurrentContext"
    Then "{result}" is an object with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.context.type | payload.context.id.ticker | matches_type             |
      | one               | {null}               | {null}                    | joinUserChannelRequest   |
      | {null}            | {null}               | {null}                    | getUserChannelsRequest   |
      | {null}            | {null}               | {null}                    | getCurrentChannelRequest |
      | {null}            | {null}               | {null}                    | getCurrentChannelRequest |
      | one               | fdc3.instrument      | AAPL                      | broadcastRequest         |
      | one               | {null}               | {null}                    | getCurrentContextRequest |

  Scenario: Asking for a piece of context (e.g. an email) when it's not been sent returns null
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "getCurrentChannel"
    And I refer to "{result}" as "theChannel"
    And messaging receives "{instrumentMessageOne}"
    And I call "{theChannel}" with "getCurrentContext" with parameter "fdc3.email"
    Then "{result}" is null

  Scenario: User Channel Updated By Desktop Agent Changes User Channel Context Listeners
    Given "resultHandler" pipes context to "contexts"
    When I call "{api}" with "joinUserChannel" with parameter "one"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I refer to "{result}" as "theListener"
    When messaging receives "{userChannelMessage2}"
    # Channel changed event handling is async
    And we wait for a period of "100" ms
    Then "{channelId}" is "two"
    And messaging receives "{instrumentMessageOne}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type | name |

  Scenario: User Channel Updated By Desktop Agent To A Non-Existent User Channel Sets The Channel To Null
    When I call "{api}" with "joinUserChannel" with parameter "one"
    When messaging receives "{userChannelMessageBroken}"
    # Channel changed event handling is async and this case involves an extra round trip to the DA
    And we wait for a period of "500" ms
    Then "{channelId}" is "{null}"

  Scenario: Adding and removing A User Channel Changed Event Listener
    Given "typesHandler" pipes events to "types"
    When I call "{api}" with "addEventListener" with parameters "userChannelChanged" and "{typesHandler}"
    And I refer to "{result}" as "theListener"
    And messaging receives "{userChannelMessage2}"
    And messaging receives "{userChannelMessage1}"
    And I call "{theListener}" with "unsubscribe"
    And messaging receives "{userChannelMessage3}"
    Then messaging will have posts
      | payload.type         | type                            | matches_type                    |
      | USER_CHANNEL_CHANGED | addEventListenerRequest         | addEventListenerRequest         |
      | USER_CHANNEL_CHANGED | addEventListenerRequest         | addEventListenerRequest         |
      | {null}               | getUserChannelsRequest          | getUserChannelsRequest          |
      | {null}               | getUserChannelsRequest          | getUserChannelsRequest          |
      | {null}               | eventListenerUnsubscribeRequest | eventListenerUnsubscribeRequest |
    And "{types}" is an array of objects with the following contents
      | currentChannelId |
      | two              |
      | one              |

  Scenario: Adding and removing A "null" (i.e. wildcard) Event Listener
    Given "typesHandler" pipes events to "types"
    When I call "{api}" with "addEventListener" with parameters "{null}" and "{typesHandler}"
    And I refer to "{result}" as "theListener"
    And messaging receives "{userChannelMessage2}"
    And messaging receives "{userChannelMessage1}"
    And I call "{theListener}" with "unsubscribe"
    And messaging receives "{userChannelMessage3}"
    Then "{types}" is an array of objects with the following contents
      | currentChannelId |
      | two              |
      | one              |
    And messaging will have posts
      | payload.type         | type                            | matches_type                    |
      | USER_CHANNEL_CHANGED | addEventListenerRequest         | addEventListenerRequest         |
      | {null}               | addEventListenerRequest         | addEventListenerRequest         |
      | {null}               | getUserChannelsRequest          | getUserChannelsRequest          |
      | {null}               | getUserChannelsRequest          | getUserChannelsRequest          |
      | {null}               | eventListenerUnsubscribeRequest | eventListenerUnsubscribeRequest |

  Scenario: Adding An Unknown Event Listener
    Given "typesHandler" pipes events to "types"
    When I call "{api}" with "addEventListener" with parameters "unknownEventType" and "{typesHandler}"
    Then "{result}" is an error with message "UnknownEventType"

  Scenario: BroadcastEvent on app Opening
    Given "resultHandler" pipes context to "contexts"
    And I call "{api}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And messaging receives "{openMessage}"
    Then "{contexts}" is an array of objects with the following contents
      | id.ticker | type            | name  |
      | AAPL      | fdc3.instrument | Apple |
    And messaging will have posts
      | payload.channelId | payload.contextType | matches_type              |
      | {null}            | fdc3.instrument     | addContextListenerRequest |
