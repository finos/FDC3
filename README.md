# FDC3 For The Web 

This is a minimal proof-of-concept for FDC3 For the Web.

## To Run

0.  Prerequisites:

    ```
    node: v20+
    yarn v4+
    ```

1.  From the Command Line:
    ```
    yarn install
    yarn workspaces foreach --all install
    yarn workspaces foreach --all run build
    cd packages/demo
    yarn dev
    ```

2. Point browser at http://localhost:8080/da/

3. This is your dummy desktop agent, which has various apps you can launch.

4. Launch the apps, press the button, watch messages pass between them.

## What This Project Contains

The project is divided into several different yarn workspaces:

 - `da-proxy`: 
   - `src`: This is an implementation of a client-side, typescript desktop agent proxy that communicates to a server backend using the APIs/JSON Schema defined in  [Agent Bridging](https://fdc3.finos.org/docs/next/agent-bridging/spec).  It is expected that we would standardize this and add to the FDC3 NPM module. 
   - `test`: This is some cucumber/gherkin tests that exercise the functionality in `src`.  These are written to be language-agnostic so that we can use the same Gherkin feature files to test .net, Java, Python APIs too.  These can be run with `yarn build`

 - `client`:  This exports the `getClientAPI()` function which can be used to retrieve a desktop agent API via the web.

 - `da-server`: 
     - `src`: A minimal implementation of the desktop-agent bridging protocol for handling messages between multiple connected sources.
     - `test`: This is some cucumber/gherkin tests that exercise the functionality in `src`. These can be run with `yarn build`

 - `common` : Common APIs and functionality used by both `client` and `server`

 - `fdc3-web-demo` : A bare-bones desktop agent implementation with a few apps that use WebFDC3.  See: https://static.swimlanes.io/6bb69f2c9acdc0656f5f3b098d40518e.png for how this works.  Basically, the implementation here is that it uses iframes approach and a server-side websocket to relay messages.

 - `fdc3-workbench`: The FDC3 Workbench app from https://github.com/FDC3/toolbox/workbench, ported to use WebFDC3. 
 
 
## Configuring the client

`getClientAPI` (in `index.ts`): Called (with options) by an FDC3 App to retrieve the API.  This retrieves `details` from the desktop agent and initialises a `DesktopAgent` API implementation, returning it in a promise.  There are various options available:

  - `strategies`: This allows plugable strategies for getting the DA.  Two exist:
    - `electron-event` which waits for `window.fdc3` to be set and 
    - `post-message` which fires a post message up to the opening window/iframe (or whatever is set in the `frame` option) asking for details of how to construct a `DesktopAgent` API implementation.
  - `frame` : when _not_ using a loaded iframe, you can begin communicating with a port on a particular frame.  By default, opener or window, but you can pick something else if you want.

## Configuring Server

   - **For the desktop agent**: `supply` (in `server/supply.ts`):  Called by the desktop agent on startup, allows it to supply FDC3 APIs to apps when they ask for one via the `post-message` strategy.  This takes the following parameters:
     - A `checker`, which checks the origin window for the API request.  It should be a window that the Desktop Agent is aware of.
     - A `detailsResolver`s, which returns a map of properties to send to the API requestor (the app) that should be used to instantiate the API. 
     - A `portResolver` which is responsible for providing a `MessagePort` for the server and client to communicate over.

## Notes

- Since this uses Vite, you can modify the code and see it running the browser immediately.
- This currently only supports FDC3 2.0
- Also supports the difference between frames and tabs.

## Cross-Origin

- This supports cross-origin when using post message without iframes.  (at least on my machine!) you can configure hostnames in `dummy-desktop-agent.ts` to try this out.
- However, using the iframe mode (you can see this in the demo) will fail as chrome has restricted the SharedWorker when used with iframes (even of the same origin).

## TO-DO

 - Fallback strategy in case FDC3 API isn't available (currently promise never resolves)
 - Sanitisation of response from the Desktop Agent
 - Handing of fdc3Ready
 - Handling on intents, open, finishing test cases for `da` / `testing`

## More Messages

Desktop Agent Briding needs extending with the following types:




## Troubleshooting

- Try removing tsconfig.tsbuildinfo files if you are having trouble building

## Issues To Resolve

- How does the da-server tell the da-proxy about the channel metadata?  We need a message to get the list of user channels from the server.
- How does the da-server decide on a desktop agent name (maybe it just has one?)
- AppChecker / AppDetailsResolver / AppPortResolver - this is all too complex.
= fdc3Ready timeout
- get it to work without desktop agent window running
- use cookie for the da id.
- add server tests for intent resolution choice
- handle disconnections from the server / update running apps

## Idea

Do we need to send a post-message to the server, if we have cookies?  Couldn't we just hold the DA ID and the 
address of the embed page in the cookie?  Problem is, the cookie is scoped to the DA...