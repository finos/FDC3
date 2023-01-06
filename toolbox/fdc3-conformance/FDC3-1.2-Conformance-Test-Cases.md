# FDC3 1.2 Conformance Test Cases
.

## 5. Intents

### Setup

You will need to pre-populate the AppDirectory with the following items:

| App | Required Metadata                                                                                                                                    |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------|
| A   | A’s AppD Record contains: `aTestingIntent` (with context type `testContextX`, `testContextZ`) and `sharedTestingIntent1` (with context type `testContextX`)    |
| B   | B’s AppD Record contains `bTestingIntent` (with context type `testContextY`) and `sharedTestingIntent1` (with context types `testContextX` and `testContextY`) |
| C   | C’s AppD Record contains `cTestingIntent` (with context type `testContextX`)                                                                             |

Also we assume a fourth app **D** that is going to discover the intents in the other 3.

### Find Intent From AppD

-  `IntentAppD`: Calls `fdc3.findIntent(‘aTestingIntent’)`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** app metadata.
-  `WrongIntentAppD`: Calls `fdc3.findIntent(‘nonExistentIntent’)`. Rejects with no apps found error https://fdc3.finos.org/docs/api/ref/Errors#resolveerror
-  `IntentAppDRightContext`: Calls `fdc3.findIntent(‘aTestingIntent’, ‘fdc3.testContextX’)`.  Receives promise containing an appIntent with metadata containing `aTestingIntent` and only **A** app metadata.
-  `IntentAppDWrongContext`: Calls `fdc3.findIntent(‘aTestingIntent’, ‘fdc3.testContextY’)`.  Rejects with no apps found error https://fdc3.finos.org/docs/api/ref/Errors#resolveerror
-  `IntentAppDMultiple1`: Calls `fdc3.findIntent(‘sharedTestingIntent1’)`.  Receives promise containing an appIntent with metadata containing `sharedTestingIntent` and only **A** and **B** app metadata.
-  `IntentAppDMultiple2`: Calls `fdc3.findIntent(‘sharedTestingIntent1’, 'testContextX')`.  Receives promise containing an appIntent with metadata containing `sharedTestingIntent` and only **A** and **B** app metadata.
-  `IntentAppDMultiple3`: Calls `fdc3.findIntent(‘sharedTestingIntent1’, 'testContextY')`.  Receives promise containing an appIntent with metadata containing `sharedTestingIntent` and only **B** app metadata.

### Find Intents By Context

-  `SingleContext`: Call `fdc3.findIntentsByContext(‘fdc3.testContextX’)`.  Should return `aTestingIntent` (app **A**), `sharedTestingIntent1` (**A**, **B**) and `cTestingIntent` (**C**) AND nothing else.
-  `NoContext`: Call `fdc3.findIntentsByContext()`. Throws error of `NoAppsFound`

### Raise Intent

| App | Step           | Details                                                                                           |
|-----|----------------|---------------------------------------------------------------------------------------------------|
| A   | 1. Raise          | `fdc3.raiseIntent(‘sharedTestingIntent1’, {testContextY})`<br>starts app B.                       |
| B   | 2. Gather Context | `fdc.addIntentListener(‘sharedTestingIntent1’)`<br>Receives testContextY, matching that sent by D |

-  `SingleResolve1`: Perform above test
-  `TargetedResolve1`: Use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, <A’s App Name>)` to start app A, otherwise, as above
-  `TargetedResolve2`: Use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, {name: "<A's App Name>"})` to start app A, otherwise, as above
-  `TargetedResolve3`: Use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, {name: “<app B Name>”, appId: “<app B ID>”})` to start app A, otherwise, as above
-  `FailedResolve1-3` As with `TargetedResolve1-3`, but use `fdc3.raiseIntent(‘aTestingIntent’, {testContextY}, <A’s App Name>)` and variations.  You will receive `NoAppsFound` Error
-  `FailedResolve4` As above, but use `fdc3.raiseIntent(‘aTestingIntent’, {testContextX}, <C’s App Name>)`.  You will receive `NoAppsFound` Error
