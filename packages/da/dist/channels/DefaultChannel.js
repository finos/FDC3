"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultChannel = void 0;
var ChannelContextListener_1 = require("./ChannelContextListener");
var DefaultChannel = /** @class */ (function () {
    function DefaultChannel(messaging, id, type, displayMetadata) {
        this.latestContextMap = new Map();
        this.latestContext = null;
        this.listeners = [];
        this.messaging = messaging;
        this.id = id;
        this.type = type;
        this.displayMetadata = displayMetadata;
    }
    DefaultChannel.prototype.broadcast = function (context) {
        var message = {
            meta: {
                requestUuid: this.messaging.createUUID(),
                timestamp: new Date(),
                source: this.messaging.getSource()
            },
            payload: {
                channelId: this.id,
                context: context
            },
            type: "broadcastRequest"
        };
        return this.messaging.post(message);
    };
    DefaultChannel.prototype.getCurrentContext = function (contextType) {
        var _a;
        if (contextType) {
            return Promise.resolve((_a = this.latestContextMap.get(contextType)) !== null && _a !== void 0 ? _a : null);
        }
        else {
            return Promise.resolve(this.latestContext);
        }
    };
    DefaultChannel.prototype.addContextListener = function (contextType, handler) {
        var theContextType;
        var theHandler;
        if (contextType == null) {
            theContextType = null;
            theHandler = handler;
        }
        else if (typeof contextType === 'string') {
            theContextType = contextType;
            theHandler = handler;
        }
        else {
            // deprecated one-arg version
            theContextType = null;
            theHandler = contextType;
        }
        return this.addContextListenerInner(theContextType, theHandler);
    };
    DefaultChannel.prototype.addContextListenerInner = function (contextType, theHandler) {
        var listener = new ChannelContextListener_1.ChannelContextListener(this.messaging, this.id, contextType, theHandler);
        this.listeners.push(listener);
        return Promise.resolve(listener);
    };
    DefaultChannel.prototype.getState = function () {
        return this.latestContextMap;
    };
    return DefaultChannel;
}());
exports.DefaultChannel = DefaultChannel;
