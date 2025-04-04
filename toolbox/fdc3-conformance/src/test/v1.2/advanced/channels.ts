import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import { ChannelControl1_2 } from '../support/channels-support-1.2';
import { createAppChannelTests } from '../../common/fdc3.app-channels';
import { createUserChannelTests } from '../../common/fdc3.user-channels';

const documentation = '\r\nDocumentation: ' + APIDocumentation1_2.desktopAgent + '\r\nCause:';
const control = new ChannelControl1_2();

export default () =>
  describe('channels', () => {
    createUserChannelTests(control, documentation, '');
    createAppChannelTests(control, documentation, '');
  });
