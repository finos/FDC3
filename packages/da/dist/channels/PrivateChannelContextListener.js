var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChannelContextListener } from "./ChannelContextListener";
var PrivateChannelContextListener = /** @class */ (function (_super) {
    __extends(PrivateChannelContextListener, _super);
    function PrivateChannelContextListener(messaging, channelId, contextType, action) {
        return _super.call(this, messaging, channelId, contextType, action, "PrivateChannel.broadcast") || this;
    }
    PrivateChannelContextListener.prototype.unsubscribe = function () {
        this.messaging.unregister(this.id);
        // message to say we've unsubscribed
        var message = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.channelId,
                contextType: this.contextType // ##1109 raised
            },
            type: "PrivateChannel.onUnsubscribe"
        };
        this.messaging.post(message);
    };
    return PrivateChannelContextListener;
}(ChannelContextListener));
export { PrivateChannelContextListener };
//# sourceMappingURL=PrivateChannelContextListener.js.map