Feature: Different Strategies for Accessing the Desktop Agent

  Background: Desktop Agent API
    Given a parent window document in "parentDoc", window in "parentWin", child window document in "childDoc" and window in "childWin"
    And SessionStorage is clear

  Scenario: Running inside a Browser and using post message with direct message ports and no identityUrl
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |    8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I refer to "{document.body.children[0]}" as "channel-selector"
    And I refer to "{channel-selector.children[0]}" as "iframe"
    And "{childWin.fdc3}" is undefined
    And "{childWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP3Handshake |
    And "{parentWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP1Hello     |
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Running inside a Browser and using post message, direct message ports, no identityUrl and default UI URLs
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response and uses default UI URLs
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |    8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I refer to "{document.body.children[0]}" as "channel-selector"
    And I refer to "{channel-selector.children[0]}" as "iframe"
    And "{childWin.fdc3}" is undefined
    And "{childWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP3Handshake |
    And "{parentWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP1Hello     |
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Connecting with a specified identityUrl
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | identityUrl                              | timeoutMs | intentResolver | channelSelector |
      | true              | https://dummyOrigin.test/alternativePath | 8000      | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId        | appMetadata.instanceId        | provider               |
      |         2.0 | cucumber-alternative-app | cucumber-alternative-instance | cucumber-provider      |
    And "{childWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP3Handshake |
    And "{parentWin.events}" is an array of objects with the following contents
      | type    | data.type     |
      | message | WCP1Hello     |
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Connecting with an unknown identityUrl fails
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | identityUrl                     | timeoutMs | intentResolver | channelSelector |
      | true              | "https://bad.identity.com/path" | 4000      | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "AccessDenied"

Scenario: Connecting but identity validation times out
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response, but times out identity validation
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              | 2000      | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "ErrorOnConnect"

  Scenario: Running inside a Browser using the embedded iframe strategy
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns iframe response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs |
      | false             |    8000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I refer to "{childDoc.iframes[0]}" as "embedded-iframe"
    Then "{embedded-iframe}" is an object with the following contents
      | tag    | atts.name           | style.width | style.height |
      | iframe | FDC3 Communications |         0px |          0px |
    And I refer to "{childDoc.iframes[1]}" as "intent-resolver-iframe"
    And I refer to "{childDoc.iframes[2]}" as "channel-selector-iframe"
    Then "{channel-selector-iframe}" is an object with the following contents
      | tag    | atts.name             | atts.src                              | style.width | style.height |
      | iframe | FDC3 Channel Selector | https://mock.fdc3.com/channelSelector |        100% |         100% |
    Then "{intent-resolver-iframe}" is an object with the following contents
      | tag    | atts.name            | atts.src                       | style.width | style.height |
      | iframe | FDC3 Intent Resolver | https://mock.fdc3.com/resolver |        100% |         100% |
    And "{childWin.fdc3}" is not null
    And "{childWin.events}" is an array of objects with the following contents
      | type      | data.type              |
      | message   | WCP2LoadUrl            |
      | message   | WCP3Handshake          |
      | message   | Fdc3UserInterfaceHello |
      | message   | Fdc3UserInterfaceHello |
      | fdc3Ready | {null}                 |
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Desktop Agent Preload (injected after the getAgent call with no event)
    In this scenario, window.fdc3 is set by the electron container and returned by getAgent

    Given A Dummy Desktop Agent in "dummy-api"
    And I call fdc3Ready for a promise result
    And I refer to "{result}" as "theAPIPromise"
    And we wait for a period of "500" ms
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | preload-provider |

  Scenario: Desktop Agent Preload (arrived after getAgent call with fdc3Ready event) 
    In this scenario, window.fdc3 is set by the electron container and returned by getAgent

    Given A Dummy Desktop Agent in "dummy-api"
    And I call fdc3Ready for a promise result
    And I refer to "{result}" as "theAPIPromise"
    And we wait for a period of "100" ms
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}" and fdc3Ready is fired
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | preload-provider |
 
  Scenario: Desktop Agent preload (present before getAgent call)
    In this scenario, window.fdc3 is set by the electron container and returned by getAgent

    Given A Dummy Desktop Agent in "dummy-api"
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    And I call fdc3Ready for a promise result
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | preload-provider |

  Scenario: Failover Strategy returning desktop agent
    Given A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns a promise of "{dummy-api}"
    And I call getAgent for a promise result with the following options
      | failover        | timeoutMs |
      | {dummyFailover} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | preload-provider |

  Scenario: Failover Strategy returning a proxy
    Given "dummyFailover2" is a function which opens an iframe for communications on "{childDoc}"
    And I call getAgent for a promise result with the following options
      | failover         | timeoutMs |
      | {dummyFailover2} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Failover Strategy returning an invalid result
    Given "invalidFailover" is a function which returns a promise of "some string"
    And I call getAgent for a promise result with the following options
      | failover        | timeoutMs |
      | {invalidFailover} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "InvalidFailover"

  Scenario: Failover that is not a function
    Given I call getAgent for a promise result with the following options
      | failover        | timeoutMs |
      | "some string" |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "InvalidFailover"

  Scenario: Failover with identity validation timeout
    Given "dummyFailover2" is a function which opens an iframe for communications on "{childDoc}" but times out identity validation
    And I call getAgent for a promise result with the following options
      | failover         | timeoutMs |
      | {dummyFailover2} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve within 10 seconds
    And "{result}" is an error with message "ErrorOnConnect"

  Scenario: Recover adaptor URL from SessionStorage
  Here, we recover the details of the session from the session state, obviating the need to 
  make a request to the parent iframe.

    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns iframe response
    And an existing app instance in "instanceID"
    And SessionStorage contains instanceUuid "some-instance-uuid", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path", agentType "PROXY_URL" and agentUrl "http://localhost:8080/static/da/embed.html"
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    Then SessionStorage should contain instanceUuid "some-instance-uuid", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path", agentType "PROXY_URL" and agentUrl "http://localhost:8080/static/da/embed.html"
    And I call "{desktopAgent}" with "disconnect"

Scenario: Go straight to (preload) failover as directed by SessionStorage
  Here, we recover the details of the session from the session state, obviating the need to 
  to do discovery and going straight to failover.

    Given A Dummy Desktop Agent in "dummy-api"
    And "dummyFailover" is a function which returns a promise of "{dummy-api}"
    And SessionStorage contains instanceUuid "uuid-0", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path", agentType "FAILOVER" and agentUrl "{undefined}"
    And I call getAgent for a promise result with the following options
      | failover        | timeoutMs |
      | {dummyFailover} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | preload-provider |
    Then SessionStorage for identityUrl "https://dummyOrigin.test/path" should contain the following values
      | appId        | agentType  | identityUrl                     |
      | cucumber-app | FAILOVER   | https://dummyOrigin.test/path   |

  Scenario: Go straight to (proxy) failover as directed by SessionStorage
  Here, we recover the details of the session from the session state, obviating the need to 
  to do discovery and going straight to failover.

    Given "dummyFailover2" is a function which opens an iframe for communications on "{childDoc}"
    And I call getAgent for a promise result with the following options
      | failover         | timeoutMs |
      | {dummyFailover2} |      1000 |
    And SessionStorage contains instanceUuid "uuid-0", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path", agentType "FAILOVER" and agentUrl "{undefined}"
    And I call getAgent for a promise result with the following options
      | failover        | timeoutMs |
      | {dummyFailover} |      1000 |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I call "{result}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    Then SessionStorage for identityUrl "https://dummyOrigin.test/path" should contain the following values
      | appId        | agentType  | identityUrl                   |
      | cucumber-app | FAILOVER   | https://dummyOrigin.test/path |


  Scenario: Handle corrupted data in SessionStorage
  Here we deal with data in SessionStorage that is not in the proper format.

    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And an existing app instance in "instanceID"
    And SessionStorage contains corrupted data
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I call "{desktopAgent}" with "disconnect"
  
  Scenario: Handle truncated data in SessionStorage
  Here we deal with data in SessionStorage that is only partially complete.

    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And an existing app instance in "instanceID"
    And SessionStorage contains partial data with with identityUrl "https://dummyOrigin.test/path", appId "cucumber-app" and agentType "PROXY_PARENT"
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |
    And I call "{desktopAgent}" with "disconnect"

  Scenario: Latch to Desktop Agent Proxy parent via SessionStorage
  Here, we recover the details of the session from session storage, and latch to the
  same Desktop Agent type (preload) - the connection should succeed.

    Given A Dummy Desktop Agent in "dummy-api"
    And Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And SessionStorage contains instanceUuid "{instanceID}", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path" and agentType "PROXY_PARENT"
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    And I call fdc3Ready for a promise result
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | cucumber-provider |

  Scenario: Latch to Desktop Agent Preload via SessionStorage
  Here, we recover the details of the session from session storage, and latch to the
  same Desktop Agent type (preload) - the connection should succeed.

    Given A Dummy Desktop Agent in "dummy-api"
    And Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And SessionStorage contains instanceUuid "{instanceID}", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path" and agentType "PRELOAD"
    And I call fdc3Ready for a promise result
    And I refer to "{result}" as "theAPIPromise"
    And we wait for a period of "500" ms
    And `window.fdc3` is injected into the runtime with the value in "{dummy-api}"
    Then the promise "{theAPIPromise}" should resolve
    And I refer to "{result}" as "desktopAgent"
    And I call "{desktopAgent}" with "getInfo"
    Then "{result}" is an object with the following contents
      | fdc3Version | appMetadata.appId | provider          |
      |         2.0 | cucumber-app      | preload-provider |

Scenario: Latch to Desktop Agent Preload via SessionStorage which has gone away
  Here, we recover the details of the session from session storage, and latch to the
  same Desktop Agent type (preload) - the connection should fail.
    Given SessionStorage contains instanceUuid "{instanceID}", appId "cucumber-app" with identityUrl "https://dummyOrigin.test/path" and agentType "PRELOAD"
    And Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |    3000   | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "AgentNotFound"

  Scenario: Nothing works and we timeout
    When I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      4000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise"
    Then the promise "{theAPIPromise}" should resolve
    And "{result}" is an error with message "AgentNotFound"

  Scenario: Someone calls getAgent twice
    Given Parent Window desktop "da" listens for postMessage events in "{parentWin}", returns direct message response
    And we wait for a period of "200" ms
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise1"
    And I call getAgent for a promise result with the following options
      | dontSetWindowFdc3 | timeoutMs | intentResolver | channelSelector |
      | true              |      8000 | false          | false           |
    And I refer to "{result}" as "theAPIPromise2"
    Then the promise "{theAPIPromise1}" should resolve
    And I refer to "{result}" as "desktopAgent1"
    And the promise "{theAPIPromise2}" should resolve
    And I refer to "{result}" as "desktopAgent2"
    And "{desktopAgent1}" is "{desktopAgent2}"
    And I call "{desktopAgent1}" with "disconnect"

  Scenario: We dump any open handles
    Given I call "{parentDoc}" with "shutdown"
    Then I call "{childDoc}" with "shutdown"
    Then Testing ends after "8000" ms 
