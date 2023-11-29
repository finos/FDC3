"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDesktopAgent = void 0;
var fdc3_1 = require("@finos/fdc3");
var BroadcastListener = /** @class */ (function () {
    function BroadcastListener(type, handler) {
        this.type = type;
        this.handler = handler;
    }
    BroadcastListener.prototype.unsubscribe = function () {
        // does nothing yet.
    };
    BroadcastListener.prototype.handle = function (ctx, metadata) {
        if ((this.type == null) || (this.type == ctx.type)) {
            this.handler(ctx, metadata);
        }
    };
    return BroadcastListener;
}());
/**
 * Desktop Agent using DesktopAgentBridging protocol.
 * As before, just implementing broadcast, addContextListener and getInfo.
 * Abstract since the choice of transport is left to the implementer.
 */
var AbstractDesktopAgent = /** @class */ (function () {
    function AbstractDesktopAgent(details, options) {
        this.listeners = [];
        this.details = details;
        this.id = {
            appId: this.details.appId,
            instanceId: this.details.instanceId
        };
        this.options = options;
        var img = document.createElement("img");
        img.setAttribute("width", "70");
        img.setAttribute("height", "70");
        img.setAttribute("src", this.getIcon());
        img.setAttribute("style", "position: absolute; bottom: 0px; right: 0px;");
        document.body.appendChild(img);
    }
    AbstractDesktopAgent.prototype.getIcon = function () {
        return "";
    };
    AbstractDesktopAgent.prototype.postInternal = function (_m) {
        throw new Error("Abstract method");
    };
    AbstractDesktopAgent.prototype.createMeta = function () {
        return {
            requestUuid: crypto.randomUUID(),
            timestamp: new Date(),
            source: {
                appId: this.id.appId,
                instanceId: this.id.instanceId
            }
        };
    };
    AbstractDesktopAgent.prototype.broadcast = function (context) {
        var request = {
            meta: this.createMeta(),
            payload: {
                channelId: "MAIN",
                context: context
            },
            type: fdc3_1.RequestMessageType.BroadcastRequest
        };
        this.postInternal(request);
        return new Promise(function (_resolve) { return _resolve(); });
    };
    AbstractDesktopAgent.prototype.getInfo = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve({
                fdc3Version: "2.0",
                provider: _this.details.dummy,
                appMetadata: {
                    appId: _this.id.appId,
                    instanceId: _this.id.instanceId,
                },
                optionalFeatures: {
                    OriginatingAppMetadata: true,
                    UserChannelMembershipAPIs: false,
                }
            });
        });
    };
    AbstractDesktopAgent.prototype.addContextListener = function (contextType, handler) {
        var listo = this.listeners;
        return new Promise(function (resolve) {
            var theListener = new BroadcastListener(contextType, handler);
            listo.push(theListener);
            resolve(theListener);
        });
    };
    return AbstractDesktopAgent;
}());
exports.AbstractDesktopAgent = AbstractDesktopAgent;
