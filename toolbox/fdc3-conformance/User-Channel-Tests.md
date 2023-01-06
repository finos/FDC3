# User Channel Tests  ![1.2](https://img.shields.io/badge/FDC3-1.2-green) ![2.0](https://img.shields.io/badge/FDC3-2.0-blue)

_NB:  User Channels were called System Channels in FDC3 1.2.  The new terminology is used in this specification_


### Broadcast (Basic)

| App | Step               |Details                                                                           |
|-----|--------------------|----------------------------------------------------------------------------------|
| A   | 1.  addContextListener |A adds an _untyped_ Context Listener, and checks that there is an unsubscribe method on it.|
| A   | 2. joinUserChannel     |A joins the first available user channel.|
| B   | 3. joinUserChannel     |B joins the same channel as A. |
| B   | 4. Broadcast          | B broadcasts some `fdc3.instrument` context to the channel. |
| A   | 5.  Receive Context    | A receives the instrument object, matching the one broadcast by B.  |

- `UCBasicUsage1` Perform above test 
- `UCBasicUsage2` Perform steps in order: 2,1,3,4,5
- `UCBasicUsage3` Perform steps in order: 3,4,1,2,5
- `UCBasicUsage4` Perform steps in order: 3,4,2,1,5
