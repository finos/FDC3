Feature: Find Intent API

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type      |
      | loanBook    | fdc3.book    | fdc3.loan        |
      | streamBook  | fdc3.book    | channel<chapter> |
      | returnBook  | fdc3.book    | {empty}          |
      | streamAny   | fdc3.book    | channel          |
    And "bakeryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | viewStock   | fdc3.product | {empty}     |
    And "butcherApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | viewStock   | fdc3.product | {empty}     |
    And "chandlerApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | viewStock   | fdc3.product | {empty}     |
    And A newly instantiated FDC3 Server
    And "App1/a1" is opened with connection id "a1"
    And "App1/b1" is opened with connection id "b1"
    And "App1/b1" registers an intent listener for "returnBook"
    And "butcherApp/b2" is opened with connection id "b2"
    And "butcherApp/b2" registers an intent listener for "viewStock"
    #first app returned by directory must have an instance to cover all branches in findIntentsByContextRequest
    And "bakeryApp/b3" is opened with connection id "b3"
    And "bakeryApp/b3" registers an intent listener for "viewStock"
    And we wait for a period of "100" ms

  Scenario: Unsuccessful Find Intents Request
    When "App1/a1" finds intents with intent "loanBook" and contextType "fdc3.instrument" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | loanBook                          |                                 0 | a1            |

  Scenario: Unsuccessful Find Intents Request With Result Type
    When "App1/a1" finds intents with intent "loanBook" and contextType "{empty}" and result type "unknownContext"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | loanBook                          |                                 0 | a1            |

  Scenario: Successful Find Intents Request
    When "App1/a1" finds intents with intent "loanBook" and contextType "{empty}" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | msg.payload.appIntent.apps[0].appId | to.instanceId | msg.payload.appIntent.intent.displayName |
      | findIntentResponse | loanBook                          |                                 1 | libraryApp                          | a1            | loan book                                |

  Scenario: Find Intents Requests should include both the app and running instances of it
    When "App1/a1" finds intents with intent "viewStock" and contextType "fdc3.product" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | viewStock                         |                                 5 | a1            |
    When "butcherApp/b2" is closed
    And "App1/a1" finds intents with intent "viewStock" and contextType "fdc3.product" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | viewStock                         |                                 4 | a1            |

  Scenario: Find Intents by Context Request
    When "App/a1" finds intents with contextType "fdc3.book"
    Then messaging will have outgoing posts
      | msg.matches_type             | msg.payload.appIntents[0].intent.name | msg.payload.appIntents.length | to.instanceId | msg.payload.appIntents[0].intent.displayName |
      | findIntentsByContextResponse | loanBook                              |                             4 | a1            | loan book                                    |

  Scenario: Find Intents by Context Request with multiple results
    When "App/a1" finds intents with contextType "fdc3.product"
    Then messaging will have outgoing posts
      | msg.matches_type             | msg.payload.appIntents[0].intent.name | msg.payload.appIntents.length | to.instanceId | msg.payload.appIntents[0].apps.length |
      | findIntentsByContextResponse | viewStock                             |                             1 | a1            |                                     5 |

  Scenario: Find Intents by Context Request with multiple results which should not include an instance that has closed
    When "butcherApp/b2" is closed
    When "App/a1" finds intents with contextType "fdc3.product"
    Then messaging will have outgoing posts
      | msg.matches_type             | msg.payload.appIntents[0].intent.name | msg.payload.appIntents.length | to.instanceId | msg.payload.appIntents[0].apps.length |
      | findIntentsByContextResponse | viewStock                             |                             1 | a1            |                                     4 |

  Scenario: Successful Find Intents Request With Channel
    When "App1/a1" finds intents with intent "streamBook" and contextType "fdc3.book" and result type "channel"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | msg.payload.appIntent.apps[0].appId | to.instanceId |
      | findIntentResponse | streamBook                        |                                 1 | libraryApp                          | a1            |

  Scenario: Successful Find Intents Request With A Typed Channel
    When "App1/a1" finds intents with intent "streamBook" and contextType "{empty}" and result type "channel<chapter>"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | msg.payload.appIntent.apps[0].appId | to.instanceId |
      | findIntentResponse | streamBook                        |                                 1 | libraryApp                          | a1            |

  Scenario: Unsuccessful Find Intents Request With an untyped Channel
    When "App1/a1" finds intents with intent "streamAny" and contextType "{empty}" and result type "channel<spurious>"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length |
      | findIntentResponse | streamAny                         |                                 0 |

  Scenario: Find Intent includes results for a running app with intent listener
    When "App1/a1" finds intents with intent "returnBook" and contextType "fdc3.book" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId |
      | findIntentResponse | returnBook                        |                                 2 | a1            |
    And messaging will have outgoing posts
      | msg.payload.appIntent.apps[1].appId | msg.payload.appIntent.apps[1].instanceId |
      | App1                                | b1                                       |
    And messaging will have outgoing posts
      | msg.payload.appIntent.apps[0].appId | msg.payload.appIntent.apps[0].instanceId |
      | libraryApp                          | {empty}                                  |

  Scenario: Disconnecting The Intent Listener
    When "App1/b1" unsubscribes an intent listener with id "uuid3"
    And "App1/a1" finds intents with intent "returnBook" and contextType "fdc3.book" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type                  | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId | msg.payload.appIntent.apps[0].appId |
      | intentListenerUnsubscribeResponse | {null}                            | {null}                            | b1            | {null}                              |
      | findIntentResponse                | returnBook                        |                                 1 | a1            | libraryApp                          |

  Scenario: Find Intent excludes results for a closed app with intent listener
    When "App1/b1" is closed
    And "App1/a1" finds intents with intent "returnBook" and contextType "fdc3.book" and result type "{empty}"
    Then messaging will have outgoing posts
      | msg.matches_type   | msg.payload.appIntent.intent.name | msg.payload.appIntent.apps.length | to.instanceId | msg.payload.appIntent.apps[0].appId |
      | findIntentResponse | returnBook                        |                                 1 | a1            | libraryApp                          |
