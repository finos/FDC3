/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { JSONPath } from 'jsonpath-plus';
import {
  pathForFieldSuffix,
  registerFieldMatcher,
  valueAtPath,
  type PropsWorldLike,
  type RowFieldMatcher,
} from '@robmoffat/standard-cucumber-steps';

const MATCHES_TYPE_SUFFIX = 'matches_type';
const SCHEMA_BASE = 'https://fdc3.finos.org/schemas/next/api/';

const matchesTypeMatcher: RowFieldMatcher = {
  matchesField: (field: string) => field.endsWith(MATCHES_TYPE_SUFFIX),
  matchField(world: PropsWorldLike, field: string, schemaId: string, rowData: unknown) {
    const path = pathForFieldSuffix(field, MATCHES_TYPE_SUFFIX);
    if (path === null) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valdata = path === '' ? rowData : JSONPath({ path, json: rowData as any })[0];

    const ajv = world.props['ajv'];
    if (!ajv) {
      world.log('AJV not loaded — call setupSchemaSteps() / Given schemas loaded first');
      return false;
    }

    const validate = ajv.getSchema(`${SCHEMA_BASE}${schemaId}.schema.json`);
    if (validate == undefined) {
      throw new Error(`No schema found for ${schemaId}`);
    }

    const valid = validate(valdata);
    if (!valid) {
      try {
        world.log(`Schema validation failed: ${JSON.stringify(rowData, null, 2)}\n${JSON.stringify(validate.errors)}`);
      } catch {
        world.log(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
      }
      return false;
    }
    return true;
  },
};

export function registerFdc3SchemaMatchers(): void {
  registerFieldMatcher(matchesTypeMatcher);
}

export { valueAtPath };
