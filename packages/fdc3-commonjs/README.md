# FDC3 CommonJS Module

This is the CommonJS module version of the Financial Desktop Connectivity and Collaboration Consortium (FDC3) javascript API. 

## Warning

CommonJS is no longer the recommended module system for JavaScript. We recommend using the FDC3 ES6 module at `@finos/fdc3` instead. The FDC3 CommonJS module is provided for compatibility with older projects that use CommonJS.

## Installation

To install the FDC3 CommonJS module, use npm:

```bash
npm install @finos/fdc3-commonjs
```

## Usage

To use the FDC3 CommonJS module in your project, require it as follows:

```javascript
const fdc3CommonJs = require('@finos/fdc3-commonjs');

// getAgent() returns the FDC3 Desktop Agent
const fdc3 = fdc3CommonJs.getAgent();

// Example usage
const contact = {
  type: 'fdc3.contact',
  name: 'Jane Doe',
  id: {
    email: 'jane@mail.com'
  }
}

fdc3.raiseIntent('ViewProfile', contact)
```

## Documentation

For detailed documentation and API reference, please visit the [official FDC3 documentation](https://fdc3.finos.org/docs/api/overview).

## Contributing

We welcome contributions to the FDC3 project. Please see our [contributing guidelines](https://github.com/finos/FDC3/blob/main/CONTRIBUTING.md) for more information.

## License

This project is licensed under the [Apache 2.0 License](LICENSE).

## Contact

For any questions or support, please reach out to the FDC3 community on our [Slack channel](https://finos-lf.slack.com/archives/CJ8Q8H4Q1) or [mailing list](mailto:fdc3@finos.org).

## Further Details

Further details are avilable in the main [FDC3 Project README](https://github.com/finos/FDC3)
