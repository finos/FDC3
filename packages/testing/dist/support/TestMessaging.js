import { v4 as uuidv4 } from 'uuid';
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
        return uuidv4();
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
    TestMessaging.prototype.receive = function (m, log) {
        this.listeners.forEach(function (v, k) {
            if (v.filter(m)) {
                log("Processing in " + k);
                v.action(m);
            }
            else {
                log("Ignoring in " + k);
            }
        });
    };
    return TestMessaging;
}());
export { TestMessaging };
//# sourceMappingURL=TestMessaging.js.map