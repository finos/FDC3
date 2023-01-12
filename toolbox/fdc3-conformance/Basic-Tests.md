# Basic Tests ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `BasicCL1`: You can create a context listener by calling `fdc3.addContextListener` for a given context type (e.g. `fdc3.contact`), and then later `unsubscribe` the listener.
- `BasicCL2`: You can create a context listener by calling `fdc3.addContextListener` no specified context type (i.e. `null`) and then later `unsubscribe` the listener.
- `BasicIL1`: You can create an intent listener by calling `fdc3.addIntentListener` and then later `unsubscribe` it.
- `BasicCH1`: You can find out the current channel being listened in the application by calling `fdc3.getCurrentChannel()`.
- `BasicCH2`: By default, the current channel being listened on a new application should not be set. i.e. the current channel is `null`. 
- `BasicGI1`: An application can retrieve an `ImplementationMetadata` object to find out the version of FDC3 it is using and the provider details by calling `fdc3.getInfo()`. 
- `BasicAC1`: An application can create a named channel via the `fdc3.getOrCreateChanne(<name>)` function. 
- `BasicUC1`: An application can query the available user/system channels.  The API call is:
  - `fdc3.getSystemChannels()` ![1.2](https://img.shields.io/badge/FDC3-1.2-green) _deprecated_
  - `fdc3.getUserChannels()` ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)
- `BasicJC1`: The application should be able to join one of the user/system channels.  Having done so, the current channel should be set for the application.  This is done with:
  - `fdc3.joinChannel()` ![1.2](https://img.shields.io/badge/FDC3-1.2-green) _deprecated_
  - `fdc3.joinUserChannel()` ![2.0](https://img.shields.io/badge/FDC3-2.0-blue) 
- `BasicJC2`: The application should be able to join a user/system channel with the channel's id (as in `BasicJC1`).  Having done this, current channel set for the application should be that channel.  Use `fdc3.getCurrentChannel()` to get the current channel.
- `BasicLC1`: The application should be able to leave a channel it has joined using `fdc3.leaveCurrentChannel()`.
- `BasicRI1`: The application should be able to raise an intent for some item of context by invoking `fdc3.raiseIntentForContext`.
