# FDC3 Conformance

## Background
This project represents a means to confirm conformance of a [desktop agent](https://fdc3.finos.org/docs/api/ref/DesktopAgent) to the [fdc3 api specification](https://fdc3.finos.org/docs/api/spec).

To do so this application can be launched within the desktop agent which will run a series of tests to verify conformance against the specification.

## Build application content
To build the application content follow the steps below:
1. run `npm install`
1. run `npm run build`

The tests and assets will be created in the `build` directory, this can then be hosted in a webserver (e.g. iis or express) for use within the appropriate desktop agent/s.

The desktop agents should use `FDC3Conformance.html` as the application url.
