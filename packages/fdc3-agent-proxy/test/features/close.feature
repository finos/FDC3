Feature: Close App

  Background: Desktop Agent API
    Given A Desktop Agent in "api"
    And schemas loaded
    And app "chipShop/c1"

  Scenario: Close the calling app
    When I call "{api}" with "close"
    Then messaging will have posts
      | matches_type  |
      | closeRequest  |

  Scenario: Close the calling app - Destructured
    When I destructure method "close" from "{api}"
    And I call destructured "close"
    Then messaging will have posts
      | matches_type  |
      | closeRequest  |

  Scenario: Close fails
    Given close will fail
    When I call "{api}" with "close"
    Then "{result}" is an error with message "ErrorOnClose"
    And messaging will have posts
      | matches_type  |
      | closeRequest  |
