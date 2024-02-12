import { JSONPath } from "jsonpath-plus";
import { CustomWorld } from "../world";
import expect from "expect";
import { DataTable } from "@cucumber/cucumber";

export function doesRowMatch(t: Record<string, string>, data: any): boolean {
    for (const [field, actual] of Object.entries(t)) {
        const found = JSONPath({ path: field, json: data })[0];
        if (found == undefined) {
            return false;
        }
        if (found != actual) {
            return false;
        } 
    }

    return true;
}

export function indexOf(rows: Record<string, string>[], data: any): number {
    for (var i = 0; i < rows.length; i++) {
        if (doesRowMatch(rows[i], data)) {
            return i;
        }
    }

    return -1;
}

export function handleResolve(name: string, on: CustomWorld) : any {
    if (name.startsWith("{") && name.endsWith("}")) {
        return on.props[name.substring(1, name.length-1)]
    } else {
        return name
    }
}

export function matchData(actual: any[], dt: DataTable, log: (arg0: string) => void) {
    const tableData = dt.hashes();
    const rowCount = tableData.length

    var resultCopy = JSON.parse(JSON.stringify(actual)) as any[];
    log(`result ${JSON.stringify(resultCopy)} length ${resultCopy.length}`)
    expect(resultCopy).toHaveLength(rowCount);

    resultCopy = resultCopy.filter(rr => {
        const matchingRow = indexOf(tableData, rr);
        if (matchingRow != -1) {
            return false
        } else {
            log(`Couldn't match row: ${JSON.stringify(rr)}`)
            return true
        }
    })

    expect(resultCopy).toHaveLength(0)
}