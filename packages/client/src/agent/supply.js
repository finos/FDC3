"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supply = void 0;
var src_1 = require("../../../packages/common/src");
/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the desktop agent
 */
var supply = function (checker, detailsResolvers) {
    function createResponseMessage(source, method, detailsResolver) {
        return {
            type: src_1.FDC3_API_RESPONSE_MESSAGE_TYPE,
            method: method,
            details: detailsResolver(source)
        };
    }
    window.addEventListener("message", function (event) {
        console.log("Received: " + JSON.stringify(event));
        var data = event.data;
        if (data.type == src_1.FDC3_API_REQUEST_MESSAGE_TYPE) {
            var origin_1 = event.origin;
            var source = event.source;
            if (checker(source)) {
                console.log("API Request Origin:  ".concat(origin_1));
                var methods = event.data.methods;
                for (var i = 0; i < methods.length; i++) {
                    var currentMethod = methods[i];
                    var detailsResolver = detailsResolvers[currentMethod];
                    if (detailsResolver) {
                        source.postMessage(createResponseMessage(source, currentMethod, detailsResolver), origin_1);
                        return;
                    }
                }
            }
        }
    });
};
exports.supply = supply;
