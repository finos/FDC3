import { World, setWorldConstructor } from '@cucumber/cucumber';
import { TestFDC3ServerFactory } from '../support/TestServerContext';
import { BasicDirectory } from '../../src/directory/BasicDirectory';

export class CustomWorld extends World {
  sc = new TestFDC3ServerFactory(this, [], new BasicDirectory([]), false).createInstance();
  props: Record<string, any> = {};
}

setWorldConstructor(CustomWorld);
