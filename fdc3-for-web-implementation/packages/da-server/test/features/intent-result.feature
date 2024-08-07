Feature: Intent Results Are Correctly Delivered

  Background:
    Given "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And A newly instantiated FDC3 Server
    And "LibraryApp/l1" is opened with connection id "abc"
    And "App1/a1" is opened with connection id "def"

  Scenario: App Returns An Intent Response
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a raiseIntentResponse for intent "StartChat" with requestUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.type            | msg.meta.requestUuid | to.appId | to.instanceId |
      | raiseIntentResponse | ABC123               | App1     | a1            |

  Scenario: App Returns An Intent Result
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a raiseIntentResultResponse with requestUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.type                  | msg.meta.requestUuid | to.appId | to.instanceId | msg.payload.intentResult.context.type |
      | raiseIntentResultResponse | ABC123               | App1     | a1            | fdc3.something                        |
