import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestServerContext } from '../support/TestServerContext';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server';
import { BasicDirectory } from '../../src/directory/BasicDirectory';

export const APP_FIELD = 'apps'

export const contextMap: Record<string, any> = {
    "fdc3.instrument": {
        "type": "fdc3.instrument",
        "name": "Apple",
        "id": {
            "ticker": "AAPL"
        }
    },
    "fdc3.country": {
        "type": "fdc3.country",
        "name": "Sweden",
        "id": {
            "COUNTRY_ISOALPHA2": "SE",
            "COUNTRY_ISOALPHA3": "SWE",
        }
    },
    "fdc3.unsupported": {
        "type": "fdc3.unsupported",
        "bogus": true
    },
    "fdc3.book": {
        "type": "fdc3.book",
        "author": "Greg Wallace",
        "title": "Cooking with Greg",
        "id": {
            "ISBN": "1234"
        }
    }
}


export function createMeta(cw: CustomWorld, appStr: string) {
    const [appId, instanceId] = appStr.split("/")
    const app = { appId, instanceId }

    return {
        "requestUuid": cw.sc.createUUID(),
        "timestamp": new Date(),
        "source": app
    }
}

Given('A newly instantiated FDC3 Server', function (this: CustomWorld) {
    const apps = this.props[APP_FIELD] ?? []
    const d = new BasicDirectory(apps)


    this.sc = new TestServerContext(this)
    this.server = new DefaultFDC3Server(this.sc, d, "cucumber-fdc3-server", {}, 2000, 2000)

});