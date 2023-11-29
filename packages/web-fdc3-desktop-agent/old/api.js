"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPI = void 0;
var api_1 = require("../fdc3-1.2/api");
var AbstractDesktopAgentsail_1 = require("./AbstractDesktopAgentsail");
function createAPI(sendMessage, ipc) {
    var out1_2 = (0, api_1.createAPI)(sendMessage, ipc);
    var out2_0 = (0, AbstractDesktopAgentsail_1.createDesktopAgentInstance)(sendMessage, '2.0', out1_2);
    return out2_0;
}
exports.createAPI = createAPI;
