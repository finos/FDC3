/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, action } from 'mobx';
import { nanoid } from 'nanoid';
import { getLogMessage } from '../fixtures/logMessages';
import snackbarStore from './SnackbarStore';

export type logMessagesName =
  | 'getFdc3'
  | 'getChannels'
  | 'getCurrentChannel'
  | 'joinUserChannel'
  | 'leaveChannel'
  | 'broadcast'
  | 'appBroadcast'
  | 'raiseIntent'
  | 'raiseIntentForContext'
  | 'addContextListener'
  | 'removeContextListener'
  | 'addIntentListener'
  | 'removeIntentListener'
  | 'receivedContextListener'
  | 'receivedIntentListener'
  | 'deleteExample'
  | 'saveExample'
  | 'copyToClipboard'
  | 'getOrCreateChannel'
  | 'createPrivateChannel'
  | 'receivedAppContextListener'
  | 'addAppContextListener'
  | 'removeAppChannelContextListener'
  | 'pcAddContextListener'
  | 'pcOnUnsubscribe'
  | 'pcOnDisconnect';

export type logMessagesType = 'error' | 'success' | 'warning' | 'info';

export interface LogItem {
  id: string;
  name: logMessagesName;
  type: logMessagesType;
  message: string;
  body?: string;
  variant?: 'code' | 'text';
}

interface LogItemCreator extends Omit<LogItem, 'message' | 'id'> {
  value?: string;
}

class SystemLogStore {
  logList: LogItem[] = [];

  constructor() {
    makeObservable(this, {
      logList: observable,
      addLog: action,
    });
  }

  addLog({ name, type, value, body, variant }: LogItemCreator) {
    const message = getLogMessage(name, type, value);
    snackbarStore.setSnackbar({
      message: message,
      type: type,
    });

    this.logList.push({ id: nanoid(), name, type, message, body, variant: variant ?? 'text' });
  }
}

const systemLogStore = new SystemLogStore();

export default systemLogStore;
