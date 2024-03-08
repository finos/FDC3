Feature: Responding to Directory Requests about Intents

  Background: 
    Given "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | loanBook    | fdc3.book    | fdc3.loan   |
    And A newly instantiated FDC3 Server

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
