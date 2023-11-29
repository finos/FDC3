"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var connect_1 = require("../fdc3-1.2/connect");
var connect_2 = require("../fdc3-2.0/connect");
var electron_1 = require("electron");
var lib_1 = require("../lib/lib");
(0, connect_1.connect)(electron_1.ipcRenderer, lib_1.sendMessage);
(0, connect_2.connect)(electron_1.ipcRenderer, lib_1.sendMessage);
var DesktopAgent = (0, api_1.createAPI)(lib_1.sendMessage, electron_1.ipcRenderer);
/* expose the fdc3 api across the context isolation divide...*/
electron_1.contextBridge.exposeInMainWorld('fdc3', DesktopAgent);
