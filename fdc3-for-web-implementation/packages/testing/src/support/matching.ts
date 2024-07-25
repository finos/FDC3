import { JSONPath } from "jsonpath-plus";
import { PropsWorld } from "../world";
import expect from "expect";
import { DataTable } from "@cucumber/cucumber";
import Ajv from "ajv/dist/2019";

export function doesRowMatch(cw: PropsWorld, t: Record<string, string>, data: any): boolean {
    try {
        cw.log(`Comparing with ${JSON.stringify(data, null, 2)}`)
    } catch (e) {
        console.log("Can't stringify data")
    }
    for (const [field, actual] of Object.entries(t)) {
        if (field == 'matches_type') {
            const validator: Ajv = cw.props['ajv']
            const validate = validator.getSchema('https://fdc3.finos.org/schemas/next/api/' + actual + '.schema.json')!!
            const valid = validate(data)
            if (!valid) {
                cw.log(`Validation failed: ${JSON.stringify(validate.errors)}`)
                return false
            }
        } else {
            const found = JSONPath({ path: field, json: data })[0];
            const resolved = handleResolve(actual, cw)

            if (found != resolved) {
                cw.log("Match failed on " + field)
                return false;
            }
        }
    }

    return true;
}

export function indexOf(cw: PropsWorld, rows: Record<string, string>[], data: any): number {
    for (var i = 0; i < rows.length; i++) {
        if (doesRowMatch(cw, rows[i], data)) {
            return i;
        }
    }

    return -1;
}

export function handleResolve(name: string, on: PropsWorld): any {
    if (name.startsWith("{") && name.endsWith("}")) {
        const stripped = name.substring(1, name.length - 1)
        const out = JSONPath({ path: stripped, json: on.props })[0];
        return out
    } else {
        return name
    }
}

export function matchData(cw: PropsWorld, actual: any[], dt: DataTable) {
    const tableData = dt.hashes();
    const rowCount = tableData.length

    var resultCopy = JSON.parse(JSON.stringify(actual)) as any[];
    cw.log(`result ${JSON.stringify(resultCopy, null, 2)} length ${resultCopy.length}`)
    expect(resultCopy).toHaveLength(rowCount);
    var row = 0

    resultCopy = resultCopy.filter(rr => {
        const matchingRow = tableData[row]
        row++;
        if (doesRowMatch(cw, matchingRow, rr)) {
            return false
        } else {
            cw.log(`Couldn't match row: ${JSON.stringify(rr, null, 2)}`)
            return true
        }
    })

    expect(resultCopy).toHaveLength(0)
}