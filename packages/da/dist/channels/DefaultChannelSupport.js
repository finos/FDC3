import { ChannelError } from "@finos/fdc3";
import { DefaultPrivateChannel } from "./DefaultPrivateChannel";
import { DefaultChannel } from "./DefaultChannel";
import { ChannelContextListener } from "./ChannelContextListener";
var DefaultChannelSupport = /** @class */ (function () {
    function DefaultChannelSupport(messaging, userChannelState, initialChannelId) {
        var _a;
        this.userChannelListeners = [];
        this.messaging = messaging;
        this.userChannelState = userChannelState;
        this.userChannel = (_a = userChannelState.find(function (c) { return c.id == initialChannelId; })) !== null && _a !== void 0 ? _a : null;
    }
    DefaultChannelSupport.prototype.hasUserChannelMembershipAPIs = function () {
        return true;
    };
    DefaultChannelSupport.prototype.getUserChannel = function () {
        return Promise.resolve(this.userChannel);
    };
    DefaultChannelSupport.prototype.getUserChannels = function () {
        return Promise.resolve(this.userChannelState);
    };
    DefaultChannelSupport.prototype.getDisplayMetadata = function (_id) {
        return {};
    };
    DefaultChannelSupport.prototype.getOrCreate = function (id) {
        var out = new DefaultChannel(this.messaging, id, "app", this.getDisplayMetadata(id));
        return Promise.resolve(out);
    };
    DefaultChannelSupport.prototype.createPrivateChannel = function () {
        var out = new DefaultPrivateChannel(this.messaging, this.messaging.createUUID());
        return Promise.resolve(out);
    };
    DefaultChannelSupport.prototype.leaveUserChannel = function () {
        this.userChannel = null;
        this.userChannelListeners.forEach(function (l) { return l.updateUnderlyingChannel(null, new Map()); });
        return Promise.resolve();
    };
    DefaultChannelSupport.prototype.joinUserChannel = function (id) {
        var _a;
        if (((_a = this.userChannel) === null || _a === void 0 ? void 0 : _a.id) != id) {
            var newUserChannel_1 = this.userChannelState.find(function (c) { return c.id == id; });
            if (newUserChannel_1) {
                this.userChannel = newUserChannel_1;
                this.userChannelListeners.forEach(function (l) { return l.updateUnderlyingChannel(newUserChannel_1.id, newUserChannel_1.getState()); });
            }
            else {
                throw new Error(ChannelError.NoChannelFound);
            }
        }
        return Promise.resolve();
    };
    DefaultChannelSupport.prototype.addContextListener = function (handler, type) {
        var _a;
        var uc = this.userChannel;
        var listener = new ChannelContextListener(this.messaging, (_a = uc === null || uc === void 0 ? void 0 : uc.id) !== null && _a !== void 0 ? _a : null, type, handler);
        this.userChannelListeners.push(listener);
        if (uc) {
            listener.updateUnderlyingChannel(uc.id, uc.getState());
        }
        return Promise.resolve(listener);
    };
    return DefaultChannelSupport;
}());
export { DefaultChannelSupport };
//# sourceMappingURL=DefaultChannelSupport.js.map