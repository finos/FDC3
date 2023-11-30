"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateChannelEventListener = void 0;
var PrivateChannelEventListener = /** @class */ (function () {
    function PrivateChannelEventListener(messaging, channelId, messageTypeFilter, action) {
        this.messaging = messaging;
        this.channelId = channelId;
        var filter = function (m) {
            var _a;
            return (m.type == "PrivateChannel." + messageTypeFilter)
                && (channelId == ((_a = m.payload) === null || _a === void 0 ? void 0 : _a.channel));
        };
        this.listenerId = this.messaging.register(filter, action);
        this.messageTypeFilter = messageTypeFilter;
    }
    PrivateChannelEventListener.prototype.unsubscribe = function () {
        this.messaging.unregister(this.listenerId);
        // message to say we've unsubscribed
        var message = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.channelId,
                listenerType: this.messageTypeFilter
            },
            type: "PrivateChannel.eventListenerRemoved"
        };
        this.messaging.post(message);
    };
    return PrivateChannelEventListener;
}());
exports.PrivateChannelEventListener = PrivateChannelEventListener;
//# sourceMappingURL=PrivateChannelEventListener.js.map