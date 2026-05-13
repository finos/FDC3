Feature: Intent Results Are Correctly Delivered

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And "App1" is an app with the following intents
      | Intent Name | Context Type    | Result Type |
      | viewNews    | fdc3.instrument | {empty}     |
    And A newly instantiated FDC3 Server
    And "LibraryApp/l1" is opened with connection id "l1"
    And "App1/a1" is opened with connection id "a1"
    And "LibraryApp/l1" registers an intent listener for "returnBook"

  Scenario: Waiting for an intent listener to be Added
    When "LibraryApp/l1" raises an intent for "viewNews" with contextType "fdc3.instrument" on app "App1/a1" with requestUuid "ABC123"
    And "App1/a1" registers an intent listener for "viewNews"
    And "App1/a1" sends a intentResultRequest with eventUuid "uuid10" and void contents and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | to.appId   | to.instanceId | msg.payload.raiseIntentRequestUuid | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.context.type |
      | intentEvent               | uuid11             | App1       | a1            | ABC123                             | {null}                                         | {null}                                |
      | raiseIntentResponse       | {null}             | LibraryApp | l1            | {null}                             | a1                                             | {null}                                |
      | raiseIntentResultResponse | {null}             | LibraryApp | l1            | {null}                             | {null}                                         | {null}                                |
      | intentResultResponse      | {null}             | App1       | a1            | {null}                             | {null}                                         | {null}                                |

  Scenario: App Returns An Intent Response
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and contextType "fdc3.book" and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | msg.meta.requestUuid | to.appId   | to.instanceId | msg.payload.raiseIntentRequestUuid | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.context.type |
      | intentEvent               | uuid8              | {null}               | LibraryApp | l1            | ABC123                             | {null}                                         | {null}                                |
      | raiseIntentResponse       | {null}             | ABC123               | App1       | a1            | {null}                             | l1                                             | {null}                                |
      | raiseIntentResultResponse | {null}             | ABC123               | App1       | a1            | {null}                             | {null}                                         | fdc3.book                             |
      | intentResultResponse      | {null}             | uuid10               | LibraryApp | l1            | {null}                             | {null}                                         | {null}                                |

  Scenario: App Returns An Intent Result
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and private channel "pc1" and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | to.appId   | to.instanceId | msg.payload.raiseIntentRequestUuid | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.channel.id |
      | intentEvent               | uuid8              | LibraryApp | l1            | ABC123                             | {null}                                         | {null}                              |
      | raiseIntentResponse       | {null}             | App1       | a1            | {null}                             | l1                                             | {null}                              |
      | raiseIntentResultResponse | {null}             | App1       | a1            | {null}                             | {null}                                         | pc1                                 |
      | intentResultResponse      | {null}             | LibraryApp | l1            | {null}                             | {null}                                         | {null}                              |

  Scenario: App Returns A Void Intent Result
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and void contents and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | to.appId   | to.instanceId | msg.payload.raiseIntentRequestUuid | msg.payload.intentResolution.source.instanceId | msg.payload.intentResult.context.type |
      | intentEvent               | uuid8              | LibraryApp | l1            | ABC123                             | {null}                                         | {null}                                |
      | raiseIntentResponse       | {null}             | App1       | a1            | {null}                             | l1                                             | {null}                                |
      | raiseIntentResultResponse | {null}             | App1       | a1            | {null}                             | {null}                                         | {null}                                |
      | intentResultResponse      | {null}             | LibraryApp | l1            | {null}                             | {null}                                         | {null}                                |

  Scenario: App Returns A Context Result With Metadata
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and contextType "fdc3.book" and raiseIntentUuid "ABC123" with traceId "my-trace-123" and signature "sig-abc" and antiReplay claims "1234/2345/web-result-jti"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | to.appId   | to.instanceId | msg.payload.intentResult.context.type | msg.payload.resultMetadata.traceId | msg.payload.resultMetadata.signature.signature | msg.payload.resultMetadata.signature.protected | msg.payload.resultMetadata.antiReplay.iat | msg.payload.resultMetadata.antiReplay.exp | msg.payload.resultMetadata.antiReplay.jti | msg.payload.resultMetadata.source.instanceId |
      | intentEvent               | uuid8              | LibraryApp | l1            | {null}                                | {null}                             | {null}                               | {null}                                   | {null}                                    | {null}                                    | {null}                                    | {null}                                       |
      | raiseIntentResponse       | {null}             | App1       | a1            | {null}                                | {null}                             | {null}                               | {null}                                 | {null}                                    | {null}                                    | {null}                                    | {null}                                       |
      | raiseIntentResultResponse | {null}             | App1       | a1            | fdc3.book                             | my-trace-123                       | sig-abc (signature part)            | sig-abc (protected part)            | {1234}                                    | {2345}                                    | web-result-jti                            | l1                                           |
      | intentResultResponse      | {null}             | LibraryApp | l1            | {null}                                | {null}                             | {null}                               | {null}                                 | {null}                                    | {null}                                    | {null}                                    | {null}                                       |

  Scenario: DA-generated resultMetadata is present for a channel result
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and private channel "pc1" and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | to.appId   | to.instanceId | msg.payload.intentResult.channel.id | msg.payload.resultMetadata.source.instanceId | msg.payload.resultMetadata.source.appId |
      | intentEvent               | uuid8              | LibraryApp | l1            | {null}                              | {null}                                       | {null}                                  |
      | raiseIntentResponse       | {null}             | App1       | a1            | {null}                              | {null}                                       | {null}                                  |
      | raiseIntentResultResponse | {null}             | App1       | a1            | pc1                                 | l1                                           | LibraryApp                              |
      | intentResultResponse      | {null}             | LibraryApp | l1            | {null}                              | {null}                                       | {null}                                  |

  Scenario: DA-generated resultMetadata is present for a void result
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "LibraryApp/l1" with requestUuid "ABC123"
    When "LibraryApp/l1" sends a intentResultRequest with eventUuid "uuid7" and void contents and raiseIntentUuid "ABC123"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.meta.eventUuid | to.appId   | to.instanceId | msg.payload.resultMetadata.source.instanceId | msg.payload.resultMetadata.source.appId |
      | intentEvent               | uuid8              | LibraryApp | l1            | {null}                                       | {null}                                  |
      | raiseIntentResponse       | {null}             | App1       | a1            | {null}                                       | {null}                                  |
      | raiseIntentResultResponse | {null}             | App1       | a1            | l1                                           | LibraryApp                              |
      | intentResultResponse      | {null}             | LibraryApp | l1            | {null}                                       | {null}                                  |
