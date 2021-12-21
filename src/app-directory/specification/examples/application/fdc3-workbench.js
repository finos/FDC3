module.exports = {
    appId: 'fdc3-workbench',
    name: 'FDC3 Workbench',
    type: 'browser',
    details: {
        url: 'https://fdc3.finos.org/toolbox/fdc3-workbench/'
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
                folder: 'FDC3 Toolbox'
            }
        }
    }
};
