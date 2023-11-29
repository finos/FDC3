"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIntentSupport = void 0;
var DefaultIntentSupport = /** @class */ (function () {
    function DefaultIntentSupport() {
    }
    DefaultIntentSupport.prototype.findIntent = function (_intent, _context, _resultType) {
        throw new Error("Method not implemented.");
    };
    DefaultIntentSupport.prototype.findIntentsByContext = function (_context) {
        throw new Error("Method not implemented.");
    };
    DefaultIntentSupport.prototype.raiseIntent = function (_intent, _context, _app) {
        throw new Error("Method not implemented.");
    };
    DefaultIntentSupport.prototype.raiseIntentForContext = function (_context, _app) {
        throw new Error("Method not implemented.");
    };
    DefaultIntentSupport.prototype.addIntentListener = function (_intent, _handler) {
        throw new Error("Method not implemented.");
    };
    return DefaultIntentSupport;
}());
exports.DefaultIntentSupport = DefaultIntentSupport;
