import {
  AppIntent,
  Channel,
  Context,
  ContextHandler,
  IntentResolution,
  Listener,
} from '.';

export const open: (name: string, context?: Context) => Promise<void> = (
  name,
  context
) => {
  return window.fdc3.open(name, context);
};

export const findIntent: (
  intent: string,
  context?: Context
) => Promise<AppIntent> = (intent, context) => {
  return window.fdc3.findIntent(intent, context);
};

export const findIntentsByContext: (
  context: Context
) => Promise<Array<AppIntent>> = context => {
  return window.fdc3.findIntentsByContext(context);
};

export const broadcast: (context: Context) => void = context => {
  window.fdc3.broadcast(context);
};

export const raiseIntent: (
  intent: string,
  context: Context,
  target?: string
) => Promise<IntentResolution> = (intent, context, target) => {
  return window.fdc3.raiseIntent(intent, context, target);
};

export const addIntentListener: (
  intent: string,
  handler: ContextHandler
) => Listener = (intent, handler) => {
  return window.fdc3.addIntentListener(intent, handler);
};

export const addContextListener: (
  contextTypeOrHandler: string | ContextHandler,
  handler?: ContextHandler
) => Listener = (a, b) => {
  if (typeof a !== 'function') {
    return window.fdc3.addContextListener(a as string, b as ContextHandler);
  } else {
    return window.fdc3.addContextListener(a as ContextHandler);
  }
};

export const getSystemChannels: () => Promise<Array<Channel>> = () => {
  return window.fdc3.getSystemChannels();
};

export const joinChannel: (channelId: string) => Promise<void> = channelId => {
  return window.fdc3.joinChannel(channelId);
};

export const getOrCreateChannel: (
  channelId: string
) => Promise<Channel> = channelId => {
  return window.fdc3.getOrCreateChannel(channelId);
};

export const getCurrentChannel: () => Promise<Channel> = () => {
  return window.fdc3.getCurrentChannel();
};
