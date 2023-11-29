"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PostMessageDesktopAgent_1 = require("./PostMessageDesktopAgent");
var method = function (r, options) {
    return new Promise(function (resolve, _reject) {
        // nasty bit of casting to avoid the problem we've only implemented 3 methods.
        resolve(new PostMessageDesktopAgent_1.PostMessageDesktopAgent(r.details, options));
    });
};
exports.default = method;
