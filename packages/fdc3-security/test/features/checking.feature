Feature: Checking Signatures

  Background: Desktop Agent API
    Given A Mock Desktop Agent in "mock"
    Given A Signing Desktop Agent in "api" wrapping "mock" with Dummy Signing Middleware
    Given "instrumentContextAC" is a "fdc3.instrument" context with dummy signature field length 142
    Given "instrumentContextUC" is a "fdc3.instrument" context with dummy signature field length 119
    Given "instrumentContextPC" is a "fdc3.instrument" context with dummy signature field length 141
    Given "instrumentContextIH" is a "fdc3.instrument" context with dummy signature field length 139

  Scenario: Intent Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    And I call "api" with "addIntentListener" with parameters "viewNews" and "{resultHandler}"
    And I call "{api.delegate.handlers.viewNews}" with parameter "{instrumentContextIH}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.verified | authenticity.valid | authenticity.publicKeyUrl |
      | true                  | true               | https://dummy.com/pubKey  |

  Scenario: App Channel Context Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "api" with "getOrCreateChannel" with parameter "channel1"
    And I refer to "result" as "channel1"
    And I call "channel1" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{channel1.delegate.handlers.any}" with parameter "{instrumentContextAC}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.verified | authenticity.valid | authenticity.publicKeyUrl |
      | true                  | true               | https://dummy.com/pubKey  |

  Scenario: User Channel Context Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "api" with "getUserChannels"
    And I refer to "result[0]" as "firstUserChannel"
    And I call "api" with "joinUserChannel" with parameter "{firstUserChannel.id}"
    And I call "api" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{api.delegate.handlers.any}" with parameter "{instrumentContextUC}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.verified | authenticity.valid | authenticity.publicKeyUrl |
      | true                  | true               | https://dummy.com/pubKey  |

  Scenario: Private Channel Context Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "api" with "createPrivateChannel"
    And I refer to "result" as "privateChannel"
    And I call "privateChannel" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{privateChannel.delegate.delegate.handlers.any}" with parameter "{instrumentContextPC}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.verified | authenticity.valid | authenticity.publicKeyUrl |
      | true                  | true               | https://dummy.com/pubKey  |
