Feature: Default Channel Selector

  Background: Desktop Agent API
    Given a browser document in "document" and window in "window"
    And A Channel Selector in "channel-selector" with callback piping to "cb"
    Given User Channels one, two and three in "channel-list"

  Scenario: Channel Selector Requests Channel Change
    Given The channel selector sends a channel change message for channel "one"
    And we wait for a period of "200" ms
    Then "{cb}" is "one"
    And I call "{document}" with "shutdown"

  Scenario: Updating channel information in the channel selector
    Given I call "{channel-selector}" with "updateChannel" with parameters "one" and "{channel-list}"
    And we wait for a period of "200" ms
    Then "{lastChannelSelectorMessage}" is an object with the following contents
      | type           | payload.selected | payload.userChannels[0].id | payload.userChannels[1].id | payload.userChannels[2].id |
      | Fdc3UserInterfaceChannels | one              | one                        | two                        | three                      |
    And I call "{document}" with "shutdown"
