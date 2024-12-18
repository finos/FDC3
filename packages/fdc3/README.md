# FDC3

This npm module is the main entry point for the Financial Desktop Connectivity and Collaboration Consortium (FDC3) JavaScript API.

Since version 2.2.0 this module only provides an ES6 module. Applications requiring a CommonJS module should either update to ES6 or switch to the [@finos/fdc3-commonjs module](https://npmjs.com/package/@finos/fdc3-commonjs) (provided for backwards compatibility).

## Installation

To install the FDC3 module, use npm:

```bash
npm install @finos/fdc3
```

## Usage

To use the FDC3 module in your project, import it as follows:

```javascript
import { getAgent } from '@finos/fdc3';
// getAgent() returns the FDC3 Desktop Agent
const fdc3 = getAgent();

// Example usage
const contact = {
  type: 'fdc3.contact',
  name: 'Jane Doe',
  id: {
    email: 'jane@mail.com'
  }
};

fdc3.raiseIntent('ViewProfile', contact);
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
