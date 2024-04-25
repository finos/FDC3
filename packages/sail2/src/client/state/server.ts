import { DirectoryApp } from "da-server";

export interface ServerState {

    getApplications(): Promise<DirectoryApp[]>
}

class ServerStateImpl implements ServerState {

    async getApplications(): Promise<DirectoryApp[]> {
        return await fetch("/apps")
            .then((response) => response.json())
            .then(o => o as DirectoryApp[]);
    }
}

const theServerState = new ServerStateImpl()

export function getServerState(): ServerState {
    return theServerState
}