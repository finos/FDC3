import { AppIdentifier, Context } from '@finos/fdc3';

export interface OpenControl {
  //test control
  openMockApp(targetApp: AppIdentifier, context?: Context): void;
  closeMockApp(testId: string): Promise<void>;

  // helper method
  createTargetAppIdentifier(appId?: string): AppIdentifier;

  //listening
  contextReceiver(contextType: string, expectNotToReceiveContext?: boolean): Promise<Context>;
  addListenerAndFailIfReceived(): Promise<void>;

  //validation
  confirmAppNotFoundErrorReceived(exception: unknown): void;
  validateReceivedContext(contextReceiver: Context, expectedContextType: string): Promise<void>;
  expectAppTimeoutErrorOnOpen(appId: AppIdentifier): Promise<void>;
}

export const openApp = {
  a: {
    name: 'IntentAppA',
    id: 'IntentAppAId',
  },
  b: {
    name: 'MockApp',
    id: 'MockAppId',
  },
  c: {
    name: 'IntentAppC',
    id: 'IntentAppCId',
  },
  d: {
    id: 'OpenAppAId',
  },
  e: {
    id: 'OpenAppBId',
  },
  f: {
    name: 'IntentAppB',
    id: 'IntentAppBId',
  },
};

export type OpenCommonConfig = {
  fdc3Version: string;
  prefix: string;
  target: string;
  targetMultiple: string;
};
