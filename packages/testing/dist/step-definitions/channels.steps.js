"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cucumber_1 = require("@cucumber/cucumber");
(0, cucumber_1.Given)('{string} pipes context to {string}', function (contextHandlerName, field) {
    var _this = this;
    this[field] = [];
    this[contextHandlerName] = function (context) {
        _this[field].push(context);
    };
});
(0, cucumber_1.When)('messaging receives a {string} with payload:', function (type, docString) {
    var message = {
        meta: this.messaging.createMeta(),
        payload: JSON.parse(docString),
        type: type
    };
    this.log("Sending: ".concat(JSON.stringify(message)));
    this.messaging.receive(message, this.log);
});
//# sourceMappingURL=channels.steps.js.map