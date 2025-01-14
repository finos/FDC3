import { setWorldConstructor } from '@cucumber/cucumber';
import { PropsWorld } from '@kite9/testing';
import { MockFDC3Server } from '../support/MockFDC3Server';
import { TestServerContext } from '../support/TestServerContext';

export class CustomWorld extends PropsWorld {
  mockFDC3Server: MockFDC3Server | null = null;

  mockContext: TestServerContext = new TestServerContext(this);

  debugLogs: boolean = false;
}

setWorldConstructor(CustomWorld);
