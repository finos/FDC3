import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { createAppChannelTests } from './fdc3.app-channels';
import { ChannelControl2_0 } from '../support/channels-support-2.0';
import { createUserChannelTests } from './fdc3.user-channels';
import { getAgent } from '@finos/fdc3';

const documentation = '\r\nDocumentation: ' + APIDocumentation2_0.desktopAgent + '\r\nCause:';

export default async () => {
  const fdc3 = await getAgent();
  const control = new ChannelControl2_0(fdc3);

  describe('channels', () => {
    createUserChannelTests(control, documentation, '2.0-');
    createAppChannelTests(control, documentation, '2.0-');
  });
};
