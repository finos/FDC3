# FDC3 For The Web 

This is a minimal proof-of-concept for FDC3 For the Web.

## To Run

1.  From the Command Line:
    ```
    yarn install
    yarn workspaces foreach --all run build
    cd packages/demo
    yarn dev
    ```

2. Point browser at http://localhost:8080/da/

3. This is your dummy desktop agent, which has various apps you can launch.

4. Launch the apps, press the button, watch messages pass between them.

## What This Project Contains

The project is divided into several different yarn workspaces:

 - `da`: This is an implementation of a client-side, typescript desktop agent that communicates to a server backend using the APIs/JSON Schema defined in  [Agent Bridging](https://fdc3.finos.org/docs/next/agent-bridging/spec).  It is expected that we would standardize this and add to the FDC3 NPM module.

 - `testing`:  This is some cucumber/gherkin tests that exercise the functionality in `da`.  These are written to be language-agnostic so that we can use the same Gherkin feature files to test .net, Java, Python APIs too.  These can be run with `yarn test`

 - `client`:  This exports the `getClientAPI()` function which can be used to retrieve a desktop agent API via the web.

 - `server`: A minimal implementation of the post-message protocol for retrieving desktop agent details.  You can see this being used in the `demo` prject.

 - `common` : Common APIs and functionality used by both `client` and `server`

 - `demo` : A bare-bones 
 
 
## Configuring the client

`getClientAPI` (in `index.ts`): Called (with options) by an FDC3 Aoo to retrieve the API.  This retrieves `details` from the desktop agent and initialises a `DesktopAgent` API implementation, returning it in a promise.  There are various options available:

  - `strategies`: This allows plugable strategies for getting the DA.  Two exist:
    -  `electron-event` which waits for `window.fdc3` to be set and 
    - `post-message` which fires a post message up to the opening window/iframe (or whatever is set in the `frame` option) asking for details of how to construct a `DesktopAgent` API implementation.
  - `frame` : when _not_ using a loaded iframe, you can begin communicating with a port on a particular frame.  By default, opener or window, but you can pick something else if you want.

## Configuring Server

   - **For the desktop agent**: `supply` (in `agent/supply.ts`):  Called by the desktop agent on startup, allows it to supply FDC3 APIs to apps when they ask for one via the `post-message` strategy.  This takes the following parameters:
     - A `checker`, which checks the origin window for the API request.  It should be a window that the Desktop Agent is aware of.
     - A map of `detailsResolver`s, which returns a map of properties to send to the API requestor (the app) that should be used to instantiate the API.  This map is keyed by the names of the _methods_ above.

## Notes

- Since this uses Vite, you can modify the code and see it running the browser immediately.
- This currently only supports FDC3 2.0
- Also supports the difference between frames and tabs.

## Cross-Origin

- This supports cross-origin when using post message without iframes.  (at least on my machine!) you can configure hostnames in `dummy-desktop-agent.ts` to try this out.
- However, using the iframe mode (you can see this in the demo) will fail as chrome has restricted the 

## TO-DO

 - Fallback strategy in case FDC3 API isn't available (currently promise never resolves)
 - Sanitisation of response from the Desktop Agent
 - Handing of fdc3Ready
 - Handling on intents, open, finishing test cases for `da` / `testing`


