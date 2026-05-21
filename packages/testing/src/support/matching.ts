import { JSONPath } from 'jsonpath-plus';
import { PropsWorldLike } from '../world/PropsWorldLike.js';
import { expect } from 'vitest';

export interface HashesProvider {
  hashes(): Record<string, string>[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function doesRowMatch(cw: PropsWorldLike, t: Record<string, string>, data: any): boolean {
  for (const [field, actual] of Object.entries(t)) {
    if (field.endsWith('matches_type')) {
      // validation mode
      var valdata = data;

      if (field.length > 'matches_type'.length) {
        // deals with the case where we're validating part of the object
        const path = field.substring(0, field.length - 'matches_type'.length - 1);
        valdata = JSONPath({ path: path, json: data })[0];
      }

      const validator = cw.props['ajv'];
      const validate = validator.getSchema('https://fdc3.finos.org/schemas/next/api/' + actual + '.schema.json');
      if (validate == undefined) {
        throw Error('No schema found for ' + actual);
      }
      const valid = validate(valdata);
      if (!valid) {
        try {
          cw.log(`Comparing Validation failed: ${JSON.stringify(data, null, 2)} \n ${JSON.stringify(validate.errors)}`);
        } catch (e) {
          cw.log(`Comparing Validation failed: ${JSON.stringify(validate.errors)}`);
        }
        return false;
      }
    } else {
      const found = JSONPath({ path: field, json: data })[0];
      const resolved = handleResolve(actual, cw);

      if (found != resolved) {
        try {
          cw.log(
            `Comparing Validation failed: ${JSON.stringify(data, null, 2)} \n Match failed on ${field} '${found}' vs '${resolved}'`
          );
        } catch (e) {
          cw.log('Match failed on ' + field + " '" + found + "' vs '" + resolved + "'");
        }
        return false;
      }
    }
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexOf(cw: PropsWorldLike, rows: Record<string, string>[], data: any): number {
  for (var i = 0; i < rows.length; i++) {
    if (doesRowMatch(cw, rows[i], data)) {
      return i;
    }
  }

  return -1;
}

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(n as unknown as number);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleResolve(name: string, on: PropsWorldLike): any {
  if (name.startsWith('{') && name.endsWith('}')) {
    const stripped = name.substring(1, name.length - 1);
    if (stripped == 'null') {
      return null;
    } else if (stripped == 'true') {
      return true;
    } else if (stripped == 'false') {
      return false;
    } else if (isNumeric(stripped)) {
      return Number.parseFloat(stripped);
    } else {
      const out = JSONPath({ path: stripped, json: on.props })[0];
      return out;
    }
  } else {
    return name;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function matchData(cw: PropsWorldLike, actual: any[], dt: HashesProvider) {
  const tableData = dt.hashes();
  const rowCount = tableData.length;

  var resultCopy = JSON.parse(JSON.stringify(actual)) as any[];
  cw.log(`result ${JSON.stringify(resultCopy, null, 2)} length ${resultCopy.length}`);
  expect(resultCopy).toHaveLength(rowCount);
  var row = 0;

  resultCopy = resultCopy.filter(rr => {
    const matchingRow = tableData[row];
    row++;
    if (doesRowMatch(cw, matchingRow, rr)) {
      return false;
    } else {
      cw.log(`Couldn't match row: ${JSON.stringify(rr, null, 2)}`);
      return true;
    }
  });

  expect(resultCopy).toHaveLength(0);
}
