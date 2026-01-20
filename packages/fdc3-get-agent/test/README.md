# FDC3 GetAgent Test Infrastructure

The test infrastructure for fdc3-get-agent is complex as it has to mock a collection of windows, documents and iframes to simulate a Web-based Desktop Agent. The tests here work against a self-contained mock implementation (`MockFDC3Server`) that does not depend on any external Desktop Agent implementation.

To enable debug logs for the test infrastructure, set the `debugLogs` flag in packages\fdc3-get-agent\test\world\index.ts to true.
