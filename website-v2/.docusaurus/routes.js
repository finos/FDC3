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
    component: ComponentCreator('/docs/1.0', 'af1'),
    routes: [
      {
        path: '/docs/1.0/api/api-intro',
        component: ComponentCreator('/docs/1.0/api/api-intro', 'a77'),
        exact: true
      },
      {
        path: '/docs/1.0/api/api-spec',
        component: ComponentCreator('/docs/1.0/api/api-spec', 'bc2'),
        exact: true
      },
      {
        path: '/docs/1.0/api/Context',
        component: ComponentCreator('/docs/1.0/api/Context', 'ba5'),
        exact: true
      },
      {
        path: '/docs/1.0/api/DesktopAgent',
        component: ComponentCreator('/docs/1.0/api/DesktopAgent', '2d0'),
        exact: true
      },
      {
        path: '/docs/1.0/api/Errors',
        component: ComponentCreator('/docs/1.0/api/Errors', 'd35'),
        exact: true
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
        component: ComponentCreator('/docs/1.0/appd-discovery', '8c5'),
        exact: true
      },
      {
        path: '/docs/1.0/appd-intro',
        component: ComponentCreator('/docs/1.0/appd-intro', '55e'),
        exact: true
      },
      {
        path: '/docs/1.0/appd-spec',
        component: ComponentCreator('/docs/1.0/appd-spec', '783'),
        exact: true
      },
      {
        path: '/docs/1.0/appd-use',
        component: ComponentCreator('/docs/1.0/appd-use', '9d4'),
        exact: true
      },
      {
        path: '/docs/1.0/context-intro',
        component: ComponentCreator('/docs/1.0/context-intro', 'd51'),
        exact: true
      },
      {
        path: '/docs/1.0/context-spec',
        component: ComponentCreator('/docs/1.0/context-spec', '121'),
        exact: true
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
        component: ComponentCreator('/docs/1.0/fdc3-charter', '80e'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-compliance',
        component: ComponentCreator('/docs/1.0/fdc3-compliance', '6f9'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-glossary',
        component: ComponentCreator('/docs/1.0/fdc3-glossary', '99f'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-intro',
        component: ComponentCreator('/docs/1.0/fdc3-intro', 'f1d'),
        exact: true
      },
      {
        path: '/docs/1.0/fdc3-standard',
        component: ComponentCreator('/docs/1.0/fdc3-standard', 'd26'),
        exact: true
      },
      {
        path: '/docs/1.0/guides/submit-new-intent',
        component: ComponentCreator('/docs/1.0/guides/submit-new-intent', '296'),
        exact: true
      },
      {
        path: '/docs/1.0/intents-intro',
        component: ComponentCreator('/docs/1.0/intents-intro', 'ecf'),
        exact: true
      },
      {
        path: '/docs/1.0/intents-spec',
        component: ComponentCreator('/docs/1.0/intents-spec', '1f8'),
        exact: true
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
        component: ComponentCreator('/docs/1.0/use-cases/overview', '4bb'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-1',
        component: ComponentCreator('/docs/1.0/use-cases/uc-1', '743'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-10',
        component: ComponentCreator('/docs/1.0/use-cases/uc-10', '7cf'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-13',
        component: ComponentCreator('/docs/1.0/use-cases/uc-13', '134'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-15',
        component: ComponentCreator('/docs/1.0/use-cases/uc-15', '510'),
        exact: true
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
        component: ComponentCreator('/docs/1.0/use-cases/uc-2', 'cd4'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-3',
        component: ComponentCreator('/docs/1.0/use-cases/uc-3', '060'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-4',
        component: ComponentCreator('/docs/1.0/use-cases/uc-4', '6dd'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-5',
        component: ComponentCreator('/docs/1.0/use-cases/uc-5', '439'),
        exact: true
      },
      {
        path: '/docs/1.0/use-cases/uc-9',
        component: ComponentCreator('/docs/1.0/use-cases/uc-9', '482'),
        exact: true
      },
      {
        path: '/docs/1.0/why-fdc3',
        component: ComponentCreator('/docs/1.0/why-fdc3', 'db4'),
        exact: true
      }
    ]
  },
  {
    path: '/docs/1.1',
    component: ComponentCreator('/docs/1.1', 'bb2'),
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
        component: ComponentCreator('/docs/1.1/api/overview', '987'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/AppIntent',
        component: ComponentCreator('/docs/1.1/api/ref/AppIntent', '080'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/AppMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/AppMetadata', '938'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/Channel',
        component: ComponentCreator('/docs/1.1/api/ref/Channel', 'cd0'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/ChannelError',
        component: ComponentCreator('/docs/1.1/api/ref/ChannelError', 'e77'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/Context',
        component: ComponentCreator('/docs/1.1/api/ref/Context', '623'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/ContextHandler',
        component: ComponentCreator('/docs/1.1/api/ref/ContextHandler', 'e77'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/DesktopAgent',
        component: ComponentCreator('/docs/1.1/api/ref/DesktopAgent', '359'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/DisplayMetadata', '588'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/IntentMetadata',
        component: ComponentCreator('/docs/1.1/api/ref/IntentMetadata', '336'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/IntentResolution',
        component: ComponentCreator('/docs/1.1/api/ref/IntentResolution', '013'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/Listener',
        component: ComponentCreator('/docs/1.1/api/ref/Listener', 'e83'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/OpenError',
        component: ComponentCreator('/docs/1.1/api/ref/OpenError', 'fc7'),
        exact: true
      },
      {
        path: '/docs/1.1/api/ref/ResolveError',
        component: ComponentCreator('/docs/1.1/api/ref/ResolveError', 'e9d'),
        exact: true
      },
      {
        path: '/docs/1.1/api/spec',
        component: ComponentCreator('/docs/1.1/api/spec', 'd76'),
        exact: true
      },
      {
        path: '/docs/1.1/app-directory/discovery',
        component: ComponentCreator('/docs/1.1/app-directory/discovery', '991'),
        exact: true
      },
      {
        path: '/docs/1.1/app-directory/overview',
        component: ComponentCreator('/docs/1.1/app-directory/overview', 'e6c'),
        exact: true
      },
      {
        path: '/docs/1.1/app-directory/spec',
        component: ComponentCreator('/docs/1.1/app-directory/spec', '128'),
        exact: true
      },
      {
        path: '/docs/1.1/app-directory/usage',
        component: ComponentCreator('/docs/1.1/app-directory/usage', '7ae'),
        exact: true
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
        component: ComponentCreator('/docs/1.1/context/overview', '2be'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Contact',
        component: ComponentCreator('/docs/1.1/context/ref/Contact', '613'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/ContactList',
        component: ComponentCreator('/docs/1.1/context/ref/ContactList', 'f3d'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Context',
        component: ComponentCreator('/docs/1.1/context/ref/Context', '816'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Country',
        component: ComponentCreator('/docs/1.1/context/ref/Country', '074'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Instrument',
        component: ComponentCreator('/docs/1.1/context/ref/Instrument', '44c'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/InstrumentList',
        component: ComponentCreator('/docs/1.1/context/ref/InstrumentList', '33f'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Organization',
        component: ComponentCreator('/docs/1.1/context/ref/Organization', '674'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Portfolio',
        component: ComponentCreator('/docs/1.1/context/ref/Portfolio', 'af6'),
        exact: true
      },
      {
        path: '/docs/1.1/context/ref/Position',
        component: ComponentCreator('/docs/1.1/context/ref/Position', 'adc'),
        exact: true
      },
      {
        path: '/docs/1.1/context/spec',
        component: ComponentCreator('/docs/1.1/context/spec', 'c81'),
        exact: true
      },
      {
        path: '/docs/1.1/fdc3-charter',
        component: ComponentCreator('/docs/1.1/fdc3-charter', 'ba2'),
        exact: true
      },
      {
        path: '/docs/1.1/fdc3-compliance',
        component: ComponentCreator('/docs/1.1/fdc3-compliance', 'c04'),
        exact: true
      },
      {
        path: '/docs/1.1/fdc3-intro',
        component: ComponentCreator('/docs/1.1/fdc3-intro', 'ecd'),
        exact: true
      },
      {
        path: '/docs/1.1/fdc3-standard',
        component: ComponentCreator('/docs/1.1/fdc3-standard', '594'),
        exact: true
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
        component: ComponentCreator('/docs/1.1/intents/overview', 'aa9'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/StartCall',
        component: ComponentCreator('/docs/1.1/intents/ref/StartCall', 'e60'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/StartChat',
        component: ComponentCreator('/docs/1.1/intents/ref/StartChat', 'dd3'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewAnalysis', '2bd'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/ViewChart',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewChart', '957'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/ViewContact',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewContact', '665'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewInstrument', 'c2f'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/ViewNews',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewNews', 'ccf'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/1.1/intents/ref/ViewQuote', 'a5f'),
        exact: true
      },
      {
        path: '/docs/1.1/intents/spec',
        component: ComponentCreator('/docs/1.1/intents/spec', '03f'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/overview',
        component: ComponentCreator('/docs/1.1/use-cases/overview', '50c'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-1',
        component: ComponentCreator('/docs/1.1/use-cases/uc-1', 'a7d'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-10',
        component: ComponentCreator('/docs/1.1/use-cases/uc-10', '3ab'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-13',
        component: ComponentCreator('/docs/1.1/use-cases/uc-13', '5a0'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-15',
        component: ComponentCreator('/docs/1.1/use-cases/uc-15', 'ace'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-16',
        component: ComponentCreator('/docs/1.1/use-cases/uc-16', '90c'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-17',
        component: ComponentCreator('/docs/1.1/use-cases/uc-17', 'ec5'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-2',
        component: ComponentCreator('/docs/1.1/use-cases/uc-2', 'd2a'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-3',
        component: ComponentCreator('/docs/1.1/use-cases/uc-3', '0ac'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-4',
        component: ComponentCreator('/docs/1.1/use-cases/uc-4', 'f70'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-5',
        component: ComponentCreator('/docs/1.1/use-cases/uc-5', '64c'),
        exact: true
      },
      {
        path: '/docs/1.1/use-cases/uc-9',
        component: ComponentCreator('/docs/1.1/use-cases/uc-9', '293'),
        exact: true
      },
      {
        path: '/docs/1.1/why-fdc3',
        component: ComponentCreator('/docs/1.1/why-fdc3', '8fe'),
        exact: true
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
    component: ComponentCreator('/docs', 'e13'),
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
        component: ComponentCreator('/docs/api/overview', '238'),
        exact: true
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
        component: ComponentCreator('/docs/api/ref/Channel', 'f65'),
        exact: true
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
        component: ComponentCreator('/docs/api/ref/DesktopAgent', 'c22'),
        exact: true
      },
      {
        path: '/docs/api/ref/DisplayMetadata',
        component: ComponentCreator('/docs/api/ref/DisplayMetadata', '463'),
        exact: true
      },
      {
        path: '/docs/api/ref/Errors',
        component: ComponentCreator('/docs/api/ref/Errors', '1d0'),
        exact: true
      },
      {
        path: '/docs/api/ref/Globals',
        component: ComponentCreator('/docs/api/ref/Globals', 'bac'),
        exact: true
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
        component: ComponentCreator('/docs/api/ref/Metadata', 'a2b'),
        exact: true
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
        component: ComponentCreator('/docs/api/ref/Types', '86c'),
        exact: true
      },
      {
        path: '/docs/api/spec',
        component: ComponentCreator('/docs/api/spec', '069'),
        exact: true
      },
      {
        path: '/docs/app-directory/discovery',
        component: ComponentCreator('/docs/app-directory/discovery', 'ba3'),
        exact: true
      },
      {
        path: '/docs/app-directory/overview',
        component: ComponentCreator('/docs/app-directory/overview', 'c8c'),
        exact: true
      },
      {
        path: '/docs/app-directory/spec',
        component: ComponentCreator('/docs/app-directory/spec', 'a9e'),
        exact: true
      },
      {
        path: '/docs/app-directory/usage',
        component: ComponentCreator('/docs/app-directory/usage', '095'),
        exact: true
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
        component: ComponentCreator('/docs/context/overview', '556'),
        exact: true
      },
      {
        path: '/docs/context/ref/Contact',
        component: ComponentCreator('/docs/context/ref/Contact', '5c0'),
        exact: true
      },
      {
        path: '/docs/context/ref/ContactList',
        component: ComponentCreator('/docs/context/ref/ContactList', 'a87'),
        exact: true
      },
      {
        path: '/docs/context/ref/Context',
        component: ComponentCreator('/docs/context/ref/Context', '3b3'),
        exact: true
      },
      {
        path: '/docs/context/ref/Country',
        component: ComponentCreator('/docs/context/ref/Country', 'b84'),
        exact: true
      },
      {
        path: '/docs/context/ref/Instrument',
        component: ComponentCreator('/docs/context/ref/Instrument', '515'),
        exact: true
      },
      {
        path: '/docs/context/ref/InstrumentList',
        component: ComponentCreator('/docs/context/ref/InstrumentList', '595'),
        exact: true
      },
      {
        path: '/docs/context/ref/Organization',
        component: ComponentCreator('/docs/context/ref/Organization', '7be'),
        exact: true
      },
      {
        path: '/docs/context/ref/Portfolio',
        component: ComponentCreator('/docs/context/ref/Portfolio', '5d0'),
        exact: true
      },
      {
        path: '/docs/context/ref/Position',
        component: ComponentCreator('/docs/context/ref/Position', 'ec5'),
        exact: true
      },
      {
        path: '/docs/context/spec',
        component: ComponentCreator('/docs/context/spec', '55e'),
        exact: true
      },
      {
        path: '/docs/fdc3-charter',
        component: ComponentCreator('/docs/fdc3-charter', '000'),
        exact: true
      },
      {
        path: '/docs/fdc3-compliance',
        component: ComponentCreator('/docs/fdc3-compliance', '4ed'),
        exact: true
      },
      {
        path: '/docs/fdc3-intro',
        component: ComponentCreator('/docs/fdc3-intro', 'c29'),
        exact: true
      },
      {
        path: '/docs/fdc3-standard',
        component: ComponentCreator('/docs/fdc3-standard', 'e24'),
        exact: true
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
        component: ComponentCreator('/docs/intents/overview', '590'),
        exact: true
      },
      {
        path: '/docs/intents/ref/StartCall',
        component: ComponentCreator('/docs/intents/ref/StartCall', 'b01'),
        exact: true
      },
      {
        path: '/docs/intents/ref/StartChat',
        component: ComponentCreator('/docs/intents/ref/StartChat', '91f'),
        exact: true
      },
      {
        path: '/docs/intents/ref/ViewAnalysis',
        component: ComponentCreator('/docs/intents/ref/ViewAnalysis', '8ab'),
        exact: true
      },
      {
        path: '/docs/intents/ref/ViewChart',
        component: ComponentCreator('/docs/intents/ref/ViewChart', 'e9d'),
        exact: true
      },
      {
        path: '/docs/intents/ref/ViewContact',
        component: ComponentCreator('/docs/intents/ref/ViewContact', 'ac9'),
        exact: true
      },
      {
        path: '/docs/intents/ref/ViewInstrument',
        component: ComponentCreator('/docs/intents/ref/ViewInstrument', 'dff'),
        exact: true
      },
      {
        path: '/docs/intents/ref/ViewNews',
        component: ComponentCreator('/docs/intents/ref/ViewNews', '6f2'),
        exact: true
      },
      {
        path: '/docs/intents/ref/ViewQuote',
        component: ComponentCreator('/docs/intents/ref/ViewQuote', '298'),
        exact: true
      },
      {
        path: '/docs/intents/spec',
        component: ComponentCreator('/docs/intents/spec', 'af0'),
        exact: true
      },
      {
        path: '/docs/supported-platforms',
        component: ComponentCreator('/docs/supported-platforms', 'cc9'),
        exact: true
      },
      {
        path: '/docs/use-cases/overview',
        component: ComponentCreator('/docs/use-cases/overview', '8a9'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-1',
        component: ComponentCreator('/docs/use-cases/uc-1', 'a9f'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-10',
        component: ComponentCreator('/docs/use-cases/uc-10', 'a5a'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-13',
        component: ComponentCreator('/docs/use-cases/uc-13', '998'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-15',
        component: ComponentCreator('/docs/use-cases/uc-15', '53b'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-16',
        component: ComponentCreator('/docs/use-cases/uc-16', 'fb0'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-17',
        component: ComponentCreator('/docs/use-cases/uc-17', '5af'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-2',
        component: ComponentCreator('/docs/use-cases/uc-2', '7cb'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-3',
        component: ComponentCreator('/docs/use-cases/uc-3', '3e5'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-4',
        component: ComponentCreator('/docs/use-cases/uc-4', 'c37'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-5',
        component: ComponentCreator('/docs/use-cases/uc-5', 'cc5'),
        exact: true
      },
      {
        path: '/docs/use-cases/uc-9',
        component: ComponentCreator('/docs/use-cases/uc-9', '928'),
        exact: true
      },
      {
        path: '/docs/why-fdc3',
        component: ComponentCreator('/docs/why-fdc3', '727'),
        exact: true
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
