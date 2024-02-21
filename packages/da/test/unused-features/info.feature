Feature: Desktop Agent Information

  Background: Desktop Agent API
    Given A Desktop Agent in "api1"

    Scenario: Calling the "getInfo" method

        When I call "api1" with "getInfo" 
        Then "{result}" is an object with the following contents
            | id    | type              | displayMetadata.color         |
            | one   | user              | red                           |
