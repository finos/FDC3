"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.DEFAULT_OPTIONS = exports.DEFAULT_METHODS = exports.POST_MESSAGE_PROTOCOL = exports.JS_INJECT = void 0;
/*
 * this part is the different ways that we can use to talk with the
 * desktop agent once we have a reference to it.
 */
exports.JS_INJECT = "js-inject";
exports.POST_MESSAGE_PROTOCOL = "post-message-protocol";
/**
 * This is in preference order, chosen by the app.
 */
exports.DEFAULT_METHODS = [exports.POST_MESSAGE_PROTOCOL, exports.JS_INJECT];
exports.DEFAULT_OPTIONS = {
    setWindowGlobal: false,
    fireFdc3Ready: false,
    methods: exports.DEFAULT_METHODS,
    strategies: [postMessage, electronEvent],
    frame: (_a = window.opener) !== null && _a !== void 0 ? _a : window.parent
};
/**
 * This return an FDC3 API.  Called by Apps.
 */
function load(optionsOverride) {
    if (optionsOverride === void 0) { optionsOverride = exports.DEFAULT_OPTIONS; }
    var options = __assign(__assign({}, exports.DEFAULT_OPTIONS), optionsOverride);
    function handleGenericOptions(da) {
        if ((options.setWindowGlobal) && (window.fdc3 == null)) {
            window.fdc3 = da;
        }
        return da;
    }
    var strategies = options.strategies.map(function (s) { return s(options); });
    return Promise.any(strategies)
        .then(function (da) { return handleGenericOptions(da); });
}
exports.load = load;
