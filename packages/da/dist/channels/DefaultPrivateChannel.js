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
import { DefaultChannel } from "./DefaultChannel";
import { PrivateChannelEventListener } from "./PrivateChannelEventListener";
import { PrivateChannelContextListener } from "./PrivateChannelContextListener";
var DefaultPrivateChannel = /** @class */ (function (_super) {
    __extends(DefaultPrivateChannel, _super);
    function DefaultPrivateChannel(messaging, id) {
        return _super.call(this, messaging, id, "private") || this;
    }
    DefaultPrivateChannel.prototype.broadcast = function (context) {
        var message = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
                context: context
            },
            type: "PrivateChannel.broadcast"
        };
        return this.messaging.post(message);
    };
    DefaultPrivateChannel.prototype.notifyEventListenerAdded = function (t) {
        var message = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
                listenerType: t
            },
            type: "PrivateChannel.eventListenerAdded"
        };
        this.messaging.post(message);
    };
    DefaultPrivateChannel.prototype.onAddContextListener = function (handler) {
        var l = new PrivateChannelEventListener(this.messaging, this.id, "onAddContextListener", function (m) { return handler(m.payload.contextType); });
        this.listeners.push(l);
        this.notifyEventListenerAdded("onAddContextListener");
        return l;
    };
    DefaultPrivateChannel.prototype.onUnsubscribe = function (handler) {
        var l = new PrivateChannelEventListener(this.messaging, this.id, "onUnsubscribe", function (m) { return handler(m.payload.contextType); });
        this.listeners.push(l);
        this.notifyEventListenerAdded("onUnsubscribe");
        return l;
    };
    DefaultPrivateChannel.prototype.onDisconnect = function (handler) {
        var l = new PrivateChannelEventListener(this.messaging, this.id, "onDisconnect", function () { return handler(); });
        this.listeners.push(l);
        this.notifyEventListenerAdded("onDisconnect");
        return l;
    };
    DefaultPrivateChannel.prototype.disconnect = function () {
        // unsubscribe all existing listeners
        this.listeners.forEach(function (l) { return l.unsubscribe(); });
        // disconnect.
        var disconnectMessage = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
            },
            type: "PrivateChannel.onDisconnect"
        };
        this.messaging.post(disconnectMessage);
    };
    DefaultPrivateChannel.prototype.addContextListenerInner = function (contextType, theHandler) {
        var listener = new PrivateChannelContextListener(this.messaging, this.id, contextType, theHandler);
        this.listeners.push(listener);
        return Promise.resolve(listener);
    };
    return DefaultPrivateChannel;
}(DefaultChannel));
export { DefaultPrivateChannel };
//# sourceMappingURL=DefaultPrivateChannel.js.map