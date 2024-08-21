Feature: Default Channel Selector

  Background: Desktop Agent API
    Given a browser document in "document" and window in "window"
    And A Dummy Desktop Agent in "dummy-api"
    And Testing ends after "5000" ms

  Scenario: App Requests Channel Change
    Given "{document.iframes[0]}" receives a "SelectorMessageInitialize" message for the channel selector and pipes comms to "output"
    And we wait for a period of "200" ms
    Then "{output}" is an array of objects with the following contents
      | type    | data.type               | data.channelId | data.channels[0].id | data.channels[1].id | data.channels[2].id |
      | message | SelectorMessageChannels | {null}         | one                 | two                 | three               |
