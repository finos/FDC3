"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMessaging = void 0;
var TestMessaging = /** @class */ (function () {
    function TestMessaging() {
        this.allPosts = [];
        this.listeners = new Map();
    }
    TestMessaging.prototype.getSource = function () {
        return {
            appId: "SomeDummyApp",
            instanceId: "some.dummy.instance"
        };
    };
    TestMessaging.prototype.createUUID = function () {
        return crypto.randomUUID();
    };
    TestMessaging.prototype.post = function (message) {
        this.allPosts.push(message);
        return Promise.resolve();
    };
    TestMessaging.prototype.register = function (filter, action) {
        var id = this.createUUID();
        this.listeners.set(id, {
            filter: filter,
            action: action
        });
        return id;
    };
    TestMessaging.prototype.unregister = function (id) {
        this.listeners.delete(id);
    };
    TestMessaging.prototype.createMeta = function () {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource()
        };
    };
    return TestMessaging;
}());
exports.TestMessaging = TestMessaging;
