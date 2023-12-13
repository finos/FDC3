"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMessaging = void 0;
const uuid_1 = require("uuid");
class TestMessaging {
    constructor() {
        this.allPosts = [];
        this.listeners = new Map();
    }
    getSource() {
        return {
            appId: "SomeDummyApp",
            instanceId: "some.dummy.instance"
        };
    }
    createUUID() {
        return (0, uuid_1.v4)();
    }
    post(message) {
        this.allPosts.push(message);
        return Promise.resolve();
    }
    register(filter, action) {
        const id = this.createUUID();
        this.listeners.set(id, {
            filter,
            action
        });
        return id;
    }
    unregister(id) {
        this.listeners.delete(id);
    }
    createMeta() {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource()
        };
    }
    receive(m, log) {
        this.listeners.forEach((v, k) => {
            if (v.filter(m)) {
                log("Processing in " + k);
                v.action(m);
            }
            else {
                log("Ignoring in " + k);
            }
        });
    }
    exchange(_message, _expectedTypeName) {
        throw new Error("not yet implemented");
    }
}
exports.TestMessaging = TestMessaging;
//# sourceMappingURL=TestMessaging.js.map