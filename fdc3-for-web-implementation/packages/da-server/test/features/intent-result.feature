Feature: Intent Results Are Correctly Delivered

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And A newly instantiated FDC3 Server
    And "LibraryApp/l1" is opened with connection id "l1"
    And "App1/a1" is opened with connection id "a1"
    And "LibraryApp/l1" registers an intent listener for "returnBook"

  Scenario: App Returns An Intent Response
ISSUE: 1303 prevents the use of matches_type

    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with requestUuid "ABC123" and contextType "fdc3.book"
    Then messaging will have outgoing posts
      | msg.type             | msg.meta.requestUuid | to.appId   | to.instanceId | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.context.type |
      | raiseIntentResponse  | ABC123               | App1       | a1            | l1                                             | {null}                                |
      | intentResultEvent    | ABC123               | App1       | a1            | {null}                                         | fdc3.book                             |
      | intentResultResponse | ABC123               | LibraryApp | l1            | {null}                                         | {null}                                |

  Scenario: App Returns An Intent Result
  ISSUE: 1303 prevents the use of matches_type

    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with requestUuid "ABC123" and private channel "pc1"
    Then messaging will have outgoing posts
      | msg.type             | msg.meta.requestUuid | to.appId   | to.instanceId | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.channel.id |
      | raiseIntentResponse  | ABC123               | App1       | a1            | l1                                             | {null}                              |
      | intentResultEvent    | ABC123               | App1       | a1            | {null}                                         | pc1                                 |
      | intentResultResponse | ABC123               | LibraryApp | l1            | {null}                                         | {null}                              |
