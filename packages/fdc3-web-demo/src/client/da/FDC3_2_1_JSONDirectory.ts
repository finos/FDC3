import { BasicDirectory } from "da-server/src/directory/BasicDirectory";
import { DirectoryApp } from "da-server/src/directory/DirectoryInterface";
import { readFile } from 'fs/promises';

function loadRemotely(u: string) {
    return fetch(u).then((response) => response.json());
}

function loadLocally(u: string) {
    return readFile(u)
        .then((buf) => buf.toString('utf8'))
        .then((data) => JSON.parse(data));
}

async function load(url: string): Promise<DirectoryApp[]> {
    if (url.startsWith('http')) {
        return await loadRemotely(url).then(convertToDirectoryList);
    } else {
        return await loadLocally(url).then(convertToDirectoryList);
    }
}
const convertToDirectoryList = (data: any) => {
    return data.applications as DirectoryApp[];
}

export class FDC3_2_1_JSONDirectory extends BasicDirectory {

    constructor() {
        super([])
    }

    async load(url: string) {
        this.allApps = await load(url);
    }

}