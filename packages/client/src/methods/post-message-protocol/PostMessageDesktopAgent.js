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
exports.PostMessageDesktopAgent = void 0;
var BridgingTypes_1 = require("../../BridgingTypes");
var AbstractDesktopAgent_1 = require("../../../../packages/client/src/AbstractDesktopAgent");
/**
 * Desktop Agent implemented over post-message protocol, using DesktopAgentBridging.
 * As before, just implementing broadcast, addContextListener and getInfo.
 */
var PostMessageDesktopAgent = /** @class */ (function (_super) {
    __extends(PostMessageDesktopAgent, _super);
    function PostMessageDesktopAgent(details, options) {
        var _this = _super.call(this, details, options) || this;
        _this.origin = details.origin;
        // set up the post message listener for events coming from the server
        window.addEventListener("message", function (event) {
            var data = event.data;
            if (data.type == BridgingTypes_1.RequestMessageType.BroadcastRequest) {
                var typedData = data;
                var meta_1 = typedData.meta;
                var payload = typedData.payload;
                var context_1 = payload.context;
                _this.listeners.forEach(function (l) { return l.handle(context_1, meta_1); });
            }
        });
        return _this;
    }
    PostMessageDesktopAgent.prototype.getIcon = function () {
        return "/static/da/noun-mailbox-6010513.png";
    };
    PostMessageDesktopAgent.prototype.postInternal = function (m) {
        this.options.frame.postMessage(m, this.origin);
    };
    return PostMessageDesktopAgent;
}(AbstractDesktopAgent_1.AbstractDesktopAgent));
exports.PostMessageDesktopAgent = PostMessageDesktopAgent;
