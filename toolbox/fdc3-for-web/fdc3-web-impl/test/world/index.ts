import { QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';
import { TestServerContext } from '../support/TestServerContext.js';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server.js';
import { BasicDirectory } from '../../src/directory/BasicDirectory.js';

export interface CustomWorldInterface extends QuickPickleWorldInterface {
  props: Record<string, any>;
  sc: TestServerContext;
  server: DefaultFDC3Server;
  log: (message: string) => void;
}

export class CustomWorld extends QuickPickleWorld implements CustomWorldInterface {
  props: Record<string, any> = {};
  sc: TestServerContext = new TestServerContext(this);
  server: DefaultFDC3Server = new DefaultFDC3Server(this.sc, new BasicDirectory([]), [], false);

  log(message: string): void {
    console.log(message);
  }
}
