/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { logMessagesName, logMessagesType } from '../store/SystemLogStore';

type LogMessages = Record<logMessagesName, Partial<Record<logMessagesType, string>>>;

export const getLogMessage = (name: logMessagesName, type: logMessagesType, value: string = ''): string => {
  const logMessages: LogMessages = {
    getFdc3: {
      error: `The FDC3 API is not ready${value ? ` (${value})` : ''}`,
    },
    getChannels: {
      success: `Retrieved User channels`,
      error: `Failed to retrieve User channels`,
    },
    getCurrentChannel: {
      success: `Retrieved current channel [${value}]`,
      error: `Failed to retrieve current channel`,
    },
    joinUserChannel: {
      success: `Joined the [${value}] channel`,
      error: `Failed to join the [${value}] channel`,
    },
    leaveChannel: {
      success: `Left the [${value}] channel`,
      error: `Failed to leave the [${value}] channel`,
      warning: `Not currently joined to a channel`,
    },
    broadcast: {
      success: 'Broadcast context',
      error: 'Failed to broadcast context:',
    },
    appBroadcast: {
      success: `Broadcast context to channel [${value}]: `,
      error: `Failed to broadcast context to channel [${value}]:`,
    },
    raiseIntent: {
      success: `Raised intent [${value}]`,
      error: `Failed to raise intent [${value}]`,
    },
    raiseIntentForContext: {
      success: `Raised intent for context`,
      error: `Failed to raise intent for context`,
    },
    addContextListener: {
      success: `A context listener for '[${value}]' has been added`,
      error: `Failed to add a context listener for '[${value}]'`,
    },
    removeContextListener: {
      success: `A context listener for '[${value}]' has been removed`,
      error: `Failed to remove a context listener for '[${value}]'`,
    },
    removeAppChannelContextListener: {
      success: `${value}`,
      error: `${value}`,
    },
    addIntentListener: {
      success: `An intent listener for '[${value}]' has been added`,
      error: `Failed to add an intent listener for '[${value}]'`,
    },
    removeIntentListener: {
      success: `An intent listener for '[${value}]' has been removed`,
      error: `Failed to remove an intent listener for '[${value}]'`,
    },
    receivedContextListener: {
      info: `Received context via '[${value}]' listener`,
      error: `Failed to receive context from '[${value}]' listener`,
    },
    receivedAppContextListener: {
      info: `${value}`,
      error: `${value}`,
    },
    addAppContextListener: {
      info: `${value}`,
      error: `${value}`,
    },
    receivedIntentListener: {
      info: `Received context via '[${value}]' listener.`,
      error: `Failed to receive context from '[${value}]' listener.`,
    },
    saveExample: {
      success: `Saved context example for '[${value}]'.`,
      error: `Failed to save context example.`,
    },
    deleteExample: {
      success: `Deleted context example for '[${value}]'.`,
      error: `Failed to delete context example.`,
    },
    copyToClipboard: {
      info: `${value} code snippet copied to clipboard`,
      error: `Failed to copy code ${value} snippet to clipboard.`,
    },
    getOrCreateChannel: {
      success: `Retrieved or created current app channel [${value}]`,
      error: `Failed to retrieve or create app channel ${value}.`,
    },
    createPrivateChannel: {
      success: `Created current private channel [${value}]`,
      error: `Failed to create private channel ${value}.`,
    },
    pcAddContextListener: {
      success: `${value}`,
      error: `${value}`,
    },
    pcOnUnsubscribe: {
      success: `${value}`,
      error: `${value}`,
    },
    pcOnDisconnect: {
      success: `${value}`,
      error: `${value}`,
    },
  };

  return logMessages[name][type] ?? (value != '' ? `${value}` : `Undefined log message ${name}.${type}`);
};
