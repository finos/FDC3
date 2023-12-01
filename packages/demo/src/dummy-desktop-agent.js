"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supply_1 = require("../../../src/lib/agent/supply");
var BridgingTypes_1 = require("../lib/BridgingTypes");
var Approach;
(function (Approach) {
    Approach[Approach["Tab"] = 0] = "Tab";
    Approach[Approach["Frame"] = 1] = "Frame";
    Approach[Approach["Nested"] = 2] = "Nested";
})(Approach || (Approach = {}));
window.addEventListener("load", function () {
    var _a, _b, _c;
    var currentInstance = 0;
    var currentApiInstance = 0;
    var instances = [];
    function getApproach() {
        var cb = document.getElementById("opener");
        var val = cb.value;
        var out = Approach[val]; //Works with --noImplicitAny
        return out;
    }
    function openFrame(url) {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow;
    }
    function openTab(url) {
        return window.open(url, "_blank");
    }
    function openNested(url) {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "nested.html?url=" + url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow;
    }
    function open(url) {
        var approach = getApproach();
        switch (approach) {
            case Approach.Tab:
                return openTab(url);
            case Approach.Nested:
                return openNested(url);
            case Approach.Frame:
                return openFrame(url);
        }
        throw new Error("unsupported");
    }
    function launch(url, appId) {
        var w = open(url);
        var instance = currentInstance++;
        w.name = "App" + instance;
        instances.push({
            appId: appId,
            instanceId: "" + instance,
            window: w,
            url: w.location.href
        });
    }
    // for a given window, allows us to determine which app it is (if any)
    var appChecker = function (o) { return instances.find(function (i) { return i.window == o; }) != undefined; };
    var jsInject = function (o) {
        var appIdentifier = instances.find(function (i) { return i.window == o; });
        return {
            url: "/src/demo/implementation.ts",
            apiId: currentApiInstance++,
            apikey: "Abc",
            appId: appIdentifier.appId,
            instanceId: appIdentifier.instanceId
        };
    };
    var postMessageProtocol = function (o) {
        var appIdentifier = instances.find(function (i) { return i.window == o; });
        return {
            apiId: currentApiInstance++,
            appId: appIdentifier.appId,
            instanceId: appIdentifier.instanceId,
            provider: "Dummy",
            origin: window.origin
        };
    };
    // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
    (0, supply_1.supply)(appChecker, {
        "js-inject": jsInject,
        "post-message-protocol": postMessageProtocol
    });
    // hook up the buttons
    (_a = document.getElementById("app1")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return launch("/static/app1/index.html", "1"); });
    (_b = document.getElementById("app2")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return launch("http://robs-pro:8080/static/app2/index.html", "2"); });
    (_c = document.getElementById("app3")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () { return launch("http://localhost:8080/static/app3/index.html", "3"); });
    // implementation of broadcast, desktop-agent side (post-message-protocol version)
    window.addEventListener("message", function (event) {
        var data = event.data;
        if (data.type == BridgingTypes_1.RequestMessageType.BroadcastRequest) {
            var origin_1 = event.origin;
            var source = event.source;
            console.log("".concat(BridgingTypes_1.RequestMessageType.BroadcastRequest, " Origin:  ").concat(origin_1, " Source: ").concat(source, " From ").concat(JSON.stringify(data.from)));
            if (appChecker(source)) {
                instances
                    .forEach(function (i) {
                    i.window.postMessage(data, "*");
                });
            }
        }
    });
});
