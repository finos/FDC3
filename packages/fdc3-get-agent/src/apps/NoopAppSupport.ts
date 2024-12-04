import { AppIdentifier, AppMetadata } from '@kite9/fdc3-standard';
import { Messaging } from '@kite9/fdc3-agent-proxy';
import { DefaultAppSupport } from '@kite9/fdc3-agent-proxy';

export class NoopAppSupport extends DefaultAppSupport {
  constructor(messaging: Messaging) {
    super(messaging);
  }

  async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    return {
      appId: app.appId,
    };
  }
}
