Feature: Private Channel Encryption

  Background:
    Given A Mock Desktop Agent in "mock"
    Given A New Encryption Keypair loaded into "epub" and "epriv"
    Given A New Signing Keypair loaded into "spub" and "spriv"
    Given A Local URL Resolver in "urlResolver" resolving "https://blah.com/pubKey" to "{epub}" and "{spub}"
    Given A Signing Desktop Agent in "api" wrapping "mock" with Real Middleware using "{spriv}", "{epriv}", "https://blah.com/pubKey" and resolver "{urlResolver}"
  # Scenario: A message arrives raising an intent which results in a private channel.
  #   Given I call "api" with "createPrivateChannel"
  #   And I refer to "result" as "privateChannel"
  #   And I call "privateChannel" with "setChannelEncryption" with parameter "true"
  #   And "signedContext" is a "fdc3.instrument" context signed with "{spriv}" and "https://blah.com/pubKey" for intent "viewNews"
  #   Given "resultHandler" is an intent handler which returns "{privateChannel}"
  #   And I call "api" with "addIntentListener" with parameters "viewNews" and "{resultHandler}"
  #   And I call "{api.delegate.handlers.viewNews}" with parameter "{signedContext}"
  #   Then "{result}" is an object with the following contents
  #     | type    | id      | encrypting |
  #     | private | priv123 | true       |

  Scenario: A pair of listeners on a private channel can coordinate a symmetric encryption key
This uses a context object to request and return the encryption key

    Given I use "{mock}" wrapped with "{api}" to create a pair of connected, wrapped private channels, "a" and "b"
    And "keyRequest" is a "fdc3.security.symmetricKey.request" context
    And I call "a" with "setChannelEncryption" with parameter "true"
    And I call "a" with "broadcast" with parameter "{keyRequest}"
    Then "{a.delegate.messages}" is an array of objects with the following contents
      | type    | id      | encrypting |
      | private | priv123 | true       |
    And "{b.delegate.messages}" is an array of objects with the following contents
      | type    | id      | encrypting |
      | private | priv123 | true       |

  Scenario: An intent result is received containing a private channel.
In this case, the response also contains a wrapped symmetric encryption key, so we need to unwrap it and instantiate it.

  Scenario: A message is received on the encrypted private channel.
To properly understand the payload of the message, we're going to need to decrypt the encryptedPayload field, using the pre-agreed 
symmetric key

  Scenario: We are sending a context on the encrypted private channel.
  We need to replace the payload with encrypted payload but leave the context type unchanged so that it can be used in delivery/filtering
