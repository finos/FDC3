"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This loads the script using an import
 */
var method = function (data, options) {
    return Promise.resolve("".concat(/* @vite-ignore */ data.details.url)).then(function (s) { return require(s); }).then(function (ns) {
        var init = ns.default;
        var da = init(data.details, options);
        return da;
    });
};
exports.default = method;
