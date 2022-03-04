# FDC3 Conformance

## Background
This project represents a means to confirm conformance of a [desktop agent](https://fdc3.finos.org/docs/api/ref/DesktopAgent) to the [fdc3 api specification](https://fdc3.finos.org/docs/api/spec).

To do so this application can be launched within the desktop agent which will run a series of tests to verify conformance against the specification.

## Getting Started

1. Clone the repository

`git clone https://github.com/finos/FDC3`

2. Install dependencies

`cd FDC3/toolbox/fdc3-compliance & yarn install`

3. Start the development server

`yarn start`

4. Add the URL http://localhost:3001 to your FDC3-enabled container or desktop agent and ensure it has access to the `window.fdc3` object.

Alternatively, a full set of static files are available in the `build` folder. Load the index.html file into an environment that has the `window.fdc3` object available.
