Feature: Responding to Directory Requests about Intents

  Background: 
    Given "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type      |
      | loanBook    | fdc3.book    | fdc3.loan        |
      | streamBook  | fdc3.book    | channel<chapter> |
      | returnBook  | fdc3.book    | {empty}          |
    And A newly instantiated FDC3 Server
    And "App1/b1" connects
    And "App1/b1" registers an intent listener for "returnBook" with contextType "fdc3.book" and result type "channel<messages>"

  Scenario: Failed Find Intents Request
    When "App1/a1" finds intents with intent "loanBook" and contextType "fdc3.instrument" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.type           | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | loanBook                          |                                 0 | a1            |

  Scenario: Successful Find Intents Request
    When "App1/a1" finds intents with intent "loanBook" and contextType "{empty}" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.type           | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | msg.payload.appIntent.apps[0].appId | to.instanceId |
      | findIntentResponse | loanBook                          |                                 1 | libraryApp                          | a1            |

  Scenario: Successful Find Intents Request With Channel
    When "App1/a1" finds intents with intent "streamBook" and contextType "fdc3.book" and result type "channel"
    Then messaging will have outgoing posts
      | msg.type           | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | msg.payload.appIntent.apps[0].appId | to.instanceId |
      | findIntentResponse | streamBook                        |                                 1 | libraryApp                          | a1            |

  Scenario: Successful Find Intents Request With A Typed Channel
    When "App1/a1" finds intents with intent "streamBook" and contextType "{empty}" and result type "channel<chapter>"
    Then messaging will have outgoing posts
      | msg.type           | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | msg.payload.appIntent.apps[0].appId | to.instanceId |
      | findIntentResponse | streamBook                        |                                 1 | libraryApp                          | a1            |

  Scenario: Find Intent includes results for a running app with intent listener
    When "App1/a1" finds intents with intent "returnBook" and contextType "fdc3.book" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.type           | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | returnBook                        |                                 2 | a1            |
    And messaging will have outgoing posts
      | msg.payload.appIntent.apps[1].appId | msg.payload.appIntent.apps[1].instanceId |
      | App1                                | b1                                       |
    And messaging will have outgoing posts
      | msg.payload.appIntent.apps[0].appId | msg.payload.appIntent.apps[0].instanceId |
      | libraryApp                          | {empty}                                  |
