Feature: Raising Intents

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name  | Context Type    | Result Type |
      | returnBook   | fdc3.book       | {empty}     |
      | borrowBook   | fdc3.book       | {empty}     |
      | sleepyIntent | fdc3.periodical | {empty}     |
    And "listenerApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | borrowBook  | fdc3.book    | {empty}     |
    And "uniqueIntentApp" is an app with the following intents
      | Intent Name  | Context Type  | Result Type |
      | uniqueIntent | fdc3.magazine | {empty}     |
    And "unusedApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
    And A newly instantiated FDC3 Server
    And "uniqueIntentApp/c1" is opened with connection id "c1"
    And "uniqueIntentApp/c1" registers an intent listener for "uniqueIntent"
    And "App1/a1" is opened with connection id "a1"
    And "listenerApp/b1" is opened with connection id "b1"
    And "listenerApp/b1" registers an intent listener for "returnBook"

  Scenario: Context Not Handled By App
    When "App1/a1" raises an intent for "borrowBook" with contextType "fdc3.magazine" on app "listenerApp/b1"
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.error | to.instanceId |
      | raiseIntentResponse | NoAppsFound       | a1            |

  Scenario: Raising an Intent that should auto-resolve (only one option)
    And "App1/a1" raises an intent for "uniqueIntent" with contextType "fdc3.magazine"
    Then messaging will have outgoing posts
      | msg.matches_type    | msg.payload.context.type | msg.payload.intent | msg.payload.originatingApp.appId | msg.payload.originatingApp.instanceId | msg.payload.intentResolution.intent | to.instanceId | to.appId        | msg.payload.intentResolution.source.appId |
      | intentEvent         | fdc3.magazine            | uniqueIntent       | App1                             | a1                                    | {null}                              | c1            | uniqueIntentApp | {null}                                    |
      | raiseIntentResponse | {null}                   | {null}             | {null}                           | {null}                                | uniqueIntent                        | a1            | App1            | uniqueIntentApp                           |

  Scenario: Raising an Intent to a Non-Existent App
    And "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "completelyMadeUp"
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.error    | to.instanceId | to.appId |
      | raiseIntentResponse | TargetAppUnavailable | a1            | App1     |

  Scenario: Raising An Intent To A Non-Existent App Instance
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "libraryApp/unknownInstance"
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.error         | to.instanceId |
      | raiseIntentResponse | TargetInstanceUnavailable | a1            |

  Scenario: Raising An Intent To A Running App instance by instanceId
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "listenerApp/b1"
    Then messaging will have outgoing posts
      | msg.matches_type    | msg.payload.context.type | msg.payload.intent | msg.payload.originatingApp.appId | msg.payload.originatingApp.instanceId | msg.payload.intentResolution.intent | to.instanceId | to.appId    | msg.payload.intentResolution.source.appId |
      | intentEvent         | fdc3.book                | returnBook         | App1                             | a1                                    | {null}                              | b1            | listenerApp | {null}                                    |
      | raiseIntentResponse | {null}                   | {null}             | {null}                           | {null}                                | returnBook                          | a1            | App1        | listenerApp                               |

  Scenario: Raising An Intent To A Non-Running App
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "libraryApp"
    And "uuid-0" sends validate
    And "libraryApp/0" registers an intent listener for "returnBook"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.payload.intent | to.instanceId | to.appId   | msg.payload.context.type |
      | addIntentListenerResponse | {null}             |             0 | libraryApp | {null}                   |
      | intentEvent               | returnBook         |             0 | libraryApp | fdc3.book                |
      | raiseIntentResponse       | {null}             | a1            | App1       | {null}                   |

  Scenario: Raising An Intent That Appplies to A Non-Running But Uniquely Identifiable App
    When "App1/a1" raises an intent for "sleepyIntent" with contextType "fdc3.periodical"
    And "uuid-0" sends validate
    And "libraryApp/0" registers an intent listener for "sleepyIntent"
    Then messaging will have outgoing posts
      | msg.matches_type          | msg.payload.intent | to.instanceId | to.appId   | msg.payload.context.type |
      | addIntentListenerResponse | {null}             |             0 | libraryApp | {null}                   |
      | intentEvent               | sleepyIntent       |             0 | libraryApp | fdc3.periodical          |
      | raiseIntentResponse       | {null}             | a1            | App1       | {null}                   |

  Scenario: Raising an Intent to a Non-Existent App Instance
    And "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "unusedApp/u1"
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.error         | to.instanceId | to.appId |
      | raiseIntentResponse | TargetInstanceUnavailable | a1            | App1     |

  Scenario: Raising an Intent to an invalid App Instance
    And "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on an invalid app instance
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.error    | to.instanceId | to.appId |
      | raiseIntentResponse | TargetAppUnavailable | a1            | App1     |

  Scenario: Raising An Intent To A Non-Running App without A Context Type in the listener
    When "App1/a1" raises an intent for "stampBook" with contextType "fdc3.book" on app "libraryApp"
    Then messaging will have outgoing posts
      | msg.payload.error | msg.type            |
      | NoAppsFound       | raiseIntentResponse |

  Scenario: Raising An Intent To A Broken App that doesn't add an intent listener
    When "App1/a1" raises an intent for "returnBook" with contextType "fdc3.book" on app "libraryApp"
    And "uuid-0" sends validate
    And we wait for the intent timeout
    Then running apps will be
      | appId           | instanceId |
      | uniqueIntentApp | c1         |
      | listenerApp     | b1         |
      | App1            | a1         |
      | libraryApp      | uuid-0     |
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.error    | to.instanceId | to.appId |
      | raiseIntentResponse | IntentDeliveryFailed | a1            | App1     |

  Scenario: User Must Choose An Intent using The Intent Resolver
    When "App1/a1" raises an intent for "borrowBook" with contextType "fdc3.book"
    Then messaging will have outgoing posts
      | msg.type            | msg.payload.appIntent.intent.name | msg.payload.appIntent.intent.displayName | to.instanceId | to.appId |
      | raiseIntentResponse | borrowBook                        | borrowBook                               | a1            | App1     |
    Then messaging will have outgoing posts
      | msg.payload.appIntent.apps[0].appId | msg.payload.appIntent.apps[0].instanceId |
      | listenerApp                         | b1                                       |
    Then messaging will have outgoing posts
      | msg.payload.appIntent.apps[1].appId | msg.payload.appIntent.apps[1].instanceId |
      | libraryApp                          | {null}                                   |
    Then messaging will have outgoing posts
      | msg.payload.appIntent.apps[2].appId | msg.payload.appIntent.apps[2].instanceId |
      | listenerApp                         | {null}                                   |

  Scenario: Raising An Invalid Intent to the server (no instance)
    When "App1/a1" raises an intent for "borrowBook" with contextType "fdc3.book" on app "listenerApp/z1"
    Then messaging will have outgoing posts
      | msg.payload.error         | msg.type            |
      | TargetInstanceUnavailable | raiseIntentResponse |

  Scenario: Raising An Invalid Intent (no app)
    When "App1/a1" raises an intent for "borrowBook" with contextType "fdc3.book" on app "nonExistentApp"
    Then messaging will have outgoing posts
      | msg.payload.error    | msg.type            |
      | TargetAppUnavailable | raiseIntentResponse |

  Scenario: Raising An Invalid Intent (non existent intent)
    When "App1/a1" raises an intent for "nonExistentIntent" with contextType "fdc3.book"
    Then messaging will have outgoing posts
      | msg.payload.error | msg.type            |
      | NoAppsFound       | raiseIntentResponse |

  Scenario: Raising An Invalid Intent (non existent intent but valid app)
    When "App1/a1" raises an intent for "nonExistentIntent" with contextType "fdc3.book" on app "listenerApp/b1"
    Then messaging will have outgoing posts
      | msg.payload.error | msg.type            |
      | NoAppsFound       | raiseIntentResponse |
