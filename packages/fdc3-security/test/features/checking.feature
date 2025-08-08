Feature: Checking Signatures

  Background: Desktop Agent API
    Given A Mock Desktop Agent in "mock"
    Given A Signing Desktop Agent in "api" wrapping "{mock}" with Dummy Signing Middleware
    Given "instrumentContextAC" is a "fdc3.instrument" context with dummy signature field length 113
    Given "instrumentContextUC" is a "fdc3.instrument" context with dummy signature field length 108
    Given "instrumentContextPC" is a "fdc3.instrument" context with dummy signature field length 112
    Given "instrumentContextIH" is a "fdc3.instrument" context with dummy signature field length 113
    Given "instrumentContextBadSignature" is a "fdc3.instrument" context with broken signature field
    Given "instrumentContextNoSignature" is a "fdc3.instrument" context

  Scenario: Intent Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    And I call "{api}" with "addIntentListener" with parameters "viewNews" and "{resultHandler}"
    And I call "{api.delegate.handlers.viewNews}" with parameter "{instrumentContextIH}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.trusted | authenticity.valid | authenticity.signed | authenticity.publicKeyUrl |
      | true                 | true               | true                | https://dummy.com/pubKey  |

  Scenario: App Channel Context Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "{api}" with "getOrCreateChannel" with parameter "channel1"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{channel1.delegate.handlers.any}" with parameter "{instrumentContextAC}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.trusted | authenticity.valid | authenticity.signed | authenticity.publicKeyUrl |
      | true                 | true               | true                | https://dummy.com/pubKey  |

  Scenario: User Channel Context Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "{api}" with "getUserChannels"
    And I refer to "{result[0]}" as "firstUserChannel"
    And I call "{api}" with "joinUserChannel" with parameter "{firstUserChannel.id}"
    And I call "{api}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{api.delegate.handlers.any}" with parameter "{instrumentContextUC}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.trusted | authenticity.valid | authenticity.signed | authenticity.publicKeyUrl |
      | true                 | true               | true                | https://dummy.com/pubKey  |

  Scenario: Private Channel Context Handler receives a checked signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{privateChannel}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{privateChannel.delegate.delegate.handlers.any}" with parameter "{instrumentContextPC}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.trusted | authenticity.valid | authenticity.signed | authenticity.publicKeyUrl |
      | true                 | true               | true                | https://dummy.com/pubKey  |

  Scenario: Private Channel Context Handler receives a bad signature back in the metadata
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{privateChannel}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{privateChannel.delegate.delegate.handlers.any}" with parameter "{instrumentContextIH}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.trusted | authenticity.valid | authenticity.signed | authenticity.publicKeyUrl |
      | true                 | false              | true                | https://dummy.com/pubKey  |

  Scenario: Bad Signature that can't be checked
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "{api}" with "getUserChannels"
    And I refer to "{result[0]}" as "firstUserChannel"
    And I call "{api}" with "joinUserChannel" with parameter "{firstUserChannel.id}"
    And I call "{api}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{api.delegate.handlers.any}" with parameter "{instrumentContextBadSignature}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.trusted | authenticity.valid | authenticity.signed | authenticity.publicKeyUrl |
      | true                 | false              | true                | https://dummy.com/pubKey  |

  Scenario: Signature missing
    Given "resultHandler" pipes context to "contexts" and metadata to "metas"
    When I call "{api}" with "getUserChannels"
    And I refer to "{result[0]}" as "firstUserChannel"
    And I call "{api}" with "joinUserChannel" with parameter "{firstUserChannel.id}"
    And I call "{api}" with "addContextListener" with parameters "{null}" and "{resultHandler}"
    And I call "{api.delegate.handlers.any}" with parameter "{instrumentContextNoSignature}"
    Then "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.signed |
      | false               |

  Scenario: Raise Intent receives back a signed intent result
TODO: This is incomplete as we don't yet have a way to return metadata from an intent result.

    Given I call "{api}" with "raiseIntent" with parameters "viewNews" and "{instrumentContextIH}"
    And I refer to "{result}" as "intentResolution"
    And I call "{intentResolution}" with "getResult"
    And I refer to "{result}" as "intentResult"
    Then "{result}" is an object with the following contents
      | type       | text           |
      | dummy.news | Some news item |
