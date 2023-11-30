"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultChannels = void 0;
var da_1 = require("da");
function createDefaultChannels(messaging) {
    return [
        new da_1.DefaultChannel(messaging, "one", "user", { color: "red" }),
        new da_1.DefaultChannel(messaging, "two", "user", { color: "green" }),
        new da_1.DefaultChannel(messaging, "three", "user", { color: "blue" })
    ];
}
exports.createDefaultChannels = createDefaultChannels;
//# sourceMappingURL=DefaultUserChannels.js.map