import { setupGenericSteps } from '@robmoffat/testing';
import path from 'path';

// Register shared generic steps from @robmoffat/testing
const schemaBasePath = path.join(import.meta.dirname, '../../../');
setupGenericSteps(schemaBasePath);
