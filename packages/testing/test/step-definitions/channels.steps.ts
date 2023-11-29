import { TestMessaging } from '../support/TestMessaging';
import { createDefaultChannels } from '../support/DefaultUserChannels';
import { BasicDesktopAgent } from 'da';
import { DefaultChannelSupport } from 'da';
import { DefaultIntentSupport } from 'da';
import { DefaultAppSupport } from 'da'
import { Given, World, setWorldConstructor } from '@cucumber/cucumber'

// class CustomWorld extends World {  
//   constructor(options: any) {
//     super(options)
//   }
// }

// setWorldConstructor(CustomWorld)

Given('A Basic API Setup', function() {
  this.messaging = new TestMessaging()
  this.defaultChannels = createDefaultChannels(this.messaging);

  this.desktopAgent = new BasicDesktopAgent(
      new DefaultChannelSupport(this.messaging, this.defaultChannels, null),
      new DefaultIntentSupport(),
      new DefaultAppSupport(),
      "2.0",
      "cucumber-provider"
  )
})