Feature: Cyptographics

  Background: Public and Private Keys Available
    Given A New Signing Keypair loaded into "public" and "private"
    Given A New Encryption Keypair loaded into "epubKey" and "eprivKey"
    Given A Symmetric key loaded into "symkey"
    Given A Client Side Implementation in "api"
    Given A Local URL Resolver in "urlResolver" resolving "https://blah.com/pubKey" to "{public}" and "{epubKey}"
    Given A timestamp in "date"
    Given "instrumentContext" is a "fdc3.instrument" context

  Scenario: Use a public/private key pair to sign and check a message
    Given I call "{api}" with "initSigner" with parameters "{private}" and "https://blah.com/pubKey"
    And I refer to "{result}" as "signer"
    And I call "{api}" with "initChecker" with parameter "{urlResolver}"
    And I refer to "{result}" as "checker"
    And I call "{signer}" with parameters "This is a test message" and "{date}"
    Then "{result}" is an object with the following contents
      | algorithm.name | algorithm.hash | publicKeyUrl            |
      | ECDSA          | SHA-512        | https://blah.com/pubKey |
    And I refer to "{result}" as "signature"
    And I call "{checker}" with parameters "{signature}" and "This is a test message"
    Then "{result}" is an object with the following contents
      | verified | valid | publicKeyUrl            |
      | true     | true  | https://blah.com/pubKey |

  Scenario: Use a symmetric key to encrypt and decrypt a context item
    Given I call "{api}" with "initEncrypt" with parameter "{symkey}"
    And I refer to "{result}" as "encrypter"
    And I call "{api}" with "initDecrypt" with parameter "{symkey}"
    And I refer to "{result}" as "decrypter"
    And I call "{encrypter}" with parameters "{instrumentContext}" and "{symkey}"
    Then "{result}" is an object with the following contents
      | __encrypted.algorithm.name | type            |
      | AES-GCM                    | fdc3.instrument |
    And I refer to "{result}" as "encryptedContext"
    And I call "{decrypter}" with parameters "{encryptedContext.__encrypted}" and "{symkey}"
    Then "{result}" is an object with the following contents
      | type            | name  | id.ticker |
      | fdc3.instrument | Apple | AAPL      |

  Scenario: Use a public/private key pair to wrap/unwrap a symmetric key
    Given I call "{api}" with "initWrapKey" with parameter "{urlResolver}"
    And I refer to "{result}" as "wrapper"
    And I call "{wrapper}" with parameters "{symkey}" and "https://blah.com/pubKey"
    Then "{result}" is an object with the following contents
      | algorithm.name | type                                | id.publicKeyUrl         |
      | RSA-OAEP       | fdc3.security.symmetricKey.response | https://blah.com/pubKey |
    And I call "{api}" with "unwrapKey" with parameters "{result}" and "{eprivKey}"
