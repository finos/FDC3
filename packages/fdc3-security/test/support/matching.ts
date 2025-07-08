import { JSONPath } from 'jsonpath-plus';
import { CustomWorld } from '../world';
import expect from 'expect';
import { DataTable } from '@cucumber/cucumber';

export function doesRowMatch(cw: CustomWorld, t: Record<string, string>, data: any): boolean {
  cw.log(`Comparing with ${JSON.stringify(data)}`);
  for (const [field, actual] of Object.entries(t)) {
    const found = JSONPath({ path: field, json: data })[0];
    const resolved = handleResolve(actual, cw);

    if (found == true && resolved == 'true') {
      // this is ok
    } else if (found == false && resolved == 'false') {
      // this is ok
    } else if (found != resolved) {
      cw.log('Match failed on ' + field);
      return false;
    }
  }

  return true;
}

export function indexOf(cw: CustomWorld, rows: Record<string, string>[], data: any): number {
  for (var i = 0; i < rows.length; i++) {
    if (doesRowMatch(cw, rows[i], data)) {
      return i;
    }
  }

  return -1;
}

export function handleResolve(name: string, on: CustomWorld): any {
  if (name.startsWith('{') && name.endsWith('}')) {
    const stripped = name.substring(1, name.length - 1);
    const parts = stripped.split('.');
    var out = on.props[parts[0]];
    for (let i = 1; i < parts.length; i++) {
      out = out[parts[i]];
    }
    return out;
  } else {
    return name;
  }
}

export function matchData(cw: CustomWorld, actual: any[], dt: DataTable) {
  const tableData = dt.hashes();
  const rowCount = tableData.length;

  var resultCopy = JSON.parse(JSON.stringify(actual)) as any[];
  cw.log(`result ${JSON.stringify(resultCopy)} length ${resultCopy.length}`);
  expect(resultCopy).toHaveLength(rowCount);
  var row = 0;

  resultCopy = resultCopy.filter(rr => {
    const matchingRow = tableData[row];
    row++;
    if (doesRowMatch(cw, matchingRow, rr)) {
      return false;
    } else {
      cw.log(`Couldn't match row: ${JSON.stringify(rr)}`);
      return true;
    }
  });

  expect(resultCopy).toHaveLength(0);
}
