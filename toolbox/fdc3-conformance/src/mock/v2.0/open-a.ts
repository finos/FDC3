import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from '@finos/fdc3/dist/api/DesktopAgent';
import { sendContextToTests } from '../v2.0/mock-functions';
import { AppControlContext } from '../../context-types';
import { ControlContextType } from '../../test/v2.0/support/intent-support-2.0';

declare let fdc3: DesktopAgent;
onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();
  await fdc3.addContextListener('shouldNotReceiveThisContext', async context => {
    // broadcast that this app has received context
    if (context.type !== 'shouldNotReceiveThisContext') {
      await sendContextToTests({
        type: ControlContextType.contextReceived,
        errorMessage: `Listener received incorrect context type. Listener listening for 'shouldNotReceiveThisContext' type received '${context.type}' type`,
      } as AppControlContext);
    }
  });
});
