# Basic Tests ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

_These are some basic sanity tests implemented in the FDC3 Conformance Framework.  It is expected that Desktop Agent testers will run these first before commencing the much more thorough tests in section 2 onwards._

- `BasicCL1`: You can create a context listener for a given context type (e.g. `fdc3.contact`), and then later unsubscribe the listener.
- `BasicCL2`: You can create a context listener with no specified context type and then later unsubscribe the listener.
- `BasicIL1`: You can create an intent listener and then later unsubscribe it.
- `BasicCH1`: You can find out the current channel being listened in the application.
- `BasicCH2`: By default, the current channel being listened on a new application should not be set. 
- `BasicGI1`: An application can find out the version of FDC3 it is using and the provider details. 
- `BasicAC1`: An application can create a channel. 
- `BasicUC1`: An application can query the available user/system channels.
- `BasicJC1`: The application should be able to join one of the user/system channels.  Having done so, the current channel should be set for the application.
- `BasicJC2`: The application should be able to join a user/system channel with the channel's id.  Having done this, current channel set for the application should be that channel.
- `BasicLC1`: The application should be able to leave a channel it has joined.
- `BasicRI1`: The application should be able to raise an intent for some item of context.
