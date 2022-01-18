const SwaggerParser = require('@apidevtools/swagger-parser');
const { Validator } = require('jsonschema');
const assert = require('assert');
const exampleApplication = require('../examples/application/fdc3-workbench.json');

(async () => {
  try {
    const api = await SwaggerParser.validate('../appd.yaml');

    console.log(`API name: ${api.info.title}, Version: ${api.info.version}`);

    const applicationSchema = api.components.schemas.Application;

    const v = new Validator();

    const validatorResult = v.validate(exampleApplication, applicationSchema);

    assert(
      validatorResult.valid,
      `The example application definition does not comply with the Application schema: ${validatorResult.errors}`
    );

    console.log('Successfully validated the specification and the example application definition!');
  } catch (error) {
    console.log(error.message || error);
  }
})();
