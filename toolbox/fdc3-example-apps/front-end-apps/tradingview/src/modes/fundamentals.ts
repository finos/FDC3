import { TradingViewMode } from '../common';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const fundamentalsMode: TradingViewMode = {
  name: 'fundamentals',
  script: 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js',
  innerHTML: (state: object) => `{
                    "isTransparent": false,
                    "largeChartUrl": "",
                    "displayMode": "regular",
                    "width": "100%",
                    "height": "100%",
                    "colorTheme": "light",
                    "symbol": "${state}",
                    "locale": "en"
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
