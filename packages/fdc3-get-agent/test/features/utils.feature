Feature: Utility functions

  Scenario: Logger utility
    When All log functions are used with a message
    When All log functions are used with an error

  Scenario: UUID generator
    When A uuid is generated
    
# Uncomment to debug the tests not exiting - will dump a list of open handles keeping node open
#   Scenario: We dump any open handles
#     Given I call "{parentDoc}" with "shutdown"
#     Then I call "{childDoc}" with "shutdown"
#     Then Testing ends after "8000" ms 
