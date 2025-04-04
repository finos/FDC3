import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { createAppChannelTests } from '../../common/fdc3.app-channels';
import { ChannelControl2_0 } from '../support/channels-support-2.0';
import { createUserChannelTests } from '../../common/fdc3.user-channels';

const documentation = '\r\nDocumentation: ' + APIDocumentation2_0.desktopAgent + '\r\nCause:';
const control = new ChannelControl2_0();

export default () =>
  describe('channels', () => {
    createUserChannelTests(control, documentation, '2.0-');
    createAppChannelTests(control, documentation, '2.0-');
  });
