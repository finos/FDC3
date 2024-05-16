Feature: Opening and Requesting App Details

  Background:
    Given "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    And "storageApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | loanBook    | fdc3.book    | fdc3.loan   |
    And A newly instantiated FDC3 Server

  Scenario: Looking up app metadata
    When "libraryApp/a1" requests metadata for "storageApp"
    Then messaging will have outgoing posts
      | msg.type               | msg.payload.appMetadata.appId | to.instanceId |
      | getAppMetadataResponse | storageApp                    | a1            |

  Scenario: Looking up app metadata from missing app
    When "libraryApp/a1" requests metadata for "unknownApp"
    Then messaging will have outgoing posts
      | msg.type               | msg.payload.error    | to.instanceId |
      | getAppMetadataResponse | TargetAppUnavailable | a1            |

  Scenario: Opening An App
    When "libraryApp/a1" opens app "storageApp"
    Then messaging will have outgoing posts
      | msg.type     | msg.payload.appIdentifier.appId | msg.payload.appIdentifier.instanceId | to.instanceId |
      | openResponse | storageApp                      |                                    0 | a1            |

  Scenario: Opening An App With Context
    When "libraryApp/a1" opens app "storageApp" with context data "fdc3.instrument"
    And "storageApp/0" adds a context listener on "channel1" with type "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.type         | msg.payload.channelId | msg.payload.context.type | to.instanceId |
      | openResponse     | {empty}               | {empty}                  | a1            |
      | broadcastRequest | channel1              | fdc3.instrument          |             0 |

  Scenario: Opening An App With Context, But No Listener Added
    When "libraryApp/a1" opens app "storageApp" with context data "fdc3.instrument"
    And "storageApp/0" adds a context listener on "channel1" with type "fdc3.country"
    And we wait for the listener timeout
    Then messaging will have outgoing posts
      | msg.type     | msg.payload.channelId | msg.payload.context.type | to.instanceId |
      | openResponse | {empty}               | {empty}                  | a1            |

  Scenario: Opening A Missing App
    When "libraryApp/a1" opens app "missingApp"
    Then messaging will have outgoing posts
      | msg.type     | msg.payload.error | to.instanceId |
      | openResponse | AppNotFound       | a1            |

  Scenario: Find Instances with No Apps Running
    And "libraryApp/a1" findsInstances of "App1"
    Then messaging will have outgoing posts
      | msg.type              | msg.payload.appIdentifiers.length | to.instanceId |
      | findInstancesResponse |                                 0 | a1            |

  Scenario: Find Instances with Some Apps Running
    When "App1/a1" is opened
    And "App1/b1" is opened
    And "libraryApp/li" findsInstances of "App1"
    Then messaging will have outgoing posts
      | msg.type              | msg.payload.appIdentifiers.length | msg.payload.appIdentifiers[0].instanceId | msg.payload.appIdentifiers[1].instanceId | to.instanceId |
      | findInstancesResponse |                                 2 | a1                                       | b1                                       | li            |
