/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface PolygonIntent {
  name: string;
  function: (context: any, state: any) => any; // returns the new state
}

export interface PolygonListener {
  name: string;
  function: (context: any, state: any) => any; // returns the new state
}

export interface PolygonMode {
  name: string;
  endpoint: (state: object, apiKey: string) => string;
  initialState: any;
  initialData: any;
  intents: PolygonIntent[];
  listeners: PolygonListener[];
  dataRenderer: (data: any) => React.ReactNode;
  stateRenderer: (state: any) => React.ReactNode;
}
