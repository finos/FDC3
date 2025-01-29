Feature: Raising Intents For Context

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name    | Context Type  | Result Type |
      | returnBook     | fdc3.book     | {empty}     |
      | borrowBook     | fdc3.book     | {empty}     |
      | borrowMagazine | fdc3.magazine | {empty}     |
    And "listenerApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | borrowBook  | fdc3.book    | {empty}     |
    And "unusedApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "listenerApp/b1" is opened with connection id "b1"
    And "listenerApp/b1" registers an intent listener for "returnBook"

  Scenario: Raising an Intent With Context to a Non-Existent App
    And "App1/a1" raises an intent with contextType "fdc3.magazine" on app "completelyMadeUp"
    Then messaging will have outgoing posts
      | msg.type                      | msg.payload.error    | to.instanceId | to.appId |
      | raiseIntentForContextResponse | TargetAppUnavailable | a1            | App1     |

  Scenario: Raising An Intent With Context To A Non-Existent App Instance
    When "App1/a1" raises an intent with contextType "fdc3.book" on app "libraryApp/unknownInstance"
    Then messaging will have outgoing posts
      | msg.type                      | msg.payload.error         | to.instanceId |
      | raiseIntentForContextResponse | TargetInstanceUnavailable | a1            |

Scenario: Raising An Intent With Context To An Invalid Instance
    When "App1/a1" raises an intent with contextType "fdc3.book" on an invalid app instance
    Then messaging will have outgoing posts
      | msg.type                      | msg.payload.error         | to.instanceId |
      | raiseIntentForContextResponse | TargetAppUnavailable      | a1            |

  Scenario: Raising An Intent With Context To A Running App
    When "App1/a1" raises an intent with contextType "fdc3.book" on app "listenerApp/b1"
    Then messaging will have outgoing posts
      | msg.matches_type              | msg.payload.context.type | msg.payload.intent | msg.payload.originatingApp.appId | msg.payload.originatingApp.instanceId | msg.payload.intentResolution.intent | to.instanceId | to.appId    | msg.payload.intentResolution.source.appId |
      | intentEvent                   | fdc3.book                | returnBook         | App1                             | a1                                    | {null}                              | b1            | listenerApp | {null}                                    |
      | raiseIntentForContextResponse | {null}                   | {null}             | {null}                           | {null}                                | returnBook                          | a1            | App1        | listenerApp                               |

  Scenario: Raising An Intent With Context To A Non-Running App
    When "App1/a1" raises an intent with contextType "fdc3.magazine" on app "libraryApp"
    And "uuid-0" sends validate
    And "libraryApp/0" registers an intent listener for "borrowMagazine"
    Then messaging will have outgoing posts
      | msg.matches_type              | msg.payload.intent | to.instanceId | to.appId   | msg.payload.context.type |
      | addIntentListenerResponse     | {null}             |             0 | libraryApp | {null}                   |
      | intentEvent                   | borrowMagazine     |             0 | libraryApp | fdc3.magazine            |
      | raiseIntentForContextResponse | {null}             | a1            | App1       | {null}                   |

  Scenario: Raising an Intent With Context to a Non-Existent App Instance
    And "App1/a1" raises an intent with contextType "fdc3.book" on app "unusedApp/u1"
    Then messaging will have outgoing posts
      | msg.type                      | msg.payload.error         | to.instanceId | to.appId |
      | raiseIntentForContextResponse | TargetInstanceUnavailable | a1            | App1     |

  Scenario: Raising An Intent With Context To A Broken App that doesn't add an intent listener
    When "App1/a1" raises an intent with contextType "fdc3.magazine" on app "libraryApp"
    And "uuid-0" sends validate
    And we wait for the intent timeout
    Then messaging will have outgoing posts
      | msg.type                      | msg.payload.error    | to.instanceId | to.appId |
      | raiseIntentForContextResponse | IntentDeliveryFailed | a1            | App1     |

  Scenario: User Must Choose An Intent using The Intent Resolver
    When "App1/a1" raises an intent with contextType "fdc3.book"
    Then messaging will have outgoing posts
      | msg.type                      | msg.payload.appIntents[0].intent.name | msg.payload.appIntents[1].intent.name | to.instanceId | to.appId |
      | raiseIntentForContextResponse | returnBook                            | borrowBook                            | a1            | App1     |
    Then messaging will have outgoing posts
      | msg.payload.appIntents[0].apps[0].appId | msg.payload.appIntent.apps[0].instanceId |
      | libraryApp                              | {null}                                   |
    Then messaging will have outgoing posts
      | msg.payload.appIntents[1].apps[0].appId | msg.payload.appIntents[1].apps[0].instanceId |
      | listenerApp                             | b1                                           |
    Then messaging will have outgoing posts
      | msg.payload.appIntents[1].apps[1].appId | msg.payload.appIntents[1].apps[1].instanceId |
      | libraryApp                              | {null}                                       |
    Then messaging will have outgoing posts
      | msg.payload.appIntents[1].apps[2].appId | msg.payload.appIntents[1].apps[2].instanceId |
      | listenerApp                             | {null}                                       |
