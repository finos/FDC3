import { TradingViewMode } from '../common';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const tickersMode: TradingViewMode = {
  name: 'tickers',
  script: 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js',
  innerHTML: (state: object) => `{
                        "symbols": ${JSON.stringify(state)},
                        "showSymbolLogo": true,
                        "isTransparent": false,
                        "displayMode": "adaptive",
                        "colorTheme": "light",
                        "locale": "en"
                    }`,
  initialState: [
    {
      proName: 'FOREXCOM:SPXUSD',
      title: 'S&P 500 Index',
    },
    {
      proName: 'FOREXCOM:NSXUSD',
      title: 'US 100 Cash CFD',
    },
    {
      proName: 'FX_IDC:EURUSD',
      title: 'EUR to USD',
    },
    {
      description: 'FTSE 100',
      proName: 'SPREADEX:FTSE',
    },
    {
      description: 'NASDAQ',
      proName: 'IG:NASDAQ',
    },
  ],
  intents: [
    {
      name: 'ViewInstrument',
      function: (context: any, state: any) => {
        const newState = [
          ...state,
          {
            proName: context?.id?.ticker,
            description: context?.id?.ticker,
          },
        ];
        return newState;
      },
    },
    {
      name: 'ViewChart',
      function: (context: any, state: any) => {
        const newState = [
          ...state,
          {
            proName: context?.id?.ticker,
            description: context?.id?.ticker,
          },
        ];
        return newState;
      },
    },
  ],
  listeners: [
    {
      name: 'fdc3.instrument',
      function: (context: any, state: any) => {
        const newState = [
          ...state,
          {
            proName: context?.id?.ticker,
            description: context?.id?.ticker,
          },
        ];
        return newState;
      },
    },
  ],
};
