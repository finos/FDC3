#Search.feature

Feature: Basic User Channels Testing

    There should be a selection of user channels

    Scenario: List User Channels    
        Given A Basic API Setup
        When I call the API "getUserChannels"
        Then I should have the following ids "red, green, yellow"
