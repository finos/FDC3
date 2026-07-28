/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface TradingViewIntent {
  name: string;
  function: (context: any, state: any) => any; // returns the new state
}

export interface TradingViewListener {
  name: string;
  function: (context: any, state: any) => any; // returns the new state
}

export interface TradingViewMode {
  name: string;
  script: string;
  innerHTML: (state: object) => string;
  initialState: any;
  intents: TradingViewIntent[];
  listeners: TradingViewListener[];
}
