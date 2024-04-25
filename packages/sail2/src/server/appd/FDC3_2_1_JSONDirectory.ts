import { BasicDirectory } from "da-server/src/directory/BasicDirectory";
import { DirectoryApp } from "da-server/src/directory/DirectoryInterface";
import fs from 'node:fs/promises';


function loadRemotely(u: string): Promise<any> {
    return fetch(u).then((response) => response.json());
}

async function loadFile(u: string): Promise<any> {
    const data = await fs.readFile(u, { encoding: 'utf8' });
    return JSON.parse(data);
}

async function load(url: string): Promise<DirectoryApp[]> {
    if (url.startsWith('http')) {
        return await loadRemotely(url).then(convertToDirectoryList);
    } else {
        return await loadFile(url).then(convertToDirectoryList);

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
        this.allApps.push(...await load(url));
    }

}