import { TradingViewMode } from '../common';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const marketDataMode: TradingViewMode = {
  name: 'market-data',
  script: 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js',
  innerHTML: (state: object) => `{
                        "symbolsGroups": [{
                                "name": "Instruments",
                                "originalName": "Instruments",
                                "symbols": ${JSON.stringify(state)}
                        }],
                        "width": "100%",
                        "height": "100%" ,
                        "showSymbolLogo": true,
                        "isTransparent": false,
                        "colorTheme": "light",
                        "locale": "en"
                    }`,
  initialState: [
    {
      name: 'FX:EURUSD',
      displayName: 'EUR to USD',
    },
    {
      name: 'FX:GBPUSD',
      displayName: 'GBP to USD',
    },
    {
      name: 'FX:USDJPY',
      displayName: 'USD to JPY',
    },
    {
      name: 'FX:USDCHF',
      displayName: 'USD to CHF',
    },
    {
      name: 'FX:AUDUSD',
      displayName: 'AUD to USD',
    },
    {
      name: 'FX:USDCAD',
      displayName: 'USD to CAD',
    },
  ],

  intents: [
    {
      name: 'ViewInstrument',
      function: (context: any, state: any) => {
        const newState = [
          ...state,
          {
            name: context?.id?.ticker,
            displayName: context?.id?.ticker,
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
            name: context?.id?.ticker,
            displayName: context?.id?.ticker,
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
            name: context?.id?.ticker,
            displayName: context?.id?.ticker,
          },
        ];
        return newState;
      },
    },
  ],
};
