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
    path: '/community',
    component: ComponentCreator('/community', '16c'),
    exact: true
  },
  {
    path: '/fdc3-roadmap',
    component: ComponentCreator('/fdc3-roadmap', 'b7b'),
    exact: true
  },
  {
    path: '/get-involved',
    component: ComponentCreator('/get-involved', '7ce'),
    exact: true
  },
  {
    path: '/users',
    component: ComponentCreator('/users', 'fc8'),
    exact: true
  },
  {
    path: '/versions',
    component: ComponentCreator('/versions', '6c6'),
    exact: true
  },
  {
    path: '/docs/1.0',
    component: ComponentCreator('/docs/1.0', 'cb3'),
    routes: [
      {
        path: '/docs/1.0/api/api-intro',
        component: ComponentCreator('/docs/1.0/api/api-intro', '073'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/api/api-spec',
        component: ComponentCreator('/docs/1.0/api/api-spec', 'e18'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/api/Context',
        component: ComponentCreator('/docs/1.0/api/Context', '817'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/api/DesktopAgent',
        component: ComponentCreator('/docs/1.0/api/DesktopAgent', '83f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/api/Errors',
        component: ComponentCreator('/docs/1.0/api/Errors', 'c56'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.0/appd-discovery', '4c7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/appd-intro',
        component: ComponentCreator('/docs/1.0/appd-intro', 'a6a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/appd-spec',
        component: ComponentCreator('/docs/1.0/appd-spec', '054'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/appd-use',
        component: ComponentCreator('/docs/1.0/appd-use', 'fad'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/context-intro',
        component: ComponentCreator('/docs/1.0/context-intro', '7da'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/context-spec',
        component: ComponentCreator('/docs/1.0/context-spec', '0d4'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.0/fdc3-charter', 'd19'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/fdc3-compliance',
        component: ComponentCreator('/docs/1.0/fdc3-compliance', 'bfb'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/fdc3-glossary',
        component: ComponentCreator('/docs/1.0/fdc3-glossary', '99f'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-intro',
        component: ComponentCreator('/docs/1.0/fdc3-intro', '465'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/fdc3-standard',
        component: ComponentCreator('/docs/1.0/fdc3-standard', '8f3'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/guides/submit-new-intent',
        component: ComponentCreator('/docs/1.0/guides/submit-new-intent', '296'),
        exact: true
      },
      {
        path: '/docs/1.0/intents-intro',
        component: ComponentCreator('/docs/1.0/intents-intro', '087'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.0/intents-spec',
        component: ComponentCreator('/docs/1.0/intents-spec', '7cd'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.0/use-cases/overview', '46d'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-1',
        component: ComponentCreator('/docs/1.0/use-cases/uc-1', '86a'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-10',
        component: ComponentCreator('/docs/1.0/use-cases/uc-10', 'a7c'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-13',
        component: ComponentCreator('/docs/1.0/use-cases/uc-13', '81a'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-15',
        component: ComponentCreator('/docs/1.0/use-cases/uc-15', '8e7'),
        exact: true,
        sidebar: "use-cases"
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
        component: ComponentCreator('/docs/1.0/use-cases/uc-2', 'f9e'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-3',
        component: ComponentCreator('/docs/1.0/use-cases/uc-3', 'a18'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-4',
        component: ComponentCreator('/docs/1.0/use-cases/uc-4', '070'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-5',
        component: ComponentCreator('/docs/1.0/use-cases/uc-5', '6ea'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/use-cases/uc-9',
        component: ComponentCreator('/docs/1.0/use-cases/uc-9', 'a73'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.0/why-fdc3',
        component: ComponentCreator('/docs/1.0/why-fdc3', '7c0'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/docs/1.1',
    component: ComponentCreator('/docs/1.1', '301'),
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
        component: ComponentCreator('/docs/1.1/api/overview', 'a7f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/AppIntent',
        component: ComponentCreator('/docs/1.1/api/ref/AppIntent', 'aa7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/AppMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/AppMetadata', '69f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/Channel',
        component: ComponentCreator('/docs/1.1/api/ref/Channel', '27b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/ChannelError',
        component: ComponentCreator('/docs/1.1/api/ref/ChannelError', '339'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/Context',
        component: ComponentCreator('/docs/1.1/api/ref/Context', 'ff0'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/ContextHandler',
        component: ComponentCreator('/docs/1.1/api/ref/ContextHandler', 'd14'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/1.1/api/ref/DesktopAgent', 'b5c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/DisplayMetadata', '350'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/IntentMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/IntentMetadata', '7c8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/IntentResolution',
        component: ComponentCreator('/docs/1.1/api/ref/IntentResolution', 'ef5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/Listener',
        component: ComponentCreator('/docs/1.1/api/ref/Listener', '73a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/OpenError',
        component: ComponentCreator('/docs/1.1/api/ref/OpenError', '7d2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/ref/ResolveError',
        component: ComponentCreator('/docs/1.1/api/ref/ResolveError', '4d5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/api/spec',
        component: ComponentCreator('/docs/1.1/api/spec', 'c1c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/app-directory/discovery',
        component: ComponentCreator('/docs/1.1/app-directory/discovery', 'e02'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/app-directory/overview',
        component: ComponentCreator('/docs/1.1/app-directory/overview', 'bc5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/app-directory/spec',
        component: ComponentCreator('/docs/1.1/app-directory/spec', '5b8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/app-directory/usage',
        component: ComponentCreator('/docs/1.1/app-directory/usage', '7e2'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.1/context/overview', 'aff'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Contact',
        component: ComponentCreator('/docs/1.1/context/ref/Contact', 'e50'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/ContactList',
        component: ComponentCreator('/docs/1.1/context/ref/ContactList', '879'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Context',
        component: ComponentCreator('/docs/1.1/context/ref/Context', '90b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Country',
        component: ComponentCreator('/docs/1.1/context/ref/Country', '056'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Instrument',
        component: ComponentCreator('/docs/1.1/context/ref/Instrument', '004'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/InstrumentList',
        component: ComponentCreator('/docs/1.1/context/ref/InstrumentList', '705'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Organization',
        component: ComponentCreator('/docs/1.1/context/ref/Organization', '6ca'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Portfolio',
        component: ComponentCreator('/docs/1.1/context/ref/Portfolio', '77d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/ref/Position',
        component: ComponentCreator('/docs/1.1/context/ref/Position', '611'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/context/spec',
        component: ComponentCreator('/docs/1.1/context/spec', '23e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/fdc3-charter',
        component: ComponentCreator('/docs/1.1/fdc3-charter', 'd22'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/fdc3-compliance',
        component: ComponentCreator('/docs/1.1/fdc3-compliance', 'b7b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/fdc3-intro',
        component: ComponentCreator('/docs/1.1/fdc3-intro', '574'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/fdc3-standard',
        component: ComponentCreator('/docs/1.1/fdc3-standard', '89a'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.1/intents/overview', '7ed'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/StartCall',
        component: ComponentCreator('/docs/1.1/intents/ref/StartCall', '0b1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/StartChat',
        component: ComponentCreator('/docs/1.1/intents/ref/StartChat', 'ba6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewAnalysis', '440'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewChart',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewChart', '548'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewContact',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewContact', '6f7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewInstrument', 'e92'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewNews',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewNews', '6b2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewQuote', '35e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/intents/spec',
        component: ComponentCreator('/docs/1.1/intents/spec', '0f6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.1/use-cases/overview',
        component: ComponentCreator('/docs/1.1/use-cases/overview', '15b'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-1',
        component: ComponentCreator('/docs/1.1/use-cases/uc-1', '664'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-10',
        component: ComponentCreator('/docs/1.1/use-cases/uc-10', 'efc'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-13',
        component: ComponentCreator('/docs/1.1/use-cases/uc-13', '77e'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-15',
        component: ComponentCreator('/docs/1.1/use-cases/uc-15', 'b51'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-16',
        component: ComponentCreator('/docs/1.1/use-cases/uc-16', '557'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-17',
        component: ComponentCreator('/docs/1.1/use-cases/uc-17', 'ad0'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-2',
        component: ComponentCreator('/docs/1.1/use-cases/uc-2', '9dc'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-3',
        component: ComponentCreator('/docs/1.1/use-cases/uc-3', '5a5'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-4',
        component: ComponentCreator('/docs/1.1/use-cases/uc-4', '7e7'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-5',
        component: ComponentCreator('/docs/1.1/use-cases/uc-5', '842'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/use-cases/uc-9',
        component: ComponentCreator('/docs/1.1/use-cases/uc-9', '0a7'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.1/why-fdc3',
        component: ComponentCreator('/docs/1.1/why-fdc3', '165'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/docs/1.2',
    component: ComponentCreator('/docs/1.2', 'eac'),
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
        component: ComponentCreator('/docs/1.2/api/overview', 'f0f'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.2/api/ref/Channel', '818'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.2/api/ref/DesktopAgent', '50c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/1.2/api/ref/DisplayMetadata', 'c03'),
        exact: true
      },
      {
        path: '/docs/1.2/api/ref/Errors',
        component: ComponentCreator('/docs/1.2/api/ref/Errors', '9c1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/api/ref/Globals',
        component: ComponentCreator('/docs/1.2/api/ref/Globals', '469'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.2/api/ref/Metadata', 'cc0'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.2/api/ref/Types', 'f40'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/api/spec',
        component: ComponentCreator('/docs/1.2/api/spec', '033'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/app-directory/discovery',
        component: ComponentCreator('/docs/1.2/app-directory/discovery', 'eed'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/app-directory/overview',
        component: ComponentCreator('/docs/1.2/app-directory/overview', 'bca'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/app-directory/spec',
        component: ComponentCreator('/docs/1.2/app-directory/spec', '87f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/app-directory/usage',
        component: ComponentCreator('/docs/1.2/app-directory/usage', '346'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.2/context/overview', '0e1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Contact',
        component: ComponentCreator('/docs/1.2/context/ref/Contact', '07e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/ContactList',
        component: ComponentCreator('/docs/1.2/context/ref/ContactList', '5ae'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Context',
        component: ComponentCreator('/docs/1.2/context/ref/Context', '32f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Country',
        component: ComponentCreator('/docs/1.2/context/ref/Country', '1be'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Instrument',
        component: ComponentCreator('/docs/1.2/context/ref/Instrument', 'c81'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/InstrumentList',
        component: ComponentCreator('/docs/1.2/context/ref/InstrumentList', 'ca2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Organization',
        component: ComponentCreator('/docs/1.2/context/ref/Organization', '55b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Portfolio',
        component: ComponentCreator('/docs/1.2/context/ref/Portfolio', '722'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/ref/Position',
        component: ComponentCreator('/docs/1.2/context/ref/Position', '0da'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/context/spec',
        component: ComponentCreator('/docs/1.2/context/spec', 'a15'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/fdc3-charter',
        component: ComponentCreator('/docs/1.2/fdc3-charter', 'ebc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/fdc3-compliance',
        component: ComponentCreator('/docs/1.2/fdc3-compliance', '9cd'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/fdc3-intro',
        component: ComponentCreator('/docs/1.2/fdc3-intro', '9fa'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/fdc3-standard',
        component: ComponentCreator('/docs/1.2/fdc3-standard', '23c'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/1.2/intents/overview', 'ebf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/StartCall',
        component: ComponentCreator('/docs/1.2/intents/ref/StartCall', '359'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/StartChat',
        component: ComponentCreator('/docs/1.2/intents/ref/StartChat', 'b3f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewAnalysis', '7c7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewChart',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewChart', '7ce'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewContact',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewContact', 'ffe'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewInstrument', '271'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewNews',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewNews', '2e9'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/1.2/intents/ref/ViewQuote', 'b70'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/intents/spec',
        component: ComponentCreator('/docs/1.2/intents/spec', 'fdf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/supported-platforms',
        component: ComponentCreator('/docs/1.2/supported-platforms', '356'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/1.2/use-cases/overview',
        component: ComponentCreator('/docs/1.2/use-cases/overview', '687'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-1',
        component: ComponentCreator('/docs/1.2/use-cases/uc-1', 'aa0'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-10',
        component: ComponentCreator('/docs/1.2/use-cases/uc-10', '992'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-13',
        component: ComponentCreator('/docs/1.2/use-cases/uc-13', 'e09'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-15',
        component: ComponentCreator('/docs/1.2/use-cases/uc-15', '0c3'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-16',
        component: ComponentCreator('/docs/1.2/use-cases/uc-16', '289'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-17',
        component: ComponentCreator('/docs/1.2/use-cases/uc-17', 'eee'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-2',
        component: ComponentCreator('/docs/1.2/use-cases/uc-2', '9ca'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-3',
        component: ComponentCreator('/docs/1.2/use-cases/uc-3', '3c3'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-4',
        component: ComponentCreator('/docs/1.2/use-cases/uc-4', '22f'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-5',
        component: ComponentCreator('/docs/1.2/use-cases/uc-5', '45b'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/use-cases/uc-9',
        component: ComponentCreator('/docs/1.2/use-cases/uc-9', '3ea'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/1.2/why-fdc3',
        component: ComponentCreator('/docs/1.2/why-fdc3', '400'),
        exact: true,
        sidebar: "docs"
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
    component: ComponentCreator('/docs', '678'),
    routes: [
      {
        path: '/docs/api/overview',
        component: ComponentCreator('/docs/api/overview', '6e0'),
        exact: true
      },
      {
        path: '/docs/api/ref/Channel',
        component: ComponentCreator('/docs/api/ref/Channel', '2b1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/api/ref/DesktopAgent', '219'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/ref/Errors',
        component: ComponentCreator('/docs/api/ref/Errors', '50f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/ref/Globals',
        component: ComponentCreator('/docs/api/ref/Globals', 'eab'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/ref/Metadata',
        component: ComponentCreator('/docs/api/ref/Metadata', '0c8'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/ref/PrivateChannel',
        component: ComponentCreator('/docs/api/ref/PrivateChannel', '108'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/ref/Types',
        component: ComponentCreator('/docs/api/ref/Types', '9f2'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/api/spec',
        component: ComponentCreator('/docs/api/spec', '3bf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/app-directory/overview',
        component: ComponentCreator('/docs/app-directory/overview', '916'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/app-directory/spec',
        component: ComponentCreator('/docs/app-directory/spec', '51f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Chart',
        component: ComponentCreator('/docs/context/ref/Chart', 'c55'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/ChatInitSettings',
        component: ComponentCreator('/docs/context/ref/ChatInitSettings', '215'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Contact',
        component: ComponentCreator('/docs/context/ref/Contact', 'cfc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/ContactList',
        component: ComponentCreator('/docs/context/ref/ContactList', '84b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Context',
        component: ComponentCreator('/docs/context/ref/Context', 'a2a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Country',
        component: ComponentCreator('/docs/context/ref/Country', '4de'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Currency',
        component: ComponentCreator('/docs/context/ref/Currency', 'cda'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Email',
        component: ComponentCreator('/docs/context/ref/Email', 'fa9'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Instrument',
        component: ComponentCreator('/docs/context/ref/Instrument', '4f1'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/InstrumentList',
        component: ComponentCreator('/docs/context/ref/InstrumentList', '1ae'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Nothing',
        component: ComponentCreator('/docs/context/ref/Nothing', '7cb'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Organization',
        component: ComponentCreator('/docs/context/ref/Organization', 'b67'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Portfolio',
        component: ComponentCreator('/docs/context/ref/Portfolio', '45f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Position',
        component: ComponentCreator('/docs/context/ref/Position', '1b4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/TimeRange',
        component: ComponentCreator('/docs/context/ref/TimeRange', 'e66'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/ref/Valuation',
        component: ComponentCreator('/docs/context/ref/Valuation', 'e07'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/context/spec',
        component: ComponentCreator('/docs/context/spec', '9eb'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/fdc3-charter',
        component: ComponentCreator('/docs/fdc3-charter', '884'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/fdc3-compliance',
        component: ComponentCreator('/docs/fdc3-compliance', 'b7a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/fdc3-glossary',
        component: ComponentCreator('/docs/fdc3-glossary', 'fe0'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/fdc3-intro',
        component: ComponentCreator('/docs/fdc3-intro', '2fb'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/fdc3-standard',
        component: ComponentCreator('/docs/fdc3-standard', 'c78'),
        exact: true,
        sidebar: "docs"
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
        component: ComponentCreator('/docs/intents/ref/StartCall', 'a22'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/StartChat',
        component: ComponentCreator('/docs/intents/ref/StartChat', 'c7d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/StartEmail',
        component: ComponentCreator('/docs/intents/ref/StartEmail', '2fc'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/intents/ref/ViewAnalysis', 'a9e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewChart',
        component: ComponentCreator('/docs/intents/ref/ViewChart', '043'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewContact',
        component: ComponentCreator('/docs/intents/ref/ViewContact', '8fb'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewHoldings',
        component: ComponentCreator('/docs/intents/ref/ViewHoldings', '710'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/intents/ref/ViewInstrument', 'a94'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewInteractions',
        component: ComponentCreator('/docs/intents/ref/ViewInteractions', '9ec'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewNews',
        component: ComponentCreator('/docs/intents/ref/ViewNews', '846'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewOrders',
        component: ComponentCreator('/docs/intents/ref/ViewOrders', '957'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewProfile',
        component: ComponentCreator('/docs/intents/ref/ViewProfile', '5b4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/intents/ref/ViewQuote', 'b05'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/ref/ViewResearch',
        component: ComponentCreator('/docs/intents/ref/ViewResearch', '4b9'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/intents/spec',
        component: ComponentCreator('/docs/intents/spec', '8a5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/references',
        component: ComponentCreator('/docs/references', '941'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/supported-platforms',
        component: ComponentCreator('/docs/supported-platforms', 'c8c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/trademarks',
        component: ComponentCreator('/docs/trademarks', 'd3f'),
        exact: true
      },
      {
        path: '/docs/use-cases/overview',
        component: ComponentCreator('/docs/use-cases/overview', '7f0'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-1',
        component: ComponentCreator('/docs/use-cases/uc-1', '588'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-10',
        component: ComponentCreator('/docs/use-cases/uc-10', 'fe0'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-13',
        component: ComponentCreator('/docs/use-cases/uc-13', '2c4'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-15',
        component: ComponentCreator('/docs/use-cases/uc-15', '914'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-16',
        component: ComponentCreator('/docs/use-cases/uc-16', '4f3'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-17',
        component: ComponentCreator('/docs/use-cases/uc-17', '1f4'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-2',
        component: ComponentCreator('/docs/use-cases/uc-2', '206'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-3',
        component: ComponentCreator('/docs/use-cases/uc-3', 'f1a'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-4',
        component: ComponentCreator('/docs/use-cases/uc-4', '200'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-5',
        component: ComponentCreator('/docs/use-cases/uc-5', 'ab5'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/use-cases/uc-9',
        component: ComponentCreator('/docs/use-cases/uc-9', 'd51'),
        exact: true,
        sidebar: "use-cases"
      },
      {
        path: '/docs/why-fdc3',
        component: ComponentCreator('/docs/why-fdc3', '475'),
        exact: true,
        sidebar: "docs"
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
