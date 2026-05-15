import { TradingViewMode } from '../common';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const symbolInfoMode: TradingViewMode = {
  name: 'symbol-info',
  script: 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js',
  innerHTML: (state: object) => `{
          "autosize": true,
          "symbol": "NASDAQ:${state}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`,
  initialState: 'TSLA',
  intents: [
    {
      name: 'ViewInstrument',
      function: (context: any) => {
        return context?.id?.ticker;
      },
    },
    {
      name: 'ViewChart',
      function: (context: any) => {
        return context?.id?.ticker;
      },
    },
  ],
  listeners: [
    {
      name: 'fdc3.instrument',
      function: (context: any) => {
        return context?.id?.ticker;
      },
    },
  ],
};
