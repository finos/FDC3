"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fdc3_1 = require("@finos/fdc3");
/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
var loader = function (_options) {
    var out = new Promise(function (resolve) {
        (0, fdc3_1.fdc3Ready)().then(function () {
            resolve(window.fdc3);
        });
    });
    return out;
};
exports.default = loader;
