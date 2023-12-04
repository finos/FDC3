import { Given, When } from '@cucumber/cucumber';
import { handleResolve } from '../support/matching';
var contextMap = {
    "fdc3.instrument": {
        "type": "fdc3.instrument",
        "name": "Apple",
        "id": {
            "ticker": "AAPL"
        }
    }
};
Given('{string} is a {string} broadcastRequest message on channel {string}', function (field, type, channel) {
    var message = {
        meta: this.messaging.createMeta(),
        payload: {
            "channelId": channel,
            "context": contextMap[type]
        },
        type: "broadcastRequest"
    };
    this[field] = message;
});
Given('{string} pipes context to {string}', function (contextHandlerName, field) {
    var _this = this;
    this[field] = [];
    this[contextHandlerName] = function (context) {
        _this[field].push(context);
    };
});
When('messaging receives a {string} with payload:', function (type, docString) {
    var message = {
        meta: this.messaging.createMeta(),
        payload: JSON.parse(docString),
        type: type
    };
    this.log("Sending: ".concat(JSON.stringify(message)));
    this.messaging.receive(message, this.log);
});
When('messaging receives {string}', function (field) {
    var message = handleResolve(field, this);
    this.log("Sending: ".concat(JSON.stringify(message)));
    this.messaging.receive(message, this.log);
});
//# sourceMappingURL=channels.steps.js.map