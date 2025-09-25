import { setWorldConstructor } from '@cucumber/cucumber';
import { PropsWorld } from '@finos/testing';
import { MockFDC3Server } from '../support/MockFDC3Server.js';
import { TestServerContext } from '../support/TestServerContext.js';

export class CustomWorld extends PropsWorld {
  mockFDC3Server: MockFDC3Server | null = null;

  mockContext: TestServerContext = new TestServerContext(this);

  debugLogs: boolean = false;
}

setWorldConstructor(CustomWorld);
