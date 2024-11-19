
//TODO: move this out of fdc3-standard into another package - its an implementation detail of GetAgent
export interface Connectable {

    connect(): Promise<void>

    disconnect(): Promise<void>
}