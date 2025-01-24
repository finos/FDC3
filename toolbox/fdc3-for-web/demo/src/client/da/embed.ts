import { io } from 'socket.io-client';
import { link, UI, UI_URLS } from './util';
import { APP_HELLO } from '../../message-types';
import { isWebConnectionProtocol1Hello } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

const appWindow = window.parent;

function getQueryVariable(variable: string): string {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }

  return '';
}

function getSource(): string {
  return getQueryVariable('instanceId');
}

function getDesktopAgentId(): string {
  return getQueryVariable('desktopAgentId');
}

function getUIKey(): UI {
  const ui = getQueryVariable('UI');
  return parseInt(ui) as UI;
}

const helloListener = (e: MessageEvent) => {
  const messageData = e.data;
  const eventSource = e.source;
  let eventSourceName;
  try {
    eventSourceName = (eventSource as Window)?.name;
  } catch (e: unknown) {
    eventSourceName = `{a cross-origin window} `;
  }
  if (!eventSourceName) {
    eventSourceName = '{no window name set} ';
  }

  if (isWebConnectionProtocol1Hello(messageData)) {
    console.debug(
      'Communication iframe adaptor received hello message from: ',
      eventSourceName,
      eventSource == appWindow ? '(parent window): ' : '(NOT parent win): ',
      messageData
    );

    window.removeEventListener('message', helloListener);

    const socket = io();
    const channel = new MessageChannel();
    const source = getSource();
    const desktopAgentUUID = getDesktopAgentId();

    socket.on('connect', () => {
      link(socket, channel, source);

      socket.emit(APP_HELLO, desktopAgentUUID, source);

      const ui = UI_URLS[getUIKey()];

      // send the other end of the channel to the app
      appWindow.postMessage(
        {
          type: 'WCP3Handshake',
          meta: {
            connectionAttemptUuid: messageData.meta.connectionAttemptUuid,
            timestamp: new Date(),
          },
          payload: {
            fdc3Version: '2.2',
            ...ui,
          },
        },
        '*',
        [channel.port1]
      );
    });
  }
};

window.addEventListener('message', helloListener);
