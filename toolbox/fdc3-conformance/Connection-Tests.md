# Connection Tests

![2.2+](https://img.shields.io/badge/FDC3-2.2+-purple) In FDC3 2.2, the process to get a `DesktopAgent` instance was standardized to use the `getClient` API call on all HTML platforms, whether running inside an electron app or in a browser.  This test pack checks that the connection is made correctly.

## Connection From the App To The Desktop Agent is Via the standard FDC3 `getClient` call

| App | Step            | Description                                              |
|-----|-----------------|----------------------------------------------------------|
| A   | `getClient`     | A calls `getClient` and waits for the promise to resolve to a `DesktopAgent` instance. |
| A   | `getInfo`       |A can call the `getInfo()` method on the `DesktopAgent` instance to get the `ImplementationMetadata` object. <br/> Check that fdc3Version is set to 2.2.  <br/> Check that provider and providerVersion are populated. | 
| A   | `getUserChannels`|A can call the `getUserChannels()` method on the `DesktopAgent` instance to get the `Channel` objects representing the system channels. <br />  Check **user** channels are returned.|

- `getClientAPITest`: Perform the above test.