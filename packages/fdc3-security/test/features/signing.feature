Feature: Signing Contexts

  Background: Desktop Agent API
    Given A Mock Desktop Agent in "mock"
    Given A Signing Desktop Agent in "api" wrapping "{mock}" with Dummy Signing Middleware
    Given "instrumentContext" is a "fdc3.instrument" context
    Given "instrumentContextIH" is a "fdc3.instrument" context
    And "trueFunction" is a function which returns "{true}"

  Scenario: App Channel Broadcasts context data will include a signature
We are using "Dummy Crypto" here, which basically just adds a digest containing the length.
In reality, we wouldn't use this, but it makes the test a lot simpler to understand.

    When I call "{api}" with "getOrCreateChannel" with parameter "channel1"
    And I refer to "{result}" as "channel1"
    And I call "{channel1}" with "broadcast" with parameter "{instrumentContext}"
    Then "{channel1.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type    | args[0].id.ticker | args[0].__signature                       |
      | broadcast | fdc3.instrument | AAPL              | length-check:113:https://dummy.com/pubKey |

  Scenario: User Channel Broadasts context data will include a signature
    When I call "{api}" with "getUserChannels"
    And I refer to "{result[0]}" as "firstUserChannel"
    And I call "{api}" with "joinUserChannel" with parameter "{firstUserChannel.id}"
    And I call "{api}" with "broadcast" with parameter "{instrumentContext}"
    Then "{api.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type    | args[0].id.ticker | args[0].__signature                       |
      | broadcast | fdc3.instrument | AAPL              | length-check:107:https://dummy.com/pubKey |

  Scenario: Private Channel Broadasts context data will include a signature
    When I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{privateChannel}" with "broadcast" with parameter "{instrumentContext}"
    Then "{privateChannel.delegate.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type    | args[0].id.ticker | args[0].__signature                       |
      | broadcast | fdc3.instrument | AAPL              | length-check:112:https://dummy.com/pubKey |

  Scenario: Encrypted Private Channel Broadasts context data will include a signature
    When I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{privateChannel}" with "setChannelEncryption" with parameter "{trueFunction}"
    And I call "{privateChannel}" with "broadcast" with parameter "{instrumentContext}"
    Then "{privateChannel.delegate.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type    | args[0].__signature                       | args[0].__encrypted.length |
      | broadcast | fdc3.instrument | length-check:216:https://dummy.com/pubKey |                        125 |

  Scenario: Raise Intent context data will include a signature
    When I call "{api}" with "raiseIntent" with parameters "robsIntent" and "{instrumentContext}"
    Then "{api.delegate.tracking}" is an array of objects with the following contents
      | method      | args[0]    | args[1].type    | args[1].id.ticker | args[1].__signature                       |
      | raiseIntent | robsIntent | fdc3.instrument | AAPL              | length-check:115:https://dummy.com/pubKey |

  Scenario: Raise Intent For Context context data will include a signature
    When I call "{api}" with "raiseIntentForContext" with parameter "{instrumentContext}"
    Then "{api.delegate.tracking}" is an array of objects with the following contents
      | method                | args[0].type    | args[0].id.ticker | args[0].__signature                       |
      | raiseIntentForContext | fdc3.instrument | AAPL              | length-check:107:https://dummy.com/pubKey |

  Scenario: Intent Handler returning a context object has the response signed
    Given "resultHandler" echoes the context back to the raiser
    And I call "{api}" with "addIntentListener" with parameters "viewNews" and "{resultHandler}"
    And I call "{api.delegate.handlers.viewNews}" with parameter "{instrumentContextIH}"
    Then "{result}" is an object with the following contents
      | type            | id.ticker | __signature                               |
      | fdc3.instrument | AAPL      | length-check:113:https://dummy.com/pubKey |
