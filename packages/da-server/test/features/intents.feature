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
      | type               | payload.appIntent.intent.name | payload.appIntent.apps.length |
      | findIntentResponse | loanBook                      |                             0 |

  Scenario: Successful Find Intents Request
    When "App1/a1" finds intents with intent "loanBook" and contextType "{empty}" and result type "{empty}"
    Then messaging will have outgoing posts
      | type               | payload.appIntent.intent.name | payload.appIntent.apps.length | payload.appIntent.apps[0].appId |
      | findIntentResponse | loanBook                      |                             1 | libraryApp                      |

  Scenario: Successful Find Intents Request With Channel
    When "App1/a1" finds intents with intent "streamBook" and contextType "fdc3.book" and result type "channel"
    Then messaging will have outgoing posts
      | type               | payload.appIntent.intent.name | payload.appIntent.apps.length | payload.appIntent.apps[0].appId |
      | findIntentResponse | streamBook                    |                             1 | libraryApp                      |

  Scenario: Successful Find Intents Request With A Typed Channel
    When "App1/a1" finds intents with intent "streamBook" and contextType "{empty}" and result type "channel<chapter>"
    Then messaging will have outgoing posts
      | type               | payload.appIntent.intent.name | payload.appIntent.apps.length | payload.appIntent.apps[0].appId |
      | findIntentResponse | streamBook                    |                             1 | libraryApp                      |
