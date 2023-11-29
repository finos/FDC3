"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestMessaging_1 = require("../support/TestMessaging");
var DefaultUserChannels_1 = require("../support/DefaultUserChannels");
var da_1 = require("da");
var da_2 = require("da");
var da_3 = require("da");
var da_4 = require("da");
var cucumber_1 = require("@cucumber/cucumber");
// class CustomWorld extends World {  
//   constructor(options: any) {
//     super(options)
//   }
// }
// setWorldConstructor(CustomWorld)
(0, cucumber_1.Given)('A Basic API Setup', function () {
    this.messaging = new TestMessaging_1.TestMessaging();
    this.defaultChannels = (0, DefaultUserChannels_1.createDefaultChannels)(this.messaging);
    this.desktopAgent = new da_1.BasicDesktopAgent(new da_2.DefaultChannelSupport(this.messaging, this.defaultChannels, null), new da_3.DefaultIntentSupport(), new da_4.DefaultAppSupport(), "2.0", "cucumber-provider");
});
