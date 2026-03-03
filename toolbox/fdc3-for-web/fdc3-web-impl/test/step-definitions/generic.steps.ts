import { Given, When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { TestServerContext } from '../support/TestServerContext.js';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server.js';
import { BasicDirectory } from '../../src/directory/BasicDirectory.js';
import { ChannelType } from '../../src/handlers/BroadcastHandler.js';
import { Context } from '@finos/fdc3-context';
import { AppIdentifier } from '@finos/fdc3-standard';
import { setupGenericSteps } from '@finos/testing';
import path from 'path';

export const APP_FIELD = 'apps';

export const contextMap: Record<string, Context> = {
  'fdc3.instrument': {
    type: 'fdc3.instrument',
    name: 'Apple',
    id: {
      ticker: 'AAPL',
    },
  },
  'fdc3.country': {
    type: 'fdc3.country',
    name: 'Sweden',
    id: {
      COUNTRY_ISOALPHA2: 'SE',
      COUNTRY_ISOALPHA3: 'SWE',
    },
  },
  'fdc3.unsupported': {
    type: 'fdc3.unsupported',
    bogus: true,
  },
  'fdc3.book': {
    type: 'fdc3.book',
    author: 'Greg Wallace',
    title: 'Cooking with Greg',
    id: {
      ISBN: '1234',
    },
  },
  'fdc3.magazine': {
    type: 'fdc3.magazine',
    title: 'The Economist',
    price: 3.99,
    id: {
      ISSN: '1234',
    },
  },
  'fdc3.periodical': {
    type: 'fdc3.periodical',
    title: 'The American Poetry Review',
    price: 13.99,
    id: {
      ISSN: '45643',
    },
  },
  'fdc3.product': {
    type: 'fdc3.product',
    title: 'Current bun',
    id: {
      productId: 'cb1',
    },
  },
};

function defaultChannels() {
  return [
    {
      id: 'one',
      type: ChannelType.user,
      context: [],
      displayMetadata: {
        name: 'One Channel',
        color: 'orange',
      },
    },
    {
      id: 'two',
      type: ChannelType.user,
      context: [],
      displayMetadata: {
        name: 'Two Channel',
        color: 'skyblue',
      },
    },
    {
      id: 'three',
      type: ChannelType.user,
      context: [],
      displayMetadata: {
        name: 'Three Channel',
        color: 'ochre',
      },
    },
  ];
}

export function createMeta(cw: CustomWorld, appStr: string) {
  let app: AppIdentifier;
  if (appStr.includes('/')) {
    const [appId, instanceId] = appStr.split('/');
    app = { appId, instanceId };
  } else {
    app = { appId: appStr };
  }

  return {
    requestUuid: cw.sc.createUUID(),
    timestamp: new Date(),
    source: app,
  };
}

// Register shared generic steps from @finos/testing
const schemaBasePath = path.join(import.meta.dirname, '../../../../../packages/');
setupGenericSteps(schemaBasePath);

Given('A newly instantiated FDC3 Server', (world: CustomWorld) => {
  const apps = world.props[APP_FIELD] ?? [];
  const d = new BasicDirectory(apps);
  world.sc = new TestServerContext(world);
  world.server = new DefaultFDC3Server(world.sc, d, defaultChannels(), false, 2000, 2000);
});

Given('A newly instantiated FDC3 Server with heartbeat checking', (world: CustomWorld) => {
  const apps = world.props[APP_FIELD] ?? [];
  const d = new BasicDirectory(apps);

  world.sc = new TestServerContext(world);
  world.server = new DefaultFDC3Server(world.sc, d, defaultChannels(), true, 2000, 2000);
});

When('I shutdown the server', (world: CustomWorld) => {
  world.server.shutdown();
});
