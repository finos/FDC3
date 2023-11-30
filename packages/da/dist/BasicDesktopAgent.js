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
exports.BasicDesktopAgent = void 0;
/**
 * This splits out the functionality of the desktop agent into
 * app, channels and intents concerns.
 */
var BasicDesktopAgent = /** @class */ (function () {
    function BasicDesktopAgent(channels, intents, apps, fdc3Version, provider) {
        this.intents = intents;
        this.channels = channels;
        this.apps = apps;
        this.fdc3Version = fdc3Version;
        this.provider = provider;
    }
    BasicDesktopAgent.prototype.getInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var am;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apps.getThisAppMetadata()];
                    case 1:
                        am = _a.sent();
                        return [2 /*return*/, {
                                fdc3Version: this.fdc3Version,
                                provider: this.provider,
                                appMetadata: am,
                                optionalFeatures: {
                                    OriginatingAppMetadata: this.apps.hasOriginatingAppMetadata(),
                                    UserChannelMembershipAPIs: this.channels.hasUserChannelMembershipAPIs(),
                                    DesktopAgentBridging: this.apps.hasDesktopAgentBridging()
                                }
                            }];
                }
            });
        });
    };
    BasicDesktopAgent.prototype.broadcast = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channels.getUserChannel()];
                    case 1:
                        channel = _a.sent();
                        if (channel) {
                            return [2 /*return*/, channel.broadcast(context)];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BasicDesktopAgent.prototype.addContextListener = function (context, handler) {
        return __awaiter(this, void 0, void 0, function () {
            var theHandler, theContextType;
            return __generator(this, function (_a) {
                theHandler = handler ? handler : context;
                theContextType = context && handler ? context : null;
                return [2 /*return*/, this.channels.addContextListener(theHandler, theContextType)];
            });
        });
    };
    BasicDesktopAgent.prototype.getUserChannels = function () {
        return this.channels.getUserChannels();
    };
    BasicDesktopAgent.prototype.getSystemChannels = function () {
        return this.channels.getUserChannels();
    };
    BasicDesktopAgent.prototype.getOrCreateChannel = function (channelId) {
        return this.channels.getOrCreate(channelId);
    };
    BasicDesktopAgent.prototype.createPrivateChannel = function () {
        return this.channels.createPrivateChannel();
    };
    BasicDesktopAgent.prototype.leaveCurrentChannel = function () {
        return this.channels.leaveUserChannel();
    };
    BasicDesktopAgent.prototype.joinUserChannel = function (channelId) {
        return this.channels.joinUserChannel(channelId);
    };
    BasicDesktopAgent.prototype.joinChannel = function (channelId) {
        return this.channels.joinUserChannel(channelId);
    };
    BasicDesktopAgent.prototype.getCurrentChannel = function () {
        return this.channels.getUserChannel();
    };
    BasicDesktopAgent.prototype.findIntent = function (intent, context, resultType) {
        return this.intents.findIntent(intent, context, resultType);
    };
    BasicDesktopAgent.prototype.findIntentsByContext = function (context) {
        return this.intents.findIntentsByContext(context);
    };
    BasicDesktopAgent.prototype.ensureAppId = function (app) {
        if (typeof app === "string") {
            return {
                appId: app
            };
        }
        else if (app === null || app === void 0 ? void 0 : app.appId) {
            return app;
        }
        else {
            return undefined;
        }
    };
    BasicDesktopAgent.prototype.raiseIntent = function (intent, context, app) {
        return this.intents.raiseIntent(intent, context, this.ensureAppId(app));
    };
    BasicDesktopAgent.prototype.addIntentListener = function (intent, handler) {
        return this.intents.addIntentListener(intent, handler);
    };
    BasicDesktopAgent.prototype.raiseIntentForContext = function (context, app) {
        return this.intents.raiseIntentForContext(context, this.ensureAppId(app));
    };
    BasicDesktopAgent.prototype.open = function (app, context) {
        return this.apps.open(this.ensureAppId(app), context);
    };
    BasicDesktopAgent.prototype.findInstances = function (app) {
        return this.apps.findInstances(app);
    };
    BasicDesktopAgent.prototype.getAppMetadata = function (app) {
        return this.apps.getAppMetadata(app);
    };
    return BasicDesktopAgent;
}());
exports.BasicDesktopAgent = BasicDesktopAgent;
//# sourceMappingURL=BasicDesktopAgent.js.map