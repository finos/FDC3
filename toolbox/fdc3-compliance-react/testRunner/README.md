# FDC3 Conformance

## Background
This project represents a means to confirm conformance of a [desktop agent](https://fdc3.finos.org/docs/api/ref/DesktopAgent) to the [fdc3 api specification](https://fdc3.finos.org/docs/api/spec).

To do so this application can be launched within the desktop agent which will run a series of tests to verify conformance against the specification.

## Getting Started

1. Clone the repository

`git clone https://github.com/finos/FDC3`

2. Install dependencies and build

~~~
cd FDC3/toolbox/fdc3-compliance
yarn install
yarn build
~~~

3. Start the development server

`yarn start`

4. Add the URL http://localhost:8080 to your FDC3-enabled container or desktop agent and ensure it has access to the `window.fdc3` object.

Alternatively, a full set of static files are available in the `build` folder. Load the index.html file into an environment that has the `window.fdc3` object available.

## Application Definition

A basic FDC3 application definition, as defined in the [application directory specification](https://fdc3.finos.org/schemas/1.2/app-directory#tag/Application), is supplied in the file `appDefinition.json`. This may be useful when adding the conformance tests to an application directory.

## Integration with automated testing

The test suite can be run independently without interaction - for example as part of a CI build, or from the command line. See TypeScript and JavaScript examples [here](./examples/). 
First import the silentRun module from the build folder, and then call the default method. The fdc3 global variable is passed in as a parameter, to remove the need for a complete desktop agent environment:

```javascript
const runSilentTests = require("../build/silentRun");

// Pass in the fdc3 global object to be tested
// Results are returned via callback
runSilentTests(fdc3, (results) => {
  // results.stats contains the summary results
  // For more details, see the passed and failed arrays
  console.log(results.stats);
});
```