import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestServerContext } from '../support/TestServerContext';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server';


Given('A newly instantiated FDC3 Server', function (this: CustomWorld) {

    this.sc = new TestServerContext(this)
    this.server = new DefaultFDC3Server(this.sc)
  
});