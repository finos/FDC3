Feature: Basic User Channels Support

Background: Desktop Agent API
    Given A Basic API Setup

    Scenario: List User Channels    

        There should be a selection of user channels to choose from

        When I call the API "getUserChannels"
        Then The result is an array of objects with the following contents
            | id    | type              | displayMetadata.color         |
            | one   | user              | red                           |
            | two   | user              | green                         |
            | three | user              | blue                          |
