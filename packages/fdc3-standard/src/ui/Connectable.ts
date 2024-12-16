export interface Connectable {
  connect(): Promise<void>;

  disconnect(): Promise<void>;
}
