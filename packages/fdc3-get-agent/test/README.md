# FDC3 GetAgent Test Infrastructure

The test infrastructure for fdc3-get-agent is complex as it has to mock a collection of windows, documents and iframes to simulate a Wed-based Desktop Agent. Additional tests in the /toolbox/fdc3-for-web/fdc3-web-impl package test against the reference implementation of web-based Desktop Agent, while the tests here work against a simulated one.

To enable debug logs for the test infrastructure, set the `debugLogs` flag in packages\fdc3-get-agent\test\world\index.ts to true.
