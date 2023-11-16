import { createAPI } from './api';
import { connect as connect_1_2 } from '../fdc3-1.2/connect';
import { connect as connect_2_0 } from '../fdc3-2.0/connect';

import { contextBridge, ipcRenderer } from 'electron';
import { sendMessage } from '../lib/lib';

connect_1_2(ipcRenderer, sendMessage);
connect_2_0(ipcRenderer, sendMessage);
const DesktopAgent = createAPI(sendMessage, ipcRenderer);
/* expose the fdc3 api across the context isolation divide...*/
contextBridge.exposeInMainWorld('fdc3', DesktopAgent);
