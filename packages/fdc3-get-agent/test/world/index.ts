import { setWorldConstructor } from '@cucumber/cucumber';
import { PropsWorld } from '@finos/testing';
import { MockFDC3Server } from '../support/MockFDC3Server';

export class CustomWorld extends PropsWorld {
  mockFDC3Server: MockFDC3Server | null = null;

  debugLogs: boolean = false;
}

setWorldConstructor(CustomWorld);
