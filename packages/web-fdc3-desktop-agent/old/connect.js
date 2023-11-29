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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResultPromise = exports.connect = void 0;
var channel_1 = require("./channel");
var topics_1 = require("/@main/handlers/fdc3/2.0/topics");
var listeners_1 = require("./listeners");
var topics_2 = require("/@main/handlers/fdc3/topics");
var resultPromises = new Map();
var pendingResults = new Map();
function convertToIntentResult(ird, sendMessage) {
    var data;
    if (ird.type == 'channel') {
        // convert to channel
        var scd = ird.result;
        data = (0, channel_1.createChannelObject)(sendMessage, scd.id, scd.type, undefined);
    }
    else if (ird.type == 'context') {
        data = ird.result;
    }
    else {
        data = undefined;
    }
    return data;
}
var connect = function (ipc, sendMessage) {
    /**
     * listen for incomming results
     */
    ipc.on(topics_2.FDC3_TOPICS_RESULT_DELIVERY, function (event, a) { return __awaiter(void 0, void 0, void 0, function () {
        var ird, id, promise, intentResult;
        return __generator(this, function (_a) {
            ird = a;
            id = ird.resultId;
            console.log('RESULT DELIVERY');
            promise = resultPromises.get(id);
            intentResult = convertToIntentResult(ird, sendMessage);
            if (promise) {
                promise(intentResult);
                resultPromises.delete(id);
            }
            else {
                pendingResults.set(id, intentResult);
            }
            return [2 /*return*/];
        });
    }); });
    ipc.on(topics_1.FDC3_2_0_TOPICS.ADD_CONTEXT_LISTENER, function (event, a) { return __awaiter(void 0, void 0, void 0, function () {
        var ctli;
        return __generator(this, function (_a) {
            ctli = listeners_1.addContextListeners.get(a.listenerId);
            if (ctli) {
                ctli.handler(a.contextType);
            }
            return [2 /*return*/];
        });
    }); });
    ipc.on(topics_1.FDC3_2_0_TOPICS.PRIVATE_CHANNEL_DISCONNECT, function (event, a) { return __awaiter(void 0, void 0, void 0, function () {
        var dl;
        return __generator(this, function (_a) {
            dl = listeners_1.disconnectListeners.get(a.listenerId);
            if (dl) {
                dl.handler();
            }
            return [2 /*return*/];
        });
    }); });
    ipc.on(topics_1.FDC3_2_0_TOPICS.PRIVATE_CHANNEL_UNSUBSCRIBE, function (event, a) { return __awaiter(void 0, void 0, void 0, function () {
        var ul;
        return __generator(this, function (_a) {
            ul = listeners_1.unsubscribeListeners.get(a.listenerId);
            if (ul) {
                ul.handler();
            }
            return [2 /*return*/];
        });
    }); });
};
exports.connect = connect;
function createResultPromise(id) {
    console.log('Created result promise ', id);
    if (pendingResults.has(id)) {
        // result already here
        var pr = pendingResults.get(id);
        pendingResults.delete(id);
        return Promise.resolve(pr);
    }
    else {
        // waiting for result
        return new Promise(function (resolve) {
            resultPromises.set(id, resolve);
        });
    }
}
exports.createResultPromise = createResultPromise;
