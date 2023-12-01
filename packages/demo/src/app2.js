"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var load_1 = require("../../client/src/load");
var src_1 = require("../../common/src");
/**
 * This demonstrates using the API via a promise
 */
(0, load_1.load)({ "methods": [src_1.JS_INJECT] }).then(function (fdc3) {
    console.log("in promise");
    var log = document.getElementById("log");
    var msg = document.createElement("p");
    msg.textContent = "FDC3 Loaded: " + JSON.stringify(fdc3.getInfo());
    log === null || log === void 0 ? void 0 : log.appendChild(msg);
    fdc3.addContextListener(null, function (context) {
        var msg = document.createElement("p");
        msg.textContent = "Received: " + JSON.stringify(context);
        log === null || log === void 0 ? void 0 : log.appendChild(msg);
    });
});
