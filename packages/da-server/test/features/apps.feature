Feature: Opening and Requesting App Details

  Background: 
    Given "libraryApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | returnBook  | fdc3.book    | {empty}     |
    Given "storageApp" is an app with the following intents
      | Intent Name | Context Type | Result Type |
      | loanBook    | fdc3.book    | fdc3.loan   |

  Scenario: Looking up app metadata
    When "libraryApp/a1" opens app "storageApp" with context data "fdc3.instrument"
    Then messaging will have outgoing posts
      | msg.source.AppId | msg.source.instanceId | msg.payload.context.type |

  Scenario: Looking up app metadata from missing app

  Scenario: Opening An App

  Scenario: Opening An App With Context

  Scenario: Opening A Missing App
