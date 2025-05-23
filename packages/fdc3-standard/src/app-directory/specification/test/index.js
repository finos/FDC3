import SwaggerParser from '@apidevtools/swagger-parser';
import { Validator } from 'jsonschema';
import exampleApplication1 from '../examples/application/myApplication.json' with { type: 'json' };
import exampleApplication2 from '../examples/application/fdc3-workbench.json' with { type: 'json' };
import { strict as assert } from 'assert';

(async () => {
  try {
    const api = await SwaggerParser.validate('../appd.schema.json');

    console.log(`API name: ${api.info.title}, Version: ${api.info.version}`);

    const applicationSchema = api.components.schemas.Application;

    console.log('Setting up the validator...');
    const v = new Validator();

    console.log('\nValidating the first example: myApplication.json');
    const validatorResult1 = v.validate(exampleApplication1, applicationSchema);

    assert(
      validatorResult1.valid,
      `The example application definition does not comply with the Application schema: ${validatorResult1.errors}`
    );

    console.log('Successfully validated the specification and the first example application definition!');

    console.log('\nValidating the second example: fdc3-workbench.json');
    const validatorResult2 = v.validate(exampleApplication2, applicationSchema);

    assert(
      validatorResult2.valid,
      `The example application definition does not comply with the Application schema: ${validatorResult2.errors}`
    );

    console.log('Successfully validated the specification and the second example application definition!');
  } catch (error) {
    console.log(error.message || error);
  }
})();
