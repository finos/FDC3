import { InstanceID } from '@finos/fdc3-web-impl';
import { Socket } from 'socket.io-client';
import { FDC3_APP_EVENT, FDC3_DA_EVENT } from '../../message-types';

export enum UI {
  DEFAULT,
  DEMO,
  LOCAL,
}

export const UI_URLS = {
  [UI.DEMO]: {
    intentResolverUrl: window.location.origin + '/static/da/intent-resolver.html',
    channelSelectorUrl: window.location.origin + '/static/da/channel-selector.html',
  },
  [UI.DEFAULT]: {
    intentResolverUrl: 'https://fdc3.finos.org/toolbox/fdc3-reference-ui/intent_resolver.html',
    channelSelectorUrl: 'https://fdc3.finos.org/toolbox/fdc3-reference-ui/channel_selector.html',
  },
  [UI.LOCAL]: {
    intentResolverUrl: 'http://localhost:4002/intent_resolver.html',
    channelSelectorUrl: 'http://localhost:4002/channel_selector.html',
  },
};

export function link(socket: Socket, channel: MessageChannel, source: InstanceID) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket.on(FDC3_DA_EVENT, (data: any) => {
    channel.port2.postMessage(data);
  });

  channel.port2.onmessage = function (event) {
    socket.emit(FDC3_APP_EVENT, event.data, source);
  };
}
