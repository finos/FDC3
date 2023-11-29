"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelContextListener = void 0;
var DefaultContextListener_1 = require("../listeners/DefaultContextListener");
var ChannelContextListener = /** @class */ (function (_super) {
    __extends(ChannelContextListener, _super);
    function ChannelContextListener(messaging, channelId, contextType, action, type) {
        if (type === void 0) { type = "broadcastRequest"; }
        var _this = this;
        var filter = function (m) {
            var _a;
            return (m.type == type)
                && (m.payload.channelId == _this.channelId)
                && ((((_a = m.payload.context) === null || _a === void 0 ? void 0 : _a.type) == _this.contextType) || (_this.contextType == null));
        };
        _this = _super.call(this, messaging, filter, action) || this;
        _this.channelId = channelId;
        _this.contextType = contextType;
        return _this;
    }
    ChannelContextListener.prototype.unsubscribe = function () {
        this.messaging.unregister(this.id);
    };
    /**
     * This is used for user channels when changing to a new channel
     */
    ChannelContextListener.prototype.updateUnderlyingChannel = function (id, latestContextMap) {
        var _this = this;
        this.channelId = id;
        latestContextMap.forEach(function (v, k) {
            if ((_this.contextType == null) || (_this.contextType == k)) {
                _this.action(v);
            }
        });
    };
    return ChannelContextListener;
}(DefaultContextListener_1.DefaultContextListener));
exports.ChannelContextListener = ChannelContextListener;
