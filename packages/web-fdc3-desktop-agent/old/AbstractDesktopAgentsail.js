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
exports.createDesktopAgentInstance = void 0;
var topics_1 = require("/@main/handlers/fdc3/2.0/topics");
var lib_1 = require("../lib/lib");
var channel_1 = require("./channel");
var FDC3Errors_1 = require("/@main/types/FDC3Errors");
var connect_1 = require("./connect");
function convertAppIntent(sai) {
    var apps = sai.apps.map(function (m) {
        var _a, _b, _c;
        return {
            appId: (_a = m.appId) !== null && _a !== void 0 ? _a : 'unknown',
            name: (_c = (_b = m.name) !== null && _b !== void 0 ? _b : m.appId) !== null && _c !== void 0 ? _c : 'unknown',
            version: m.version,
            title: m.title,
            tooltip: m.tooltip,
            description: m.description,
            icons: m.icons,
            images: m.screenshots,
        };
    });
    return {
        intent: sai.intent,
        apps: apps,
    };
}
function setupResolverListener(resolve, version, intent) {
    var intentTimeout = -1;
    //listen for resolve intent
    document.addEventListener(topics_1.FDC3_2_0_TOPICS.RESOLVE_INTENT, function (event) {
        var _a;
        var cEvent = event;
        console.log('***** intent resolution received', cEvent.detail);
        if (intentTimeout) {
            window.clearTimeout(intentTimeout);
        }
        resolve({
            version: version,
            intent: intent,
            source: ((_a = cEvent.detail) === null || _a === void 0 ? void 0 : _a.source) || { name: 'unknown' },
            getResult: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            },
        });
    }, { once: true });
}
function createDesktopAgentInstance(sendMessage, version, base) {
    var _this = this;
    var addIntentListener1_2 = base.addIntentListener;
    var addContextListener1_2 = base.addContextListener;
    var getUserChannels2_0 = function () { return __awaiter(_this, void 0, void 0, function () {
        var r, channels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.GET_USER_CHANNELS, {})];
                case 1:
                    r = _a.sent();
                    console.log('result', r);
                    channels = r.map(function (c) {
                        return (0, channel_1.createChannelObject)(sendMessage, c.id, 'user', c.displayMetadata || { name: c.id });
                    });
                    return [2 /*return*/, channels];
            }
        });
    }); };
    return __assign(__assign({}, base), { getInfo: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, sendMessage(topics_1.FDC3_2_0_TOPICS.GET_APP_ID, {
                        // no data
                        }).then(function (details) {
                            console.log('GetInfo returned ' + JSON.stringify(details));
                            return {
                                fdc3Version: version,
                                provider: 'fdc3-sail',
                                optionalFeatures: {
                                    OriginatingAppMetadata: true,
                                    UserChannelMembershipAPIs: true,
                                },
                                appMetadata: details.appMetadata,
                            };
                        })];
                });
            });
        }, open: function (app, context) {
            return sendMessage(topics_1.FDC3_2_0_TOPICS.OPEN, {
                target: (0, lib_1.convertTarget)(app),
                context: context,
            }).then(function (details) {
                return {
                    appId: details.appId,
                    instanceId: details.instanceId,
                };
            });
        }, findInstances: function (app) {
            return __awaiter(this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.FIND_INSTANCES, {
                                app: app,
                            })];
                        case 1:
                            data = (_a.sent());
                            result = data.map(function (e) {
                                return {
                                    appId: e.appId,
                                    instanceId: e.instanceId,
                                };
                            });
                            return [2 /*return*/, result];
                    }
                });
            });
        }, getUserChannels: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, getUserChannels2_0()];
                });
            });
        }, getSystemChannels: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, getUserChannels2_0()];
                });
            });
        }, getOrCreateChannel: function (channelId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.GET_OR_CREATE_CHANNEL, { channel: channelId })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, (0, channel_1.createChannelObject)(sendMessage, result.id, result.type, result.displayMetadata || { name: result.id })];
                    }
                });
            });
        }, createPrivateChannel: function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.CREATE_PRIVATE_CHANNEL, {})];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, (0, channel_1.createPrivateChannelObject)(sendMessage, result.id)];
                    }
                });
            });
        }, leaveCurrentChannel: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.LEAVE_CURRENT_CHANNEL, {})];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }, joinUserChannel: function (channel) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.JOIN_CHANNEL, {
                                channel: channel,
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }, getCurrentChannel: function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.GET_CURRENT_CHANNEL, {})];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result == null
                                    ? null
                                    : (0, channel_1.createChannelObject)(sendMessage, result.id, result.type, result.displayMetadata || { name: result.id })];
                    }
                });
            });
        }, getAppMetadata: function (app) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.GET_APP_METADATA, {
                                app: app,
                            })];
                        case 1:
                            result = _a.sent();
                            if (app.instanceId) {
                                result = __assign(__assign({}, result), { instanceId: app.instanceId });
                            }
                            console.log('Returned metadata: ' + JSON.stringify(result));
                            return [2 /*return*/, result];
                    }
                });
            });
        }, findIntent: function (intent, context, resultType) {
            return __awaiter(this, void 0, void 0, function () {
                var sai;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.FIND_INTENT, {
                                intent: intent,
                                context: context,
                                resultType: resultType,
                            })];
                        case 1:
                            sai = _a.sent();
                            return [2 /*return*/, convertAppIntent(sai)];
                    }
                });
            });
        }, findIntentsByContext: function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var appIntents;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.FIND_INTENTS_BY_CONTEXT, {
                                context: context,
                            })];
                        case 1:
                            appIntents = _a.sent();
                            return [2 /*return*/, appIntents.map(convertAppIntent)];
                    }
                });
            });
        }, broadcast: function (context) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.BROADCAST, { context: context })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }, raiseIntent: function (intent, context, app) {
            return new Promise(function (resolve, reject) {
                var target = (0, lib_1.convertTarget)(app);
                console.log('Converted', target);
                sendMessage(topics_1.FDC3_2_0_TOPICS.RAISE_INTENT, {
                    intent: intent,
                    context: context,
                    target: target,
                    fdc3Version: version,
                }).then(function (result) {
                    console.log('***** got intent resolution ', result);
                    if (result.openingResolver) {
                        setupResolverListener(resolve, version, result.intent);
                    }
                    else {
                        var resultPromise_1 = (0, connect_1.createResultPromise)(result.result);
                        var out = {
                            source: {
                                appId: result.source.appId,
                                instanceId: result.source.instanceId,
                            },
                            intent: result.intent,
                            getResult: function () {
                                return resultPromise_1;
                            },
                            version: result.version,
                        };
                        console.log('RaiseIntent Returning ', out);
                        resolve(out);
                    }
                }, function (error) {
                    reject(error);
                });
                //timeout the intent resolution
                window.setTimeout(function () {
                    reject(new Error(FDC3Errors_1.ResolverTimeout));
                }, lib_1.INTENT_TIMEOUT);
            });
        }, raiseIntentForContext: function (context, app) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sendMessage(topics_1.FDC3_2_0_TOPICS.RAISE_INTENT_FOR_CONTEXT, {
                                context: context,
                                target: (0, lib_1.convertTarget)(app),
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }, addIntentListener: function (intent, handler) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, addIntentListener1_2(intent, handler)];
                });
            });
        }, addContextListener: function (context, handler) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, addContextListener1_2(context, handler)];
                });
            });
        } });
}
exports.createDesktopAgentInstance = createDesktopAgentInstance;
