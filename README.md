# FDC3 For The Web 

This is a minimal proof-of-concept for FDC3 For the Web.

## To Run

1.  From the Command Line:
    ```
    yarn install
    yarn dev
    ```

2. Point browser at http://localhost:5000/static/da/

3. This is your dummy desktop agent, which has two apps you can launch:

    - App1 Can Broadcast via FDC3.
    - App2 Listens.

4. Launch the apps, press the button, watch messages pass between them.

## What This Project Contains

 - In `\lib`:  A minimal implementation called `webc3.ts`.  This relies on the `post-message` strategy for communicating between apps and the desktop agent.  This supports two functions:

   - `supply`:  Called by the desktop agent on startup, allows it to supply FDC3 APIs to apps when they ask for one.

   - `load`: Called (with options) by an FDC3 Aoo to retrieve the API.

 - In `\demo`:  A fixture for demonstrating the above, containing two apps, `app1` and `app2` and a rudimentary `dummy-desktop-agent` all of which use the `webc3.ts` library.

## Notes

- Since this uses Vite, you can modify the code and see it running the browser immediately.
- This currently only supports FDC3 2.0


