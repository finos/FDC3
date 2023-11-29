import { TestMessaging } from '../support/TestMessaging';
import { createDefaultChannels } from '../support/DefaultUserChannels';
// import { BasicDesktopAgent } from '../../src/BasicDesktopAgent';
// import { DefaultChannelSupport } from '../../src/channels/DefaultChannelSupport';
// import { DefaultIntentSupport } from '../../src/intents/DefaultIntentSupport';
// import { DefaultAppSupport } from '../../src/apps/DefaultAppSupport'
import { Given } from '@cucumber/cucumber'
//import { binding } from '@lynxwall/cucumber-tsflow'

// @binding() 
// class ChannelSteps {

//   private messaging: TestMessaging
//   private defaultChannels : StatefulChannel[] = []
//   private desktopAgent : DesktopAgent = null;

  Given('A Basic API Setup', function() {
    this.messaging = new TestMessaging()
    this.defaultChannels = createDefaultChannels(this.messaging);

    // this.desktopAgent = new BasicDesktopAgent(
    //     new DefaultChannelSupport(this.messaging, this.defaultChannels, null),
    //     new DefaultIntentSupport(),
    //     new DefaultAppSupport(),
    //     "2.0",
    //     "cucumber-provider"
    // )
  })