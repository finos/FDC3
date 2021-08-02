module.exports = {
    appId: 'fdc3-tradingview-chart-orig',
    name: 'FDC3 TradingView Chart (orig)',
    type: 'browser',
    details: {
        url: 'https://appd.kolbito.com/demos/tradingview-chart/index.html'
    },
    hostManifests: {
        Glue42: {
            type: 'window',
            icon: 'https://fdc3.finos.org/docs/assets/fdc3-logo.png',
            details: {
                height: 640,
                width: 560,
                left: 120,
                top: 120,
                mode: 'tab',
                allowChannels: true,
                loader: {
                    enabled: true,
                    hideOnLoad: true
                }
            },
            customProperties: {
                folder: 'FDC3 Orig'
            }
        }
    },
    intents: [
        {
            name: 'fdc3.ViewChart',
            displayName: 'View Chart',
            contexts: [
                'fdc3.instrument'
            ]
        }
    ]
};
