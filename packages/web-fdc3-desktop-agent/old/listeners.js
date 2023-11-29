"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoidListenerItem = exports.createContextTypeListenerItem = exports.disconnectListeners = exports.unsubscribeListeners = exports.addContextListeners = exports.DisconnectListener = exports.UnsubscribeListener = exports.AddContextListener = void 0;
var topics_1 = require("/@main/handlers/fdc3/2.0/topics");
/**
 * Listeners for Private Channel methods. onDisconnect, onUnsubscribe, onAddContextListener
 */
var AddContextListener = /** @class */ (function () {
    function AddContextListener(sendMessage, listenerId) {
        var _this = this;
        this.id = listenerId;
        this.unsubscribe = function () {
            exports.addContextListeners.delete(_this.id);
            sendMessage(topics_1.FDC3_2_0_TOPICS.DROP_ONADDCONTEXT_LISTENER, {
                listenerId: _this.id,
            });
        };
    }
    return AddContextListener;
}());
exports.AddContextListener = AddContextListener;
var UnsubscribeListener = /** @class */ (function () {
    function UnsubscribeListener(sendMessage, listenerId) {
        var _this = this;
        this.id = listenerId;
        this.unsubscribe = function () {
            exports.unsubscribeListeners.delete(_this.id);
            sendMessage(topics_1.FDC3_2_0_TOPICS.DROP_ONUNSUBSCRIBE_LISTENER, {
                listenerId: _this.id,
            });
        };
    }
    return UnsubscribeListener;
}());
exports.UnsubscribeListener = UnsubscribeListener;
var DisconnectListener = /** @class */ (function () {
    function DisconnectListener(sendMessage, listenerId) {
        var _this = this;
        this.id = listenerId;
        this.unsubscribe = function () {
            exports.disconnectListeners.delete(_this.id);
            sendMessage(topics_1.FDC3_2_0_TOPICS.DROP_ONDISCONNECT_LISTENER, {
                listenerId: _this.id,
            });
        };
    }
    return DisconnectListener;
}());
exports.DisconnectListener = DisconnectListener;
//map of listeners for when a contextListener is added to a private channel
exports.addContextListeners = new Map();
//map of listeners for unsubscribing on a private channel
exports.unsubscribeListeners = new Map();
//map of listeners for disconnecting on a private channel
exports.disconnectListeners = new Map();
var createContextTypeListenerItem = function (id, handler, contextType) {
    var listener = {
        id: id,
        handler: handler,
        contextType: contextType,
    };
    return listener;
};
exports.createContextTypeListenerItem = createContextTypeListenerItem;
var createVoidListenerItem = function (id, handler) {
    var listener = {
        id: id,
        handler: handler,
    };
    return listener;
};
exports.createVoidListenerItem = createVoidListenerItem;
