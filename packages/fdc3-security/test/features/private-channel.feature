Feature: Private Channel Encryption

  Background:
    Given A Mock Desktop Agent in "mock"
    And A Signing Desktop Agent in "api" wrapping "{mock}" with Dummy Signing Middleware
    And "instrumentContextIH" is a "fdc3.instrument" context with dummy signature field length 137
    And "instrumentContext" is a "fdc3.instrument" context
    Given I use "{mock}" wrapped with "{api}" to create a pair of connected, wrapped private channels, "a" and "b"
    And "keyRespondingContextListener" responds to all requests for symmetric keys on private channel "{a}"

  Scenario: A message arrives raising an intent which results in a private channel.
    Given I call "{api}" with "createPrivateChannel"
    And I refer to "{result}" as "privateChannel"
    And I call "{privateChannel}" with "setChannelEncryption" with parameter "true"
    And "resultHandler" is an intent handler which returns "{privateChannel}"
    And I call "{api}" with "addIntentListener" with parameters "viewNews" and "{resultHandler}"
    And I call "{api.delegate.handlers.viewNews}" with parameter "{instrumentContextIH}"
    Then "{result}" is an object with the following contents
      | type    | id      | encrypting |
      | private | priv123 | true       |

  Scenario: A pair of listeners on a private channel can coordinate a symmetric encryption key
This uses a context object to request and return the encryption key

    Given I use "{mock}" wrapped with "{api}" to create a pair of connected, wrapped private channels, "a" and "b"
    And "resultHandler" pipes context to "contexts" and metadata to "metas"
    And "keyRequest" is a "fdc3.security.symmetricKey.request" context
    And I call "{a}" with "setChannelEncryption" with parameter "true"
    And I call "{a}" with "addContextListener" with parameters "fdc3.security.symmetricKey.request" and "{keyRespondingContextListener}"
    And I call "{b}" with "addContextListener" with parameters "fdc3.instrument" and "{resultHandler}"
    And I call "{b}" with "broadcast" with parameter "{keyRequest}"
    And we wait for a period of "1000" ms
    Then "{b.delegate.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type                       |
      | broadcast | fdc3.security.symmetricKey.request |
    Then I call "{a}" with "broadcast" with parameter "{instrumentContext}"
    And we wait for a period of "1000" ms
    Then "{a.delegate.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type                        | args[0].wrappedKey        | args[0].__encrypted.length |
      | broadcast | fdc3.security.symmetricKey.response | {"alg":"dummy","k":"123"} | {null}                     |
      | broadcast | fdc3.instrument                     | {null}                    |                        201 |
    And "{b.delegate.delegate.tracking}" is an array of objects with the following contents
      | method    | args[0].type                       |
      | broadcast | fdc3.security.symmetricKey.request |
    And "{contexts}" is an array of objects with the following contents
      | type            | name  |
      | fdc3.instrument | Apple |
    And "{metas}" is an array of objects with the following contents
      | authenticity.verified | authenticity.valid | authenticity.publicKeyUrl |
      | true                  | true               | https://dummy.com/pubKey  |

  Scenario: An intent result is received containing a private channel.
In this case, the response also contains a wrapped symmetric encryption key, so we need to unwrap it and instantiate it.

  Scenario: A message is received on the encrypted private channel.
To properly understand the payload of the message, we're going to need to decrypt the encryptedPayload field, using the pre-agreed 
symmetric key

  Scenario: We are sending a context on the encrypted private channel.
  We need to replace the payload with encrypted payload but leave the context type unchanged so that it can be used in delivery/filtering
