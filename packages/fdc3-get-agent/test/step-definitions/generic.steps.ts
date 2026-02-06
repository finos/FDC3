import { setupGenericSteps } from '@finos/testing';
import path from 'path';

// Register shared generic steps from @finos/testing
const schemaBasePath = path.join(import.meta.dirname, '../../../');
setupGenericSteps(schemaBasePath);
