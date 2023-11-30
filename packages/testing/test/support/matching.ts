import { JSONPath } from "jsonpath-plus";

export function doesRowMatch(values: string[], headers: string[], data: any): boolean {
    for (var i = 0; i < headers.length; i++) {
        const found = JSONPath({ path: headers[i], json: data })[0];
        const actual = values[i]
        if (found != actual) {
            return false;
        }
    }

    return true;
}

export function indexOf(rows: string[][], headers: string[], data: any): number {
    for (var i = 0; i < rows.length; i++) {
        if (doesRowMatch(rows[i], headers, data)) {
            return i;
        }
    }

    return -1;
}

export function handleResolve(name: string, on: any) : any {
    if (name.startsWith("{") && name.endsWith("}")) {
        return on[name.substring(1, name.length-1)]
    } else {
        return name
    }
}
