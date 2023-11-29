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
exports.createPrivateChannelObject = exports.createChannelObject = void 0;
var channel_1 = require("../fdc3-1.2/channel");
var lib_1 = require("../lib/lib");
var topics_1 = require("/@main/handlers/fdc3/2.0/topics");
var listeners_1 = require("../fdc3-1.2/listeners");
var FDC3Errors_1 = require("/@main/types/FDC3Errors");
var listeners_2 = require("./listeners");
var topics_2 = require("/@main/handlers/fdc3/topics");
/**
 * This overrides the one from the 1.2 implementation as the addContextListener returns a promise in this version
 * and broadcast returns a void promise.
 */
var createChannelObject = function (sendMessage, id, type, displayMetadata) {
    if (type !== 'user' && type !== 'app' && type !== 'private') {
        throw new Error(FDC3Errors_1.CreationFailed);
    }
    else {
        var orig = (0, channel_1.createChannelObject)(sendMessage, id, type, displayMetadata);
        var limitedType = type;
        var channel_2 = __assign(__assign({}, orig), { type: limitedType, broadcast: function (context) {
                return sendMessage(topics_1.FDC3_2_0_TOPICS.BROADCAST, {
                    context: context,
                    channel: channel_2.id,
                });
            }, addContextListener: function (contextType, handler) {
                return __awaiter(this, void 0, void 0, function () {
                    var thisListener, thisContextType, listenerId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                thisListener = handler
                                    ? handler
                                    : contextType;
                                thisContextType = handler ? contextType : undefined;
                                listenerId = (0, lib_1.guid)();
                                (0, listeners_1.getContextListeners)().set(listenerId, (0, listeners_1.createListenerItem)(listenerId, thisListener, thisContextType));
                                return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.ADD_CONTEXT_LISTENER, {
                                        listenerId: listenerId,
                                        channel: channel_2.id,
                                        contextType: thisContextType,
                                    }).then(function () {
                                        return new listeners_1.FDC3Listener(topics_2.FDC3_TOPICS_CONTEXT, listenerId, sendMessage);
                                    })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            } });
        if (type == 'private') {
            channel_2 = privateChannelAugmentation(channel_2, sendMessage, id);
        }
        return channel_2;
    }
};
exports.createChannelObject = createChannelObject;
function privateChannelAugmentation(channel, sendMessage, id) {
    return __assign(__assign({}, channel), { onAddContextListener: function (handler) {
            var listenerId = (0, lib_1.guid)();
            listeners_2.addContextListeners.set(listenerId, (0, listeners_2.createContextTypeListenerItem)(listenerId, handler));
            sendMessage(topics_1.FDC3_2_0_TOPICS.ADD_ONADDCONTEXT_LISTENER, {
                listenerId: listenerId,
                channel: id,
            });
            return new listeners_2.AddContextListener(sendMessage, listenerId);
        }, onDisconnect: function (handler) {
            var listenerId = (0, lib_1.guid)();
            listeners_2.disconnectListeners.set(listenerId, (0, listeners_2.createVoidListenerItem)(listenerId, handler));
            sendMessage(topics_1.FDC3_2_0_TOPICS.ADD_ONDISCONNECT_LISTENER, {
                listenerId: listenerId,
                channel: id,
            });
            return new listeners_2.DisconnectListener(sendMessage, listenerId);
        }, onUnsubscribe: function (handler) {
            var listenerId = (0, lib_1.guid)();
            listeners_2.unsubscribeListeners.set(listenerId, (0, listeners_2.createContextTypeListenerItem)(listenerId, handler));
            sendMessage(topics_1.FDC3_2_0_TOPICS.ADD_ONUNSUBSCRIBE_LISTENER, {
                listenerId: listenerId,
                channel: id,
            });
            return new listeners_2.UnsubscribeListener(sendMessage, listenerId);
        }, disconnect: function () {
            sendMessage(topics_1.FDC3_2_0_TOPICS.PRIVATE_CHANNEL_DISCONNECT, {
                channel: id,
            });
        } });
}
var createPrivateChannelObject = function (sendMessage, id) {
    var privateChannel = (0, exports.createChannelObject)(sendMessage, id, 'private', {});
    return privateChannel;
};
exports.createPrivateChannelObject = createPrivateChannelObject;
