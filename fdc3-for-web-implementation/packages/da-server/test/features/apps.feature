Feature: Opening and Requesting App Details

  Background:
    Given schemas loaded
    And "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And "storageApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | loanBook    | fdc3.book    | fdc3.loan   |
    And A newly instantiated FDC3 Server
    And "libraryApp/a1" is opened with connection id "lx1"

  Scenario: Looking up app metadata
    When "libraryApp/a1" requests metadata for "storageApp"
    Then messaging will have outgoing posts
      | msg.payload.appMetadata.appId | to.instanceId | msg.matches_type       |
      | storageApp                    | a1            | getAppMetadataResponse |

  Scenario: Looking up app metadata from missing app
    When "libraryApp/a1" requests metadata for "unknownApp"
    Then messaging will have outgoing posts
      | msg.payload.error    | to.instanceId | msg.type               |
      | TargetAppUnavailable | a1            | getAppMetadataResponse |

  Scenario: Opening An App
    When "libraryApp/a1" opens app "storageApp"
    And "uuid-0" sends validate
    Then messaging will have outgoing posts
      | msg.matches_type                | msg.payload.appIdentifier.appId | msg.payload.appIdentifier.instanceId | msg.payload.appId | msg.payload.instanceId | to.instanceId | to.appId   |
      | WCP5ValidateAppIdentityResponse | {null}                          | {null}                               | storageApp        |                      0 |             0 | storageApp |
      | openResponse                    | storageApp                      |                                    0 | {null}            | {null}                 | a1            | libraryApp |

  Scenario: Storage App Reconnects
    When "libraryApp/a1" opens app "storageApp"
    And "uuid-0" sends validate
    And we wait for a period of "100" ms
    And "uuid-0" revalidates
    Then messaging will have outgoing posts
      | msg.matches_type                | msg.payload.appIdentifier.appId | msg.payload.appIdentifier.instanceId | msg.payload.appId | msg.payload.instanceId | to.instanceId | to.appId   |
      | WCP5ValidateAppIdentityResponse | {null}                          | {null}                               | storageApp        |                      0 |             0 | storageApp |
      | openResponse                    | storageApp                      |                                    0 | {null}            | {null}                 | a1            | libraryApp |
      | WCP5ValidateAppIdentityResponse | {null}                          | {null}                               | storageApp        |                      0 |             0 | storageApp |

  Scenario: Opening An App With Context
ISSUE: 1310 causes this to fail right now

    When "libraryApp/a1" opens app "storageApp" with context data "fdc3.instrument"
    And "uuid-0" sends validate
    And we wait for a period of "100" ms
    And "storageApp/0" adds a context listener on "{null}" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.matches_type                | msg.payload.channelId | msg.payload.context.type | to.instanceId | to.appId   |
      | WCP5ValidateAppIdentityResponse | {null}                | {null}                   |             0 | storageApp |
      | addContextListenerResponse      | {empty}               | {empty}                  |             0 | storageApp |
      | openResponse                    | {empty}               | {empty}                  | a1            | libraryApp |
      | broadcastEvent                  | {null}                | fdc3.instrument          |             0 | storageApp |

  Scenario: Opening An App With Context, But No Listener Added
    When "libraryApp/a1" opens app "storageApp" with context data "fdc3.instrument"
    And "uuid-0" sends validate
    And we wait for the listener timeout
    Then messaging will have outgoing posts
      | msg.type                        | msg.payload.error | to.instanceId | to.appId   |
      | WCP5ValidateAppIdentityResponse | {null}            |             0 | storageApp |
      | openResponse                    | AppTimeout        | a1            | libraryApp |

  Scenario: Opening A Missing App
    When "libraryApp/a1" opens app "missingApp"
    Then messaging will have outgoing posts
      | msg.type     | msg.payload.error | to.instanceId |
      | openResponse | AppNotFound       | a1            |

  Scenario: Find Instances with No Apps Running
    And "libraryApp/a1" findsInstances of "App1"
    Then messaging will have outgoing posts
      | msg.matches_type      | msg.payload.appIdentifiers.length | to.instanceId |
      | findInstancesResponse |                                 0 | a1            |

  Scenario: Find Instances with Some Apps Running
    When "storageApp/b1" is opened with connection id "abc"
    And "abc" sends validate
    And "storageApp/b2" is opened with connection id "def"
    And "def" sends validate
    And "libraryApp/a1" findsInstances of "storageApp"
    And we wait for a period of "100" ms
    Then messaging will have outgoing posts
      | msg.matches_type                | msg.payload.appIdentifiers.length | msg.payload.appIdentifiers[0].instanceId | msg.payload.appIdentifiers[1].instanceId | to.instanceId | msg.payload.appId |
      | WCP5ValidateAppIdentityResponse | {null}                            | {null}                                   | {null}                                   | b1            | storageApp        |
      | WCP5ValidateAppIdentityResponse | {null}                            | {null}                                   | {null}                                   | b2            | storageApp        |
      | findInstancesResponse           |                                 2 | b1                                       | b2                                       | a1            | {null}            |
