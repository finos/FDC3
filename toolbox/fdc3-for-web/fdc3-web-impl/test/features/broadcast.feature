Feature: Relaying Broadcast messages

  Background:
    Given schemas loaded
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "App2/a2" is opened with connection id "a2"

  Scenario: Broadcast message to no-one
    When "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type  |
      | broadcastResponse |
    And messaging will have 1 posts

  Scenario: Broadcast message sent to one listener
    When "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And we wait for a period of "100" ms
    And "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type           | msg.payload.channelId | msg.payload.context.type | msg.payload.context.id.ticker | msg.payload.metadata.source.appId | msg.payload.metadata.source.instanceId |
      | addContextListenerResponse | {null}                | {null}                   | {null}                        | {null}                            | {null}                                 |
      | broadcastEvent             | one                   | fdc3.instrument          | AAPL                          | App1                              | a1                                     |
      | broadcastResponse          | {null}                | {null}                   | {null}                        | {null}                            | {null}                                 |

  Scenario: Broadcast message sent but listener has unsubscribed
    When "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And "App2/a2" removes context listener with id "uuid3"
    And "App1/a1" broadcasts "fdc3.instrument" on "one"
    Then messaging will have outgoing posts
      | msg.matches_type                   | to.appId | to.instanceId | msg.payload.listenerUUID |
      | addContextListenerResponse         | App2     | a2            | uuid3                    |
      | contextListenerUnsubscribeResponse | App2     | a2            | {null}                   |
      | broadcastResponse                  | App1     | a1            | {null}                   |

  Scenario: Retrieve an existing user channel via getOrCreateChannel
    When "App1/a1" creates or gets an app channel called "one"
    Then messaging will have outgoing posts
      | msg.matches_type           | to.instanceId | msg.payload.channel.id | msg.payload.channel.type | msg.payload.error |
      | getOrCreateChannelResponse | a1            | one                    | user                     | {null}            |

  Scenario: Retrieve a new app channel via getOrCreateChannel
    When "App1/a1" creates or gets an app channel called "myAppChannel"
    Then messaging will have outgoing posts
      | msg.matches_type           | to.instanceId | msg.payload.channel.id | msg.payload.channel.type | msg.payload.error |
      | getOrCreateChannelResponse | a1            | myAppChannel           | app                      | {null}            |

  Scenario: Get The Latest Context From A Channel
    Given "App1/a1" broadcasts "fdc3.instrument" on "one"
    And "App1/a1" asks for the latest context on "one" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.matches_type          | to.appId | to.instanceId | msg.payload.context.id.ticker | msg.payload.context.type |
      | getCurrentContextResponse | App1     | a1            | AAPL                          | fdc3.instrument          |

  Scenario: Broadcast with app-provided metadata forwards traceId, signature and custom
    When "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And we wait for a period of "100" ms
    And "App1/a1" broadcasts "fdc3.instrument" on "one" with metadata traceId "my-trace" signature "my-sig" and custom key "EMEA"
    Then messaging will have outgoing posts
      | msg.matches_type           | msg.payload.channelId | msg.payload.context.type | msg.payload.metadata.source.appId | msg.payload.metadata.traceId | msg.payload.metadata.signature.signature |msg.payload.metadata.signature.protected |   msg.payload.metadata.custom.region |
      | addContextListenerResponse | {null}                | {null}                   | {null}                            | {null}                       | {null}                         | {null}                         | {null}                             |
      | broadcastEvent             | one                   | fdc3.instrument          | App1                              | my-trace                     | my-sig (signature part)                        | my-sig (protected part)                        |  EMEA                               |
      | broadcastResponse          | {null}                | {null}                   | {null}                            | {null}                       | {null}                         | {null}                         | {null}                             |

  Scenario: Broadcast without app-provided traceId gets a DA-generated traceId
    When "App2/a2" adds a context listener on "one" with type "fdc3.instrument"
    And we wait for a period of "100" ms
    And "App1/a1" broadcasts "fdc3.instrument" on "one" without metadata
    Then messaging will have outgoing posts
      | msg.matches_type           | msg.payload.channelId | msg.payload.context.type | msg.payload.metadata.source.appId |
      | addContextListenerResponse | {null}                | {null}                   | {null}                            |
      | broadcastEvent             | one                   | fdc3.instrument          | App1                              |
      | broadcastResponse          | {null}                | {null}                   | {null}                            |

  Scenario: getCurrentContext returns stored metadata after broadcast with app-provided metadata
    Given "App1/a1" broadcasts "fdc3.instrument" on "one" with metadata traceId "stored-trace" signature "stored-sig" and custom key "APAC"
    And "App1/a1" asks for the latest context on "one" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.matches_type          | to.appId | to.instanceId | msg.payload.context.id.ticker | msg.payload.context.type | msg.payload.metadata.traceId | msg.payload.metadata.signature.signature | msg.payload.metadata.signature.protected | msg.payload.metadata.custom.region |
      | getCurrentContextResponse | App1     | a1            | AAPL                          | fdc3.instrument          | stored-trace                 | stored-sig (signature part)                     | stored-sig (protected part)                     | APAC                               |
