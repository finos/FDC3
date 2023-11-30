"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TestMessaging_1 = require("../support/TestMessaging");
var DefaultUserChannels_1 = require("../support/DefaultUserChannels");
var da_1 = require("da");
var da_2 = require("da");
var da_3 = require("da");
var da_4 = require("da");
var cucumber_1 = require("@cucumber/cucumber");
var expect_1 = __importDefault(require("expect"));
var matching_1 = require("../support/matching");
(0, cucumber_1.Given)('A Basic API Setup', function () {
    this.messaging = new TestMessaging_1.TestMessaging();
    this.defaultChannels = (0, DefaultUserChannels_1.createDefaultChannels)(this.messaging);
    this.desktopAgent = new da_1.BasicDesktopAgent(new da_2.DefaultChannelSupport(this.messaging, this.defaultChannels, null), new da_3.DefaultIntentSupport(), new da_4.DefaultAppSupport(), "2.0", "cucumber-provider");
    this.result = null;
});
(0, cucumber_1.Given)('{string} pipes context to the result', function (contextHandlerName) {
    var _this = this;
    this[contextHandlerName] = function (context) {
        if (!Array.isArray(_this.result)) {
            _this.result = [];
        }
        _this.result.push(context);
    };
});
(0, cucumber_1.When)('I call the API {string}', function (fnName) {
    return __awaiter(this, void 0, void 0, function () {
        var fn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = this.desktopAgent[fnName];
                    return [4 /*yield*/, fn.call(this.desktopAgent)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        this.result = result;
                    }
                    return [2 /*return*/];
            }
        });
    });
});
(0, cucumber_1.When)('I call the API {string} with parameter {string}', function (fnName, param) {
    return __awaiter(this, void 0, void 0, function () {
        var fn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = this.desktopAgent[fnName];
                    return [4 /*yield*/, fn.call(this.desktopAgent, (0, matching_1.handleResolve)(param, this))];
                case 1:
                    result = _a.sent();
                    if (result) {
                        this.result = result;
                    }
                    return [2 /*return*/];
            }
        });
    });
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
(0, cucumber_1.When)('I call the API {string} with parameters {string} and {string}', function (fnName, param1, param2) {
    return __awaiter(this, void 0, void 0, function () {
        var fn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = this.desktopAgent[fnName];
                    return [4 /*yield*/, fn.call(this.desktopAgent, (0, matching_1.handleResolve)(param1, this), (0, matching_1.handleResolve)(param2, this))];
                case 1:
                    result = _a.sent();
                    if (result) {
                        this.result = result;
                    }
                    return [2 /*return*/];
            }
        });
    });
});
(0, cucumber_1.Then)('the result is an array of objects with the following contents', function (params) {
    var _this = this;
    var table = params.rawTable;
    var headers = table.splice(0, 1)[0];
    var rowCount = table.length;
    this.log("headers ".concat(JSON.stringify(headers), " body ").concat(JSON.stringify(table), " rows ").concat(rowCount));
    var resultCopy = JSON.parse(JSON.stringify(this.result));
    this.log("result ".concat(JSON.stringify(resultCopy), " length ").concat(resultCopy.length));
    (0, expect_1.default)(resultCopy).toHaveLength(rowCount);
    resultCopy = resultCopy.filter(function (rr) {
        var matchingRow = (0, matching_1.indexOf)(table, headers, rr);
        if (matchingRow != -1) {
            return false;
        }
        else {
            _this.log("Couldn't match row: ".concat(JSON.stringify(rr)));
            return true;
        }
    });
    (0, expect_1.default)(resultCopy).toHaveLength(0);
});
(0, cucumber_1.Then)('the result is an object with the following contents', function (params) {
    var table = params.rawTable;
    var headers = table.splice(0, 1)[0];
    var rowCount = table.length;
    this.log("headers ".concat(JSON.stringify(headers), " body ").concat(JSON.stringify(table), " rows ").concat(rowCount));
    (0, expect_1.default)((0, matching_1.doesRowMatch)(table[0], headers, this.result)).toBeTruthy();
});
(0, cucumber_1.Then)('the result is null', function () {
    (0, expect_1.default)(this.result).toBeNull();
});
//# sourceMappingURL=channels.steps.js.map