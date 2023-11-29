"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultContextListener = void 0;
var DefaultContextListener = /** @class */ (function () {
    function DefaultContextListener(messaging, filter, action) {
        this.messaging = messaging;
        this.id = this.messaging.register(filter, function (m) {
            var _a;
            var context = (_a = m === null || m === void 0 ? void 0 : m.payload) === null || _a === void 0 ? void 0 : _a.context;
            action(context);
        });
        this.filter = filter;
        this.action = action;
    }
    DefaultContextListener.prototype.unsubscribe = function () {
        this.messaging.unregister(this.id);
    };
    return DefaultContextListener;
}());
exports.DefaultContextListener = DefaultContextListener;
