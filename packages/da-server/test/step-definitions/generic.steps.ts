import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestServerContext } from '../support/TestServerContext';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server';
import { BasicDirectory } from '../../src/directory/BasicDirectory';

export const APP_FIELD = 'apps'

Given('A newly instantiated FDC3 Server', function (this: CustomWorld) {


    const apps = this.props[APP_FIELD] ?? []
    const d = new BasicDirectory(apps)


    this.sc = new TestServerContext(this)
    this.server = new DefaultFDC3Server(this.sc, d)

});