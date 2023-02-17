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
    path: '/docs/1.0',
    component: ComponentCreator('/docs/1.0', 'c9e'),
    routes: [
      {
        path: '/docs/1.0/api/api-intro',
        component: ComponentCreator('/docs/1.0/api/api-intro', '0e4'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/api/api-spec',
        component: ComponentCreator('/docs/1.0/api/api-spec', '703'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/api/Context',
        component: ComponentCreator('/docs/1.0/api/Context', '685'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/api/DesktopAgent',
        component: ComponentCreator('/docs/1.0/api/DesktopAgent', 'c6c'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/api/Errors',
        component: ComponentCreator('/docs/1.0/api/Errors', '23f'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/api/ref/Channel',
        component: ComponentCreator('/docs/1.0/api/ref/Channel', '602'),
        exact: true
      },
      {
        path: '/docs/1.0/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/1.0/api/ref/DesktopAgent', 'e7c'),
        exact: true
      },
      {
        path: '/docs/1.0/api/ref/Errors',
        component: ComponentCreator('/docs/1.0/api/ref/Errors', '91e'),
        exact: true
      },
      {
        path: '/docs/1.0/api/ref/Globals',
        component: ComponentCreator('/docs/1.0/api/ref/Globals', '98e'),
        exact: true
      },
      {
        path: '/docs/1.0/api/ref/Metadata',
        component: ComponentCreator('/docs/1.0/api/ref/Metadata', 'a0f'),
        exact: true
      },
      {
        path: '/docs/1.0/api/ref/PrivateChannel',
        component: ComponentCreator('/docs/1.0/api/ref/PrivateChannel', '2d7'),
        exact: true
      },
      {
        path: '/docs/1.0/api/ref/Types',
        component: ComponentCreator('/docs/1.0/api/ref/Types', '4c7'),
        exact: true
      },
      {
        path: '/docs/1.0/api/spec',
        component: ComponentCreator('/docs/1.0/api/spec', '1ff'),
        exact: true
      },
      {
        path: '/docs/1.0/app-directory/overview',
        component: ComponentCreator('/docs/1.0/app-directory/overview', '35a'),
        exact: true
      },
      {
        path: '/docs/1.0/app-directory/spec',
        component: ComponentCreator('/docs/1.0/app-directory/spec', 'e9e'),
        exact: true
      },
      {
        path: '/docs/1.0/appd-discovery',
        component: ComponentCreator('/docs/1.0/appd-discovery', 'c78'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/appd-intro',
        component: ComponentCreator('/docs/1.0/appd-intro', 'f37'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/appd-spec',
        component: ComponentCreator('/docs/1.0/appd-spec', '870'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/appd-use',
        component: ComponentCreator('/docs/1.0/appd-use', '65a'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/context-intro',
        component: ComponentCreator('/docs/1.0/context-intro', 'efd'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/context-spec',
        component: ComponentCreator('/docs/1.0/context-spec', '5c1'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/context/ref/Chart',
        component: ComponentCreator('/docs/1.0/context/ref/Chart', '8ba'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/ChatInitSettings',
        component: ComponentCreator('/docs/1.0/context/ref/ChatInitSettings', '4e5'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Contact',
        component: ComponentCreator('/docs/1.0/context/ref/Contact', '89d'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/ContactList',
        component: ComponentCreator('/docs/1.0/context/ref/ContactList', '464'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Context',
        component: ComponentCreator('/docs/1.0/context/ref/Context', '393'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Country',
        component: ComponentCreator('/docs/1.0/context/ref/Country', '1fa'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Currency',
        component: ComponentCreator('/docs/1.0/context/ref/Currency', '145'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Email',
        component: ComponentCreator('/docs/1.0/context/ref/Email', 'a03'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Instrument',
        component: ComponentCreator('/docs/1.0/context/ref/Instrument', 'ee2'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/InstrumentList',
        component: ComponentCreator('/docs/1.0/context/ref/InstrumentList', '72a'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Nothing',
        component: ComponentCreator('/docs/1.0/context/ref/Nothing', '5e0'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Organization',
        component: ComponentCreator('/docs/1.0/context/ref/Organization', '66a'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Portfolio',
        component: ComponentCreator('/docs/1.0/context/ref/Portfolio', '885'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Position',
        component: ComponentCreator('/docs/1.0/context/ref/Position', '6f7'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/TimeRange',
        component: ComponentCreator('/docs/1.0/context/ref/TimeRange', 'f4b'),
        exact: true
      },
      {
        path: '/docs/1.0/context/ref/Valuation',
        component: ComponentCreator('/docs/1.0/context/ref/Valuation', 'efb'),
        exact: true
      },
      {
        path: '/docs/1.0/context/spec',
        component: ComponentCreator('/docs/1.0/context/spec', '21c'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-charter',
        component: ComponentCreator('/docs/1.0/fdc3-charter', 'c68'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/fdc3-compliance',
        component: ComponentCreator('/docs/1.0/fdc3-compliance', '6ab'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/fdc3-glossary',
        component: ComponentCreator('/docs/1.0/fdc3-glossary', '99f'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-intro',
        component: ComponentCreator('/docs/1.0/fdc3-intro', '4ee'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/fdc3-standard',
        component: ComponentCreator('/docs/1.0/fdc3-standard', 'c8c'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/guides/submit-new-intent',
        component: ComponentCreator('/docs/1.0/guides/submit-new-intent', '296'),
        exact: true
      },
      {
        path: '/docs/1.0/intents-intro',
        component: ComponentCreator('/docs/1.0/intents-intro', '42e'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/intents-spec',
        component: ComponentCreator('/docs/1.0/intents-spec', 'ebb'),
        exact: true,
        sidebar: "version-1.0/docs"
      },
      {
        path: '/docs/1.0/intents/ref/StartCall',
        component: ComponentCreator('/docs/1.0/intents/ref/StartCall', '8e7'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/StartChat',
        component: ComponentCreator('/docs/1.0/intents/ref/StartChat', '755'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/StartEmail',
        component: ComponentCreator('/docs/1.0/intents/ref/StartEmail', '11c'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewAnalysis', '7f7'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewChart',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewChart', '320'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewContact',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewContact', '94b'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewHoldings',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewHoldings', '444'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewInstrument', '852'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewInteractions',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewInteractions', '595'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewNews',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewNews', '58c'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewOrders',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewOrders', '93f'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewProfile',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewProfile', 'b1d'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewQuote', 'fc5'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/ref/ViewResearch',
        component: ComponentCreator('/docs/1.0/intents/ref/ViewResearch', '46b'),
        exact: true
      },
      {
        path: '/docs/1.0/intents/spec',
        component: ComponentCreator('/docs/1.0/intents/spec', '612'),
        exact: true
      },
      {
        path: '/docs/1.0/references',
        component: ComponentCreator('/docs/1.0/references', '9c2'),
        exact: true
      },
      {
        path: '/docs/1.0/supported-platforms',
        component: ComponentCreator('/docs/1.0/supported-platforms', 'b23'),
        exact: true
      },
      {
        path: '/docs/1.0/trademarks',
        component: ComponentCreator('/docs/1.0/trademarks', '06e'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/',
        component: ComponentCreator('/docs/1.0/use-cases/', 'a4d'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/meeting-minutes/2020-01-16 uc-wg meeting notes',
        component: ComponentCreator('/docs/1.0/use-cases/meeting-minutes/2020-01-16 uc-wg meeting notes', '832'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/meeting-minutes/2020-02-20 uc-wg meeting notes',
        component: ComponentCreator('/docs/1.0/use-cases/meeting-minutes/2020-02-20 uc-wg meeting notes', '995'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/meeting-minutes/2020-03-19 uc-wg meeting notes',
        component: ComponentCreator('/docs/1.0/use-cases/meeting-minutes/2020-03-19 uc-wg meeting notes', '046'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/overview',
        component: ComponentCreator('/docs/1.0/use-cases/overview', 'b57'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-1',
        component: ComponentCreator('/docs/1.0/use-cases/uc-1', 'ed2'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-10',
        component: ComponentCreator('/docs/1.0/use-cases/uc-10', '696'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-13',
        component: ComponentCreator('/docs/1.0/use-cases/uc-13', '64c'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-15',
        component: ComponentCreator('/docs/1.0/use-cases/uc-15', '17b'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-16',
        component: ComponentCreator('/docs/1.0/use-cases/uc-16', '136'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-17',
        component: ComponentCreator('/docs/1.0/use-cases/uc-17', '5a0'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-2',
        component: ComponentCreator('/docs/1.0/use-cases/uc-2', 'dea'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-3',
        component: ComponentCreator('/docs/1.0/use-cases/uc-3', '801'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-4',
        component: ComponentCreator('/docs/1.0/use-cases/uc-4', '8ec'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-5',
        component: ComponentCreator('/docs/1.0/use-cases/uc-5', '0ec'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-9',
        component: ComponentCreator('/docs/1.0/use-cases/uc-9', 'c02'),
        exact: true,
        sidebar: "version-1.0/use-cases"
      },
      {
        path: '/docs/1.0/why-fdc3',
        component: ComponentCreator('/docs/1.0/why-fdc3', '3e4'),
        exact: true,
        sidebar: "version-1.0/docs"
      }
    ]
  },
  {
    path: '/docs/1.1',
    component: ComponentCreator('/docs/1.1', '175'),
    routes: [
      {
        path: '/docs/1.1/api/api-intro',
        component: ComponentCreator('/docs/1.1/api/api-intro', 'e70'),
        exact: true
      },
      {
        path: '/docs/1.1/api/api-spec',
        component: ComponentCreator('/docs/1.1/api/api-spec', '10d'),
        exact: true
      },
      {
        path: '/docs/1.1/api/Context',
        component: ComponentCreator('/docs/1.1/api/Context', 'cce'),
        exact: true
      },
      {
        path: '/docs/1.1/api/DesktopAgent',
        component: ComponentCreator('/docs/1.1/api/DesktopAgent', '798'),
        exact: true
      },
      {
        path: '/docs/1.1/api/Errors',
        component: ComponentCreator('/docs/1.1/api/Errors', 'eb0'),
        exact: true
      },
      {
        path: '/docs/1.1/api/overview',
        component: ComponentCreator('/docs/1.1/api/overview', 'bb5'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/AppIntent',
        component: ComponentCreator('/docs/1.1/api/ref/AppIntent', '52e'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/AppMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/AppMetadata', '03c'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/Channel',
        component: ComponentCreator('/docs/1.1/api/ref/Channel', 'aa4'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/ChannelError',
        component: ComponentCreator('/docs/1.1/api/ref/ChannelError', 'b24'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/Context',
        component: ComponentCreator('/docs/1.1/api/ref/Context', '0ed'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/ContextHandler',
        component: ComponentCreator('/docs/1.1/api/ref/ContextHandler', 'f64'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/1.1/api/ref/DesktopAgent', 'a90'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/DisplayMetadata', '844'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/IntentMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/IntentMetadata', '796'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/IntentResolution',
        component: ComponentCreator('/docs/1.1/api/ref/IntentResolution', '645'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/Listener',
        component: ComponentCreator('/docs/1.1/api/ref/Listener', '97e'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/OpenError',
        component: ComponentCreator('/docs/1.1/api/ref/OpenError', '37b'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/ref/ResolveError',
        component: ComponentCreator('/docs/1.1/api/ref/ResolveError', '5ba'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/api/spec',
        component: ComponentCreator('/docs/1.1/api/spec', '355'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/app-directory/discovery',
        component: ComponentCreator('/docs/1.1/app-directory/discovery', 'c98'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/app-directory/overview',
        component: ComponentCreator('/docs/1.1/app-directory/overview', '4ad'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/app-directory/spec',
        component: ComponentCreator('/docs/1.1/app-directory/spec', 'd66'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/app-directory/usage',
        component: ComponentCreator('/docs/1.1/app-directory/usage', '993'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/appd-discovery',
        component: ComponentCreator('/docs/1.1/appd-discovery', '05b'),
        exact: true
      },
      {
        path: '/docs/1.1/appd-intro',
        component: ComponentCreator('/docs/1.1/appd-intro', 'be7'),
        exact: true
      },
      {
        path: '/docs/1.1/appd-spec',
        component: ComponentCreator('/docs/1.1/appd-spec', 'f1b'),
        exact: true
      },
      {
        path: '/docs/1.1/appd-use',
        component: ComponentCreator('/docs/1.1/appd-use', '3da'),
        exact: true
      },
      {
        path: '/docs/1.1/context-intro',
        component: ComponentCreator('/docs/1.1/context-intro', '248'),
        exact: true
      },
      {
        path: '/docs/1.1/context-spec',
        component: ComponentCreator('/docs/1.1/context-spec', 'ded'),
        exact: true
      },
      {
        path: '/docs/1.1/context/overview',
        component: ComponentCreator('/docs/1.1/context/overview', 'ed6'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Contact',
        component: ComponentCreator('/docs/1.1/context/ref/Contact', '644'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/ContactList',
        component: ComponentCreator('/docs/1.1/context/ref/ContactList', '73b'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Context',
        component: ComponentCreator('/docs/1.1/context/ref/Context', 'b75'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Country',
        component: ComponentCreator('/docs/1.1/context/ref/Country', 'cf6'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Instrument',
        component: ComponentCreator('/docs/1.1/context/ref/Instrument', '379'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/InstrumentList',
        component: ComponentCreator('/docs/1.1/context/ref/InstrumentList', '074'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Organization',
        component: ComponentCreator('/docs/1.1/context/ref/Organization', 'aac'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Portfolio',
        component: ComponentCreator('/docs/1.1/context/ref/Portfolio', 'a81'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/ref/Position',
        component: ComponentCreator('/docs/1.1/context/ref/Position', '681'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/context/spec',
        component: ComponentCreator('/docs/1.1/context/spec', '348'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/fdc3-charter',
        component: ComponentCreator('/docs/1.1/fdc3-charter', '5ba'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/fdc3-compliance',
        component: ComponentCreator('/docs/1.1/fdc3-compliance', '512'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/fdc3-intro',
        component: ComponentCreator('/docs/1.1/fdc3-intro', 'daa'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/fdc3-standard',
        component: ComponentCreator('/docs/1.1/fdc3-standard', '8cc'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents-intro',
        component: ComponentCreator('/docs/1.1/intents-intro', '6b1'),
        exact: true
      },
      {
        path: '/docs/1.1/intents-spec',
        component: ComponentCreator('/docs/1.1/intents-spec', '6f1'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/overview',
        component: ComponentCreator('/docs/1.1/intents/overview', '488'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/StartCall',
        component: ComponentCreator('/docs/1.1/intents/ref/StartCall', 'a3c'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/StartChat',
        component: ComponentCreator('/docs/1.1/intents/ref/StartChat', 'c2b'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewAnalysis', '2cf'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewChart',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewChart', 'b57'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewContact',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewContact', 'd88'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewInstrument', '569'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewNews',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewNews', '2fa'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewQuote', '0a5'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/intents/spec',
        component: ComponentCreator('/docs/1.1/intents/spec', '680'),
        exact: true,
        sidebar: "version-1.1/docs"
      },
      {
        path: '/docs/1.1/use-cases/overview',
        component: ComponentCreator('/docs/1.1/use-cases/overview', '1f8'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-1',
        component: ComponentCreator('/docs/1.1/use-cases/uc-1', '1ec'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-10',
        component: ComponentCreator('/docs/1.1/use-cases/uc-10', '314'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-13',
        component: ComponentCreator('/docs/1.1/use-cases/uc-13', 'c35'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-15',
        component: ComponentCreator('/docs/1.1/use-cases/uc-15', 'b68'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-16',
        component: ComponentCreator('/docs/1.1/use-cases/uc-16', 'd93'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-17',
        component: ComponentCreator('/docs/1.1/use-cases/uc-17', '76a'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-2',
        component: ComponentCreator('/docs/1.1/use-cases/uc-2', '5cb'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-3',
        component: ComponentCreator('/docs/1.1/use-cases/uc-3', '3fd'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-4',
        component: ComponentCreator('/docs/1.1/use-cases/uc-4', 'abf'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-5',
        component: ComponentCreator('/docs/1.1/use-cases/uc-5', 'f1f'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-9',
        component: ComponentCreator('/docs/1.1/use-cases/uc-9', '0f9'),
        exact: true,
        sidebar: "version-1.1/use-cases"
      },
      {
        path: '/docs/1.1/why-fdc3',
        component: ComponentCreator('/docs/1.1/why-fdc3', 'd74'),
        exact: true,
        sidebar: "version-1.1/docs"
      }
    ]
  },
  {
    path: '/docs/1.2',
    component: ComponentCreator('/docs/1.2', 'e9e'),
    routes: [
      {
        path: '/docs/1.2/api/api-intro',
        component: ComponentCreator('/docs/1.2/api/api-intro', 'c31'),
        exact: true
      },
      {
        path: '/docs/1.2/api/api-spec',
        component: ComponentCreator('/docs/1.2/api/api-spec', '7ca'),
        exact: true
      },
      {
        path: '/docs/1.2/api/Context',
        component: ComponentCreator('/docs/1.2/api/Context', '269'),
        exact: true
      },
      {
        path: '/docs/1.2/api/DesktopAgent',
        component: ComponentCreator('/docs/1.2/api/DesktopAgent', '228'),
        exact: true
      },
      {
        path: '/docs/1.2/api/Errors',
        component: ComponentCreator('/docs/1.2/api/Errors', '912'),
        exact: true
      },
      {
        path: '/docs/1.2/api/overview',
        component: ComponentCreator('/docs/1.2/api/overview', '676'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/ref/AppIntent',
        component: ComponentCreator('/docs/1.2/api/ref/AppIntent', '6a9'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/AppMetadata',
        component: ComponentCreator('/docs/1.2/api/ref/AppMetadata', '4fb'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Channel',
        component: ComponentCreator('/docs/1.2/api/ref/Channel', '9ef'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/ref/ChannelError',
        component: ComponentCreator('/docs/1.2/api/ref/ChannelError', '310'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Context',
        component: ComponentCreator('/docs/1.2/api/ref/Context', '2a1'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/ContextHandler',
        component: ComponentCreator('/docs/1.2/api/ref/ContextHandler', '8c2'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/1.2/api/ref/DesktopAgent', '46d'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/1.2/api/ref/DisplayMetadata', 'c03'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Errors',
        component: ComponentCreator('/docs/1.2/api/ref/Errors', '6a6'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/ref/Globals',
        component: ComponentCreator('/docs/1.2/api/ref/Globals', '8fe'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/ref/IntentMetadata',
        component: ComponentCreator('/docs/1.2/api/ref/IntentMetadata', 'a3d'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/IntentResolution',
        component: ComponentCreator('/docs/1.2/api/ref/IntentResolution', '7a2'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Listener',
        component: ComponentCreator('/docs/1.2/api/ref/Listener', 'e99'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Metadata',
        component: ComponentCreator('/docs/1.2/api/ref/Metadata', '50f'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/ref/OpenError',
        component: ComponentCreator('/docs/1.2/api/ref/OpenError', '0b3'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/ResolveError',
        component: ComponentCreator('/docs/1.2/api/ref/ResolveError', '8ec'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Types',
        component: ComponentCreator('/docs/1.2/api/ref/Types', 'f7a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/api/spec',
        component: ComponentCreator('/docs/1.2/api/spec', '639'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/app-directory/discovery',
        component: ComponentCreator('/docs/1.2/app-directory/discovery', '6ba'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/app-directory/overview',
        component: ComponentCreator('/docs/1.2/app-directory/overview', '9a8'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/app-directory/spec',
        component: ComponentCreator('/docs/1.2/app-directory/spec', 'a4f'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/app-directory/usage',
        component: ComponentCreator('/docs/1.2/app-directory/usage', '889'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/appd-discovery',
        component: ComponentCreator('/docs/1.2/appd-discovery', '33c'),
        exact: true
      },
      {
        path: '/docs/1.2/appd-intro',
        component: ComponentCreator('/docs/1.2/appd-intro', 'f6f'),
        exact: true
      },
      {
        path: '/docs/1.2/appd-spec',
        component: ComponentCreator('/docs/1.2/appd-spec', 'c3b'),
        exact: true
      },
      {
        path: '/docs/1.2/appd-use',
        component: ComponentCreator('/docs/1.2/appd-use', '3be'),
        exact: true
      },
      {
        path: '/docs/1.2/context-intro',
        component: ComponentCreator('/docs/1.2/context-intro', '74a'),
        exact: true
      },
      {
        path: '/docs/1.2/context-spec',
        component: ComponentCreator('/docs/1.2/context-spec', '305'),
        exact: true
      },
      {
        path: '/docs/1.2/context/overview',
        component: ComponentCreator('/docs/1.2/context/overview', 'c46'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Contact',
        component: ComponentCreator('/docs/1.2/context/ref/Contact', '5de'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/ContactList',
        component: ComponentCreator('/docs/1.2/context/ref/ContactList', '42b'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Context',
        component: ComponentCreator('/docs/1.2/context/ref/Context', '10c'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Country',
        component: ComponentCreator('/docs/1.2/context/ref/Country', '389'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Instrument',
        component: ComponentCreator('/docs/1.2/context/ref/Instrument', '8d5'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/InstrumentList',
        component: ComponentCreator('/docs/1.2/context/ref/InstrumentList', '7e4'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Organization',
        component: ComponentCreator('/docs/1.2/context/ref/Organization', 'a51'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Portfolio',
        component: ComponentCreator('/docs/1.2/context/ref/Portfolio', '3a3'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/ref/Position',
        component: ComponentCreator('/docs/1.2/context/ref/Position', 'd2a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/context/spec',
        component: ComponentCreator('/docs/1.2/context/spec', '54b'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/fdc3-charter',
        component: ComponentCreator('/docs/1.2/fdc3-charter', '4d0'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/fdc3-compliance',
        component: ComponentCreator('/docs/1.2/fdc3-compliance', '001'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/fdc3-intro',
        component: ComponentCreator('/docs/1.2/fdc3-intro', 'f6a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/fdc3-standard',
        component: ComponentCreator('/docs/1.2/fdc3-standard', '3f4'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents-intro',
        component: ComponentCreator('/docs/1.2/intents-intro', '324'),
        exact: true
      },
      {
        path: '/docs/1.2/intents-spec',
        component: ComponentCreator('/docs/1.2/intents-spec', '0c1'),
        exact: true
      },
      {
        path: '/docs/1.2/intents/overview',
        component: ComponentCreator('/docs/1.2/intents/overview', '73a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/StartCall',
        component: ComponentCreator('/docs/1.2/intents/ref/StartCall', '26f'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/StartChat',
        component: ComponentCreator('/docs/1.2/intents/ref/StartChat', 'f8d'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewAnalysis', '2b1'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewChart',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewChart', '9ec'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewContact',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewContact', 'f8a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewInstrument', '6d8'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewNews',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewNews', 'f7a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewQuote', '0bc'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/intents/spec',
        component: ComponentCreator('/docs/1.2/intents/spec', 'dfd'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/supported-platforms',
        component: ComponentCreator('/docs/1.2/supported-platforms', '68a'),
        exact: true,
        sidebar: "version-1.2/docs"
      },
      {
        path: '/docs/1.2/use-cases/overview',
        component: ComponentCreator('/docs/1.2/use-cases/overview', '49c'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-1',
        component: ComponentCreator('/docs/1.2/use-cases/uc-1', '7a2'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-10',
        component: ComponentCreator('/docs/1.2/use-cases/uc-10', '2a0'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-13',
        component: ComponentCreator('/docs/1.2/use-cases/uc-13', '493'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-15',
        component: ComponentCreator('/docs/1.2/use-cases/uc-15', 'bb2'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-16',
        component: ComponentCreator('/docs/1.2/use-cases/uc-16', '588'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-17',
        component: ComponentCreator('/docs/1.2/use-cases/uc-17', 'b83'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-2',
        component: ComponentCreator('/docs/1.2/use-cases/uc-2', 'ea0'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-3',
        component: ComponentCreator('/docs/1.2/use-cases/uc-3', '8d1'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-4',
        component: ComponentCreator('/docs/1.2/use-cases/uc-4', '7ba'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-5',
        component: ComponentCreator('/docs/1.2/use-cases/uc-5', '4ec'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-9',
        component: ComponentCreator('/docs/1.2/use-cases/uc-9', '3a1'),
        exact: true,
        sidebar: "version-1.2/use-cases"
      },
      {
        path: '/docs/1.2/why-fdc3',
        component: ComponentCreator('/docs/1.2/why-fdc3', '0ee'),
        exact: true,
        sidebar: "version-1.2/docs"
      }
    ]
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
    component: ComponentCreator('/docs', '617'),
    routes: [
      {
        path: '/docs/api/overview',
        component: ComponentCreator('/docs/api/overview', '6e0'),
        exact: true
      },
      {
        path: '/docs/api/ref/Channel',
        component: ComponentCreator('/docs/api/ref/Channel', 'edb'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/api/ref/DesktopAgent', 'd72'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/ref/Errors',
        component: ComponentCreator('/docs/api/ref/Errors', 'a19'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/ref/Globals',
        component: ComponentCreator('/docs/api/ref/Globals', '16d'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/ref/Metadata',
        component: ComponentCreator('/docs/api/ref/Metadata', '75b'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/ref/PrivateChannel',
        component: ComponentCreator('/docs/api/ref/PrivateChannel', '304'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/ref/Types',
        component: ComponentCreator('/docs/api/ref/Types', 'c6a'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/api/spec',
        component: ComponentCreator('/docs/api/spec', '408'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/app-directory/overview',
        component: ComponentCreator('/docs/app-directory/overview', '564'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/app-directory/spec',
        component: ComponentCreator('/docs/app-directory/spec', '07c'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Chart',
        component: ComponentCreator('/docs/context/ref/Chart', '3f1'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/ChatInitSettings',
        component: ComponentCreator('/docs/context/ref/ChatInitSettings', '4f1'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Contact',
        component: ComponentCreator('/docs/context/ref/Contact', 'dd9'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/ContactList',
        component: ComponentCreator('/docs/context/ref/ContactList', '0f0'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Context',
        component: ComponentCreator('/docs/context/ref/Context', '86a'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Country',
        component: ComponentCreator('/docs/context/ref/Country', '752'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Currency',
        component: ComponentCreator('/docs/context/ref/Currency', '514'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Email',
        component: ComponentCreator('/docs/context/ref/Email', 'f0b'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Instrument',
        component: ComponentCreator('/docs/context/ref/Instrument', 'b92'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/InstrumentList',
        component: ComponentCreator('/docs/context/ref/InstrumentList', 'b34'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Nothing',
        component: ComponentCreator('/docs/context/ref/Nothing', 'abc'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Organization',
        component: ComponentCreator('/docs/context/ref/Organization', 'ff4'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Portfolio',
        component: ComponentCreator('/docs/context/ref/Portfolio', 'a5f'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Position',
        component: ComponentCreator('/docs/context/ref/Position', '179'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/TimeRange',
        component: ComponentCreator('/docs/context/ref/TimeRange', '836'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/ref/Valuation',
        component: ComponentCreator('/docs/context/ref/Valuation', 'e8f'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/context/spec',
        component: ComponentCreator('/docs/context/spec', '5ff'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/fdc3-charter',
        component: ComponentCreator('/docs/fdc3-charter', 'bcf'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/fdc3-compliance',
        component: ComponentCreator('/docs/fdc3-compliance', 'a0b'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/fdc3-glossary',
        component: ComponentCreator('/docs/fdc3-glossary', '601'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/fdc3-intro',
        component: ComponentCreator('/docs/fdc3-intro', 'b4c'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/fdc3-standard',
        component: ComponentCreator('/docs/fdc3-standard', '6c8'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/guides/submit-new-intent',
        component: ComponentCreator('/docs/guides/submit-new-intent', '299'),
        exact: true
      },
      {
        path: '/docs/intents/overview',
        component: ComponentCreator('/docs/intents/overview', '08e'),
        exact: true
      },
      {
        path: '/docs/intents/ref/StartCall',
        component: ComponentCreator('/docs/intents/ref/StartCall', 'ad5'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/StartChat',
        component: ComponentCreator('/docs/intents/ref/StartChat', '745'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/StartEmail',
        component: ComponentCreator('/docs/intents/ref/StartEmail', '8f1'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/intents/ref/ViewAnalysis', '446'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewChart',
        component: ComponentCreator('/docs/intents/ref/ViewChart', '313'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewContact',
        component: ComponentCreator('/docs/intents/ref/ViewContact', '40a'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewHoldings',
        component: ComponentCreator('/docs/intents/ref/ViewHoldings', 'a9e'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/intents/ref/ViewInstrument', 'e3c'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewInteractions',
        component: ComponentCreator('/docs/intents/ref/ViewInteractions', '436'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewNews',
        component: ComponentCreator('/docs/intents/ref/ViewNews', 'ac5'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewOrders',
        component: ComponentCreator('/docs/intents/ref/ViewOrders', '2d7'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewProfile',
        component: ComponentCreator('/docs/intents/ref/ViewProfile', '4ea'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/intents/ref/ViewQuote', '059'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/ref/ViewResearch',
        component: ComponentCreator('/docs/intents/ref/ViewResearch', '1ea'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/intents/spec',
        component: ComponentCreator('/docs/intents/spec', 'c25'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/references',
        component: ComponentCreator('/docs/references', '93e'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/supported-platforms',
        component: ComponentCreator('/docs/supported-platforms', '7eb'),
        exact: true,
        sidebar: "version-2.0/docs"
      },
      {
        path: '/docs/trademarks',
        component: ComponentCreator('/docs/trademarks', 'd3f'),
        exact: true
      },
      {
        path: '/docs/use-cases/overview',
        component: ComponentCreator('/docs/use-cases/overview', '218'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-1',
        component: ComponentCreator('/docs/use-cases/uc-1', '387'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-10',
        component: ComponentCreator('/docs/use-cases/uc-10', 'b20'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-13',
        component: ComponentCreator('/docs/use-cases/uc-13', 'eb8'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-15',
        component: ComponentCreator('/docs/use-cases/uc-15', '435'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-16',
        component: ComponentCreator('/docs/use-cases/uc-16', '690'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-17',
        component: ComponentCreator('/docs/use-cases/uc-17', '7ee'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-2',
        component: ComponentCreator('/docs/use-cases/uc-2', 'af9'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-3',
        component: ComponentCreator('/docs/use-cases/uc-3', '34c'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-4',
        component: ComponentCreator('/docs/use-cases/uc-4', 'cc1'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-5',
        component: ComponentCreator('/docs/use-cases/uc-5', '60f'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/use-cases/uc-9',
        component: ComponentCreator('/docs/use-cases/uc-9', '262'),
        exact: true,
        sidebar: "version-2.0/use-cases"
      },
      {
        path: '/docs/why-fdc3',
        component: ComponentCreator('/docs/why-fdc3', 'fdd'),
        exact: true,
        sidebar: "version-2.0/docs"
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
