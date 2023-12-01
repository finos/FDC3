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
var AbstractDesktopAgent_1 = require("../../client/src/AbstractDesktopAgent");
var BridgingTypes_1 = require("../lib/BridgingTypes");
/**
 * This dummy desktop agent just implements broadcast and addContextListener for the
 * purposes of the demo.  Communication is also via post-message.
 */
var DummyDesktopAgent = /** @class */ (function (_super) {
    __extends(DummyDesktopAgent, _super);
    function DummyDesktopAgent(details, options) {
        var _this = _super.call(this, details, options) || this;
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
    DummyDesktopAgent.prototype.postInternal = function (m) {
        // this DA is a bit sloppy about frame origin, whereas the other one isn't.
        this.options.frame.postMessage(m, "*");
    };
    DummyDesktopAgent.prototype.getIcon = function () {
        return "https://cosaic.io/wp-content/uploads/2022/09/fdc3-check.png";
    };
    return DummyDesktopAgent;
}(AbstractDesktopAgent_1.AbstractDesktopAgent));
var init = function (details, options) {
    return new DummyDesktopAgent(details, options);
};
exports.default = init;
