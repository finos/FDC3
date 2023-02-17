import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '9a6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '159'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '660'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '3d8'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '18f'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '3a4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '50d'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '731'),
    exact: true
  },
  {
    path: '/blog/2017/09/25/testing-rss',
    component: ComponentCreator('/blog/2017/09/25/testing-rss', '1ae'),
    exact: true
  },
  {
    path: '/blog/2017/09/26/adding-rss',
    component: ComponentCreator('/blog/2017/09/26/adding-rss', 'f79'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', 'a76'),
    exact: true
  },
  {
    path: '/docs/next',
    component: ComponentCreator('/docs/next', 'f2e'),
    routes: [
      {
        path: '/docs/next/api/ref/Channel',
        component: ComponentCreator('/docs/next/api/ref/Channel', 'fde'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/next/api/ref/DesktopAgent', 'c08'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/ref/Errors',
        component: ComponentCreator('/docs/next/api/ref/Errors', '895'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/ref/Globals',
        component: ComponentCreator('/docs/next/api/ref/Globals', 'ebf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/ref/Metadata',
        component: ComponentCreator('/docs/next/api/ref/Metadata', '914'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/ref/PrivateChannel',
        component: ComponentCreator('/docs/next/api/ref/PrivateChannel', '576'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/ref/Types',
        component: ComponentCreator('/docs/next/api/ref/Types', 'f66'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/api/spec',
        component: ComponentCreator('/docs/next/api/spec', 'c97'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/app-directory/overview',
        component: ComponentCreator('/docs/next/app-directory/overview', '4e2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/app-directory/spec',
        component: ComponentCreator('/docs/next/app-directory/spec', '902'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Chart',
        component: ComponentCreator('/docs/next/context/ref/Chart', '05f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/ChatInitSettings',
        component: ComponentCreator('/docs/next/context/ref/ChatInitSettings', '0f3'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Contact',
        component: ComponentCreator('/docs/next/context/ref/Contact', 'f06'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/ContactList',
        component: ComponentCreator('/docs/next/context/ref/ContactList', '35e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Context',
        component: ComponentCreator('/docs/next/context/ref/Context', '9f4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Country',
        component: ComponentCreator('/docs/next/context/ref/Country', 'c73'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Currency',
        component: ComponentCreator('/docs/next/context/ref/Currency', 'd06'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Email',
        component: ComponentCreator('/docs/next/context/ref/Email', '1b6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Instrument',
        component: ComponentCreator('/docs/next/context/ref/Instrument', 'f1d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/InstrumentList',
        component: ComponentCreator('/docs/next/context/ref/InstrumentList', '911'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Nothing',
        component: ComponentCreator('/docs/next/context/ref/Nothing', 'e13'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Organization',
        component: ComponentCreator('/docs/next/context/ref/Organization', '191'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Portfolio',
        component: ComponentCreator('/docs/next/context/ref/Portfolio', 'd4f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Position',
        component: ComponentCreator('/docs/next/context/ref/Position', 'e17'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/TimeRange',
        component: ComponentCreator('/docs/next/context/ref/TimeRange', '0a4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/ref/Valuation',
        component: ComponentCreator('/docs/next/context/ref/Valuation', '9dc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/context/spec',
        component: ComponentCreator('/docs/next/context/spec', '1a3'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/fdc3-charter',
        component: ComponentCreator('/docs/next/fdc3-charter', 'd31'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/fdc3-compliance',
        component: ComponentCreator('/docs/next/fdc3-compliance', 'df2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/fdc3-glossary',
        component: ComponentCreator('/docs/next/fdc3-glossary', 'd23'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/fdc3-intro',
        component: ComponentCreator('/docs/next/fdc3-intro', 'c70'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/fdc3-standard',
        component: ComponentCreator('/docs/next/fdc3-standard', 'ad6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/guides/SubmitNewIntent',
        component: ComponentCreator('/docs/next/guides/SubmitNewIntent', '9f9'),
        exact: true
      },
      {
        path: '/docs/next/intents/ref/StartCall',
        component: ComponentCreator('/docs/next/intents/ref/StartCall', '3a0'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/StartChat',
        component: ComponentCreator('/docs/next/intents/ref/StartChat', 'b01'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/StartEmail',
        component: ComponentCreator('/docs/next/intents/ref/StartEmail', 'f18'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/next/intents/ref/ViewAnalysis', '3c4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewChart',
        component: ComponentCreator('/docs/next/intents/ref/ViewChart', '879'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewContact',
        component: ComponentCreator('/docs/next/intents/ref/ViewContact', '96a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewHoldings',
        component: ComponentCreator('/docs/next/intents/ref/ViewHoldings', 'd07'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/next/intents/ref/ViewInstrument', 'f15'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewInteractions',
        component: ComponentCreator('/docs/next/intents/ref/ViewInteractions', '330'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewNews',
        component: ComponentCreator('/docs/next/intents/ref/ViewNews', '80e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewOrders',
        component: ComponentCreator('/docs/next/intents/ref/ViewOrders', '4b1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewProfile',
        component: ComponentCreator('/docs/next/intents/ref/ViewProfile', 'e70'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/next/intents/ref/ViewQuote', '6b6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/ref/ViewResearch',
        component: ComponentCreator('/docs/next/intents/ref/ViewResearch', '88a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/intents/spec',
        component: ComponentCreator('/docs/next/intents/spec', '341'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/references',
        component: ComponentCreator('/docs/next/references', '213'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/supported-platforms',
        component: ComponentCreator('/docs/next/supported-platforms', '50e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/next/trademarks',
        component: ComponentCreator('/docs/next/trademarks', '423'),
        exact: true
      },
      {
        path: '/docs/next/use-cases/',
        component: ComponentCreator('/docs/next/use-cases/', 'cd7'),
        exact: true
      },
      {
        path: '/docs/next/use-cases/meeting-minutes/2020-01-16 uc-wg meeting notes',
        component: ComponentCreator('/docs/next/use-cases/meeting-minutes/2020-01-16 uc-wg meeting notes', 'fed'),
        exact: true
      },
      {
        path: '/docs/next/use-cases/meeting-minutes/2020-02-20 uc-wg meeting notes',
        component: ComponentCreator('/docs/next/use-cases/meeting-minutes/2020-02-20 uc-wg meeting notes', 'bdd'),
        exact: true
      },
      {
        path: '/docs/next/use-cases/meeting-minutes/2020-03-19 uc-wg meeting notes',
        component: ComponentCreator('/docs/next/use-cases/meeting-minutes/2020-03-19 uc-wg meeting notes', 'cc0'),
        exact: true
      },
      {
        path: '/docs/next/use-cases/overview',
        component: ComponentCreator('/docs/next/use-cases/overview', 'e7a'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-1',
        component: ComponentCreator('/docs/next/use-cases/uc-1', '14b'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-10',
        component: ComponentCreator('/docs/next/use-cases/uc-10', '5da'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-13',
        component: ComponentCreator('/docs/next/use-cases/uc-13', 'e0a'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-15',
        component: ComponentCreator('/docs/next/use-cases/uc-15', '4a9'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-16',
        component: ComponentCreator('/docs/next/use-cases/uc-16', '67a'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-17',
        component: ComponentCreator('/docs/next/use-cases/uc-17', 'c55'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-2',
        component: ComponentCreator('/docs/next/use-cases/uc-2', '6d7'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-3',
        component: ComponentCreator('/docs/next/use-cases/uc-3', 'ec5'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-4',
        component: ComponentCreator('/docs/next/use-cases/uc-4', '975'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-5',
        component: ComponentCreator('/docs/next/use-cases/uc-5', '781'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/use-cases/uc-9',
        component: ComponentCreator('/docs/next/use-cases/uc-9', '377'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/next/why-fdc3',
        component: ComponentCreator('/docs/next/why-fdc3', '8e8'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'c45'),
    routes: [
      {
        path: '/docs/api/api-intro',
        component: ComponentCreator('/docs/api/api-intro', 'e88'),
        exact: true
      },
      {
        path: '/docs/api/api-spec',
        component: ComponentCreator('/docs/api/api-spec', 'aa1'),
        exact: true
      },
      {
        path: '/docs/api/Context',
        component: ComponentCreator('/docs/api/Context', 'f47'),
        exact: true
      },
      {
        path: '/docs/api/DesktopAgent',
        component: ComponentCreator('/docs/api/DesktopAgent', 'f77'),
        exact: true
      },
      {
        path: '/docs/api/Errors',
        component: ComponentCreator('/docs/api/Errors', '018'),
        exact: true
      },
      {
        path: '/docs/api/overview',
        component: ComponentCreator('/docs/api/overview', 'd92'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/ref/AppIntent',
        component: ComponentCreator('/docs/api/ref/AppIntent', '736'),
        exact: true
      },
      {
        path: '/docs/api/ref/AppMetadata',
        component: ComponentCreator('/docs/api/ref/AppMetadata', '386'),
        exact: true
      },
      {
        path: '/docs/api/ref/Channel',
        component: ComponentCreator('/docs/api/ref/Channel', 'fb7'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/ref/ChannelError',
        component: ComponentCreator('/docs/api/ref/ChannelError', 'd16'),
        exact: true
      },
      {
        path: '/docs/api/ref/Context',
        component: ComponentCreator('/docs/api/ref/Context', '151'),
        exact: true
      },
      {
        path: '/docs/api/ref/ContextHandler',
        component: ComponentCreator('/docs/api/ref/ContextHandler', 'eb3'),
        exact: true
      },
      {
        path: '/docs/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/api/ref/DesktopAgent', '4bf'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/api/ref/DisplayMetadata', '463'),
        exact: true
      },
      {
        path: '/docs/api/ref/Errors',
        component: ComponentCreator('/docs/api/ref/Errors', '64d'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/ref/Globals',
        component: ComponentCreator('/docs/api/ref/Globals', '950'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/ref/IntentMetadata',
        component: ComponentCreator('/docs/api/ref/IntentMetadata', 'd88'),
        exact: true
      },
      {
        path: '/docs/api/ref/IntentResolution',
        component: ComponentCreator('/docs/api/ref/IntentResolution', '24e'),
        exact: true
      },
      {
        path: '/docs/api/ref/Listener',
        component: ComponentCreator('/docs/api/ref/Listener', 'ce2'),
        exact: true
      },
      {
        path: '/docs/api/ref/Metadata',
        component: ComponentCreator('/docs/api/ref/Metadata', '04c'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/ref/OpenError',
        component: ComponentCreator('/docs/api/ref/OpenError', '39d'),
        exact: true
      },
      {
        path: '/docs/api/ref/ResolveError',
        component: ComponentCreator('/docs/api/ref/ResolveError', '95e'),
        exact: true
      },
      {
        path: '/docs/api/ref/Types',
        component: ComponentCreator('/docs/api/ref/Types', '566'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/api/spec',
        component: ComponentCreator('/docs/api/spec', 'e3e'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/app-directory/discovery',
        component: ComponentCreator('/docs/app-directory/discovery', '76b'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/app-directory/overview',
        component: ComponentCreator('/docs/app-directory/overview', 'bc4'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/app-directory/spec',
        component: ComponentCreator('/docs/app-directory/spec', 'e6a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/app-directory/usage',
        component: ComponentCreator('/docs/app-directory/usage', '779'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/appd-discovery',
        component: ComponentCreator('/docs/appd-discovery', '3d9'),
        exact: true
      },
      {
        path: '/docs/appd-intro',
        component: ComponentCreator('/docs/appd-intro', '60e'),
        exact: true
      },
      {
        path: '/docs/appd-spec',
        component: ComponentCreator('/docs/appd-spec', '048'),
        exact: true
      },
      {
        path: '/docs/appd-use',
        component: ComponentCreator('/docs/appd-use', 'fb0'),
        exact: true
      },
      {
        path: '/docs/context-intro',
        component: ComponentCreator('/docs/context-intro', '897'),
        exact: true
      },
      {
        path: '/docs/context-spec',
        component: ComponentCreator('/docs/context-spec', '541'),
        exact: true
      },
      {
        path: '/docs/context/overview',
        component: ComponentCreator('/docs/context/overview', '792'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Contact',
        component: ComponentCreator('/docs/context/ref/Contact', '183'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/ContactList',
        component: ComponentCreator('/docs/context/ref/ContactList', '60a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Context',
        component: ComponentCreator('/docs/context/ref/Context', '10f'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Country',
        component: ComponentCreator('/docs/context/ref/Country', '7b7'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Instrument',
        component: ComponentCreator('/docs/context/ref/Instrument', 'a3b'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/InstrumentList',
        component: ComponentCreator('/docs/context/ref/InstrumentList', 'b0a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Organization',
        component: ComponentCreator('/docs/context/ref/Organization', '172'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Portfolio',
        component: ComponentCreator('/docs/context/ref/Portfolio', 'ebd'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/ref/Position',
        component: ComponentCreator('/docs/context/ref/Position', '8ab'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/context/spec',
        component: ComponentCreator('/docs/context/spec', 'b93'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/fdc3-charter',
        component: ComponentCreator('/docs/fdc3-charter', '549'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/fdc3-compliance',
        component: ComponentCreator('/docs/fdc3-compliance', '8d6'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/fdc3-intro',
        component: ComponentCreator('/docs/fdc3-intro', '9fd'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/fdc3-standard',
        component: ComponentCreator('/docs/fdc3-standard', 'a63'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents-intro',
        component: ComponentCreator('/docs/intents-intro', '75b'),
        exact: true
      },
      {
        path: '/docs/intents-spec',
        component: ComponentCreator('/docs/intents-spec', 'fe9'),
        exact: true
      },
      {
        path: '/docs/intents/overview',
        component: ComponentCreator('/docs/intents/overview', 'f2e'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/StartCall',
        component: ComponentCreator('/docs/intents/ref/StartCall', 'cea'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/StartChat',
        component: ComponentCreator('/docs/intents/ref/StartChat', '4fa'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/intents/ref/ViewAnalysis', 'fd5'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/ViewChart',
        component: ComponentCreator('/docs/intents/ref/ViewChart', '9b6'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/ViewContact',
        component: ComponentCreator('/docs/intents/ref/ViewContact', '848'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/intents/ref/ViewInstrument', '9af'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/ViewNews',
        component: ComponentCreator('/docs/intents/ref/ViewNews', 'e12'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/intents/ref/ViewQuote', 'f91'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/intents/spec',
        component: ComponentCreator('/docs/intents/spec', '090'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/supported-platforms',
        component: ComponentCreator('/docs/supported-platforms', 'a3c'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/use-cases/overview',
        component: ComponentCreator('/docs/use-cases/overview', 'c0c'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-1',
        component: ComponentCreator('/docs/use-cases/uc-1', 'f8e'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-10',
        component: ComponentCreator('/docs/use-cases/uc-10', '980'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-13',
        component: ComponentCreator('/docs/use-cases/uc-13', '649'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-15',
        component: ComponentCreator('/docs/use-cases/uc-15', '2b2'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-16',
        component: ComponentCreator('/docs/use-cases/uc-16', '57e'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-17',
        component: ComponentCreator('/docs/use-cases/uc-17', '2ce'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-2',
        component: ComponentCreator('/docs/use-cases/uc-2', '960'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-3',
        component: ComponentCreator('/docs/use-cases/uc-3', '04a'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-4',
        component: ComponentCreator('/docs/use-cases/uc-4', '536'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-5',
        component: ComponentCreator('/docs/use-cases/uc-5', '060'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/use-cases/uc-9',
        component: ComponentCreator('/docs/use-cases/uc-9', '490'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/why-fdc3',
        component: ComponentCreator('/docs/why-fdc3', 'a5e'),
        exact: true,
        sidebar: "version-1.2/docs"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'cb1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
