# FDC3 For The Web 

This is a minimal proof-of-concept for FDC3 For the Web.

## To Run

1.  From the Command Line:
    ```
    yarn install
    yarn vite dev
    ```

2. Point browser at http://localhost:5000/static/da/

3. This is your dummy desktop agent, which has three apps you can launch:

    - App1 Can Broadcast via FDC3.
    - App2 Listens.
    - App3 is the use case where an app has two separate APIs and uses them for intra-app comms.

4. Launch the apps, press the button, watch messages pass between them.

## What This Project Contains

 - In `\lib`:  A minimal implementation of web api retrieval.  This relies on the `post-message` strategy for communicating between apps and the desktop agent.  This supports two functions:

   - **For the App**: `load` (in `load.ts`): Called (with options) by an FDC3 Aoo to retrieve the API.  This retrieves `details` from the desktop agent and initialises a `DesktopAgent` API implementation, returning it in a promise.  There are various options available:

      - _strategies_: This allows plugable strategies for getting the DA.  Two exist:
        -  `electron-event` which waits for `window.fdc3` to be set and 
        - `post-message` which fires a post message up to the opening window/iframe (or whatever is set in the `frame` option) asking for details of how to construct a `DesktopAgent` API implementation.

      - _methods_:  The app can also suggest methods ways in which it might want to construct the `DesktopAgent` API.  The desktop agent is obliged to try and return a response back to the app detailing one of the approaches that the app asks for.  Two exist so far:
        - `js-inject` : The desktop agent responds with a URL of some javascript, loaded by the app to create a `DesktopAgent` API.  (See App2 which does this)
        - `post-message-protocol` : The app expects to communicate with the desktop agent via standard [Desktop-Agent-Bridging](https://fdc3.finos.org/docs/next/agent-bridging/spec) messages, sent and received via post-message. 


   - **For the desktop agent**: `supply` (in `agent/supply.ts`):  Called by the desktop agent on startup, allows it to supply FDC3 APIs to apps when they ask for one via the `post-message` strategy.  This takes the following parameters:
     - A `checker`, which checks the origin window for the API request.  It should be a window that the Desktop Agent is aware of.
     - A map of `detailsResolver`s, which returns a map of properties to send to the API requestor (the app) that should be used to instantiate the API.  This map is keyed by the names of the _methods_ above.

 - In `\demo`:  A fixture for demonstrating the above, containing two apps, `app1` and `app2` and a rudimentary `dummy-desktop-agent` all of which use the `webc3.ts` library.



## Notes

- Since this uses Vite, you can modify the code and see it running the browser immediately.
- This currently only supports FDC3 2.0
- This supports cross-origin, (at least on my machine!) you can configure hostnames in `dummy-desktop-agent.ts` to try this out.
- Also supports the difference between frames and tabs.

## TO DO

 - Fallback strategy in case FDC3 API isn't available (currently promise never resolves)
 - Sanitisation of response from the Desktop Agent
 - Handing of fdc3Ready


