"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../../packages/common/src");
var js_inject_1 = require("../methods/js-inject");
var post_message_protocol_1 = require("../methods/post-message-protocol");
var METHOD_MAP = {
    "js-inject": js_inject_1.default,
    "post-message-protocol": post_message_protocol_1.default
};
var loader = function (options) {
    function handleOptions(da) {
        return da;
    }
    var out = new Promise(function (resolve, reject) {
        // setup listener for message and retrieve JS URL from it
        window.addEventListener("message", function (event) {
            var data = event.data;
            if (data.type == src_1.FDC3_API_RESPONSE_MESSAGE_TYPE) {
                var method = METHOD_MAP[data.method];
                method(data, options)
                    .then(function (da) { return handleOptions(da); })
                    .then(function (da) { return resolve(da); });
            }
            else {
                reject("Incorrect API Response Message");
            }
        }, { once: true });
    });
    var da = options.frame;
    if (da != null) {
        var requestMessage = {
            type: src_1.FDC3_API_REQUEST_MESSAGE_TYPE,
            methods: options.methods
        };
        da.postMessage(requestMessage, "*");
    }
    return out;
};
exports.default = loader;
