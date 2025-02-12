Feature: Updating User Channel State

  Background:
    Given schemas loaded
    Given User Channels one, two and three
    And A Channel Selector in "selector" and a Desktop Agent in "api"

  Scenario: Selecting a channel updates the DA
    When The first channel is selected via the channel selector in "selector"
    And The second channel is selected via the channel selector in "selector"
    Then messaging will have posts
      | payload.channelId | matches_type               |
      | one               | joinUserChannelRequest     |
      | two               | joinUserChannelRequest     |
    And The channel is deselected via the channel selector in "selector"
    Then messaging will have posts
      | matches_type               |
      | leaveCurrentChannelRequest |
