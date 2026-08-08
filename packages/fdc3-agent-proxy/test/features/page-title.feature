Feature: Page Title Synchronization

  Background: Desktop Agent API
    Given schemas loaded
    And A Desktop Agent in "api"

  Scenario: Initial title is sent on connection
    Given a page title watcher with title "AAPL Stock Chart"
    When page title support is connected
    Then messaging will have posts
      | payload.instanceMetadata.title | matches_type               |
      | AAPL Stock Chart               | updateInstanceMetadataRequest |

  Scenario: Title changes are sent automatically
    Given a page title watcher with title "AAPL Stock Chart"
    And page title support is connected
    When the page title changes to "MSFT Stock Chart"
    Then messaging will have posts
      | payload.instanceMetadata.title | matches_type               |
      | MSFT Stock Chart               | updateInstanceMetadataRequest |

  Scenario: Empty titles are not sent
    Given a page title watcher with title ""
    When page title support is connected
    Then messaging will have no updateInstanceMetadata posts

  Scenario: Whitespace-only titles are not sent
    Given a page title watcher with title "   "
    When page title support is connected
    Then messaging will have no updateInstanceMetadata posts

  Scenario: Duplicate titles are only sent once
    Given a page title watcher with title "AAPL Stock Chart"
    And page title support is connected
    When the page title changes to "AAPL Stock Chart"
    Then messaging will have 1 updateInstanceMetadata posts

  Scenario: Disconnecting stops watching the page title
    Given a page title watcher with title "AAPL Stock Chart"
    And page title support is connected
    When page title support is disconnected
    And the page title changes to "MSFT Stock Chart"
    Then messaging will have 1 updateInstanceMetadata posts

  Scenario: Errors sending instance metadata are handled gracefully
    Given a page title watcher with title "AAPL Stock Chart"
    When page title support is connected to a failing agent
    Then messaging will have no updateInstanceMetadata posts

  Scenario: The default DOM title watcher reports no title outside a browser
    Then the default DOM title watcher reports no title
