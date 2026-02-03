import { JSONPath } from 'jsonpath-plus';
import expect from 'expect';
import { DataTable } from '@cucumber/cucumber';
import Ajv from 'ajv/dist/2019';

// Generic interface for any world with props
export interface PropsWorldLike {
  props: Record<string, any>;
  log?: (message: string) => void;
}

function safeLog(cw: PropsWorldLike, message: string) {
  if (cw.log) {
    cw.log(message);
  } else {
    console.log(message);
  }
}

export function doesRowMatch(cw: PropsWorldLike, t: Record<string, string>, data: any): boolean {
  for (const [field, actual] of Object.entries(t)) {
    if (field.endsWith('matches_type')) {
      // validation mode
      let valdata = data;

      if (field.length > 'matches_type'.length) {
        // deals with the case where we're validating part of the object
        const path = field.substring(0, field.length - 'matches_type'.length - 1);
        valdata = JSONPath({ path: path, json: data })[0];
      }

      const validator: Ajv = cw.props['ajv'];
      const validate = validator.getSchema('https://fdc3.finos.org/schemas/next/api/' + actual + '.schema.json');
      if (validate == undefined) {
        throw Error('No schema found for ' + actual);
      }
      const valid = validate(valdata);
      if (!valid) {
        try {
          safeLog(
            cw,
            `Comparing Validation failed: ${JSON.stringify(data, null, 2)} \n ${JSON.stringify(validate.errors)}`
          );
        } catch (e) {
          safeLog(cw, `Comparing Validation failed: ${JSON.stringify(validate.errors)}`);
        }
        return false;
      }
    } else {
      const found = JSONPath({ path: field, json: data })[0];
      const resolved = handleResolve(actual, cw);

      if (found != resolved) {
        try {
          safeLog(
            cw,
            `Comparing Validation failed: ${JSON.stringify(data, null, 2)} \n Match failed on ${field} '${found}' vs '${resolved}'`
          );
        } catch (e) {
          safeLog(cw, 'Match failed on ' + field + " '" + found + "' vs '" + resolved + "'");
        }
        return false;
      }
    }
  }

  return true;
}

export function indexOf(cw: PropsWorldLike, rows: Record<string, string>[], data: any): number {
  for (let i = 0; i < rows.length; i++) {
    if (doesRowMatch(cw, rows[i], data)) {
      return i;
    }
  }

  return -1;
}

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(n as unknown as number);
}

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

export function matchData(cw: PropsWorldLike, actual: any[], dt: DataTable) {
  const tableData = dt.hashes();
  const rowCount = tableData.length;

  let resultCopy = JSON.parse(JSON.stringify(actual)) as any[];
  safeLog(cw, `result ${JSON.stringify(resultCopy, null, 2)} length ${resultCopy.length}`);
  expect(resultCopy).toHaveLength(rowCount);
  let row = 0;

  resultCopy = resultCopy.filter(rr => {
    const matchingRow = tableData[row];
    row++;
    if (doesRowMatch(cw, matchingRow, rr)) {
      return false;
    } else {
      safeLog(cw, `Couldn't match row: ${JSON.stringify(rr, null, 2)}`);
      return true;
    }
  });

  expect(resultCopy).toHaveLength(0);
}
