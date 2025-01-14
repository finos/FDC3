//TODO: move this out of fdc3-standard into another package - its an implementation detail of GetAgent and used in fdc3-get-agent and fdc3-agent-proxy
export interface Connectable {
  connect(): Promise<void>;

  disconnect(): Promise<void>;
}
