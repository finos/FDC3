import { JSONPath } from "jsonpath-plus";

export function doesRowMatch(t: Record<string, string>, data: any): boolean {
    for (var k in Object.keys(t)) {
        const found = JSONPath({ path: k, json: data })[0];
        const actual = t[k]
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

export function handleResolve(name: string, on: any) : any {
    if (name.startsWith("{") && name.endsWith("}")) {
        return on[name.substring(1, name.length-1)]
    } else {
        return name
    }
}
