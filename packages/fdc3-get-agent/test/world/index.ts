import { QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import { MockFDC3Server } from '../support/MockFDC3Server.js';
import { TestServerContext } from '../support/TestServerContext.js';

export interface CustomWorldInterface extends QuickPickleWorldInterface {
  props: Record<string, any>;
  mockFDC3Server: MockFDC3Server | null;
  mockContext: TestServerContext;
  debugLogs: boolean;
  log: (message: string) => void;
}

export class CustomWorld extends QuickPickleWorld implements CustomWorldInterface {
  props: Record<string, any> = {};
  mockFDC3Server: MockFDC3Server | null = null;
  mockContext: TestServerContext = new TestServerContext(this);
  debugLogs: boolean = false;

  log(message: string): void {
    console.log(message);
  }
}
