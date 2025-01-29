Feature: Relaying Private Channel Broadcast messages

  Background:
      This creates user channels "one", "two" and "three"

    Given schemas loaded
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "App2/a2" is opened with connection id "a2"

  Scenario: List User Channels
    When "App1/a1" gets the list of user channels
    Then messaging will have outgoing posts
      | msg.payload.userChannels[0].id | msg.payload.userChannels[1].id | msg.payload.userChannels[2].id | msg.payload.userChannels[0].type | to.instanceId | msg.matches_type        |
      | one                            | two                            | three                          | user                             | a1            | getUserChannelsResponse |

  Scenario: Initial User Channel
        At startup, the user channel shouldn't be set

    When "App1/a1" gets the current user channel
    Then messaging will have outgoing posts
      | msg.payload.channel.id | to.instanceId | msg.matches_type          |
      | {null}                 | a1            | getCurrentChannelResponse |

  Scenario: Changing Channel
        You should be able to join a channel knowing it's ID.

    When "App/a1" joins user channel "one"
    And "App1/a1" gets the current user channel
    Then messaging will have outgoing posts
      | msg.payload.channel.id | to.instanceId | msg.matches_type          |
      | {null}                 | a1            | joinUserChannelResponse   |
      | one                    | a1            | getCurrentChannelResponse |

  Scenario: Adding a Typed Listener on a given User Channel
    When "App/a1" joins user channel "one"
    And "App/a1" adds a context listener on "one" with type "fdc3.instrument"
    And "App2/a2" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.payload.channelId | msg.payload.context.type | msg.matches_type  | to.instanceId |
      | one                   | fdc3.instrument          | broadcastEvent    | a1            |
      | {null}                | {null}                   | broadcastResponse | a2            |

  Scenario: Adding an Un-Typed Listener on a given User Channel
    When "App/a1" joins user channel "one"
    And "App/a1" adds a context listener on "one" with type "{null}"
    And "App2/a2" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.payload.channelId | msg.payload.context.type | msg.matches_type  | to.instanceId |
      | one                   | fdc3.instrument          | broadcastEvent    | a1            |
      | {null}                | {null}                   | broadcastResponse | a2            |

  Scenario: If you haven't joined a channel, your listener receives nothing
    When "App/a1" joins user channel "one"
    And "App/a1" adds a context listener on "one" with type "{null}"
    And "App2/a2" broadcasts "fdc3.instrument" on "two"
    Then messaging will have outgoing posts
      | msg.matches_type           | to.instanceId |
      | joinUserChannelResponse    | a1            |
      | addContextListenerResponse | a1            |
      | broadcastResponse          | a2            |

  Scenario: After unsubscribing, my listener shouldn't receive any more messages
    When "App/a1" joins user channel "one"
    And "App/a1" adds a context listener on "one" with type "{null}"
    And "App/a1" removes context listener with id "uuid5"
    And "App2/a2" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type                   | msg.payload.listenerUUID |
      | joinUserChannelResponse            | {null}                   |
      | addContextListenerResponse         | uuid5                    |
      | contextListenerUnsubscribeResponse | {null}                   |
      | broadcastResponse                  | {null}                   |

  Scenario: I should be able to leave a user channel, and not receive messages on it
    When "App/a1" joins user channel "one"
    And "App/a1" adds a context listener on "one" with type "{null}"
    And "App/a1" leaves the current user channel
    And "App2/a2" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type            |
      | joinUserChannelResponse     |
      | addContextListenerResponse  |
      | leaveCurrentChannelResponse |
      | broadcastResponse           |

  Scenario: Joining a user channel that doesn't exist throws an error
    When "App/a1" joins user channel "four"
    Then messaging will have outgoing posts
      | msg.payload.error | msg.type                |
      | NoChannelFound    | joinUserChannelResponse |

  Scenario: Joining an app channel throws an error
    When "App/a2" creates or gets an app channel called "bizboz"
    When "App/a1" joins user channel "bizboz"
    Then messaging will have outgoing posts
      | msg.payload.error | msg.type                |
      | NoChannelFound    | joinUserChannelResponse |

  Scenario: You can get the details of the last context type sent
    When "App/a1" joins user channel "one"
    And "App2/a2" broadcasts "fdc3.instrument" on "one"
    And "App2/a2" broadcasts "fdc3.country" on "one"
    And "App/a1" gets the latest context on "one" with type "fdc3.instrument"
    And "App/a1" gets the latest context on "one" with type "fdc3.country"
    And "App/a1" gets the latest context on "one" with type "{null}"
    And "App/a1" gets the latest context on "one" with type "fdc3.sausage"
    Then messaging will have outgoing posts
      | msg.payload.context.type | msg.payload.context.name | msg.matches_type          |
      | fdc3.instrument          | Apple                    | getCurrentContextResponse |
      | fdc3.country             | Sweden                   | getCurrentContextResponse |
      | fdc3.country             | Sweden                   | getCurrentContextResponse |
      | {null}                   | {null}                   | getCurrentContextResponse |

  Scenario: Changing channel changes the listener channels too
    When "App/a1" joins user channel "one"
    And "App/a1" adds a context listener on "one" with type "{null}"
    And "App/a1" joins user channel "two"
    And "App2/a2" broadcasts "fdc3.instrument" on "two"
    And "App2/a2" broadcasts "fdc3.country" on "one"
    Then messaging will have outgoing posts
      | msg.payload.channelId | msg.payload.context.type | msg.matches_type  |
      | two                   | fdc3.instrument          | broadcastEvent    |
      | {null}                | {null}                   | broadcastResponse |
      | {null}                | {null}                   | broadcastResponse |

  Scenario: You can get the details of the last context type when none is set
    When "App/a1" joins user channel "one"
    And "App/a1" gets the latest context on "one" with type "fdc3.instrument"
    And "App/a1" gets the latest context on "one" with type "{null}"
    Then messaging will have outgoing posts
      | msg.payload.context.type | msg.payload.context.name | msg.matches_type          |
      | {null}                   | {null}                   | getCurrentContextResponse |
      | {null}                   | {null}                   | getCurrentContextResponse |
