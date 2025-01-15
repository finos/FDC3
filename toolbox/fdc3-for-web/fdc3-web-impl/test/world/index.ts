import { World, setWorldConstructor } from '@cucumber/cucumber';
import { TestServerContext } from '../support/TestServerContext';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server';
import { BasicDirectory } from '../../src/directory/BasicDirectory';

export class CustomWorld extends World {
  sc = new TestServerContext(this);
  server = new DefaultFDC3Server(this.sc, new BasicDirectory([]), [], false);
  props: Record<string, any> = {};
}

setWorldConstructor(CustomWorld);
