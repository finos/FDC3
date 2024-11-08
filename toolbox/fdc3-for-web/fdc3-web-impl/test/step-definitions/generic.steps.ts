import { Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestServerContext } from '../support/TestServerContext';
import { DefaultFDC3Server } from '../../src/BasicFDC3Server';
import { BasicDirectory } from '../../src/directory/BasicDirectory';
import { ChannelType } from '../../src/handlers/BroadcastHandler';

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
    },
    "fdc3.magazine": {
        "type": "fdc3.magazine",
        "title": "The Economist",
        "price": 3.99,
        "id": {
            "ISSN": "1234"
        }
    }
}

function defaultChannels() {
    return [
        {
            id: 'one',
            type: ChannelType.user,
            context: [],
            displayMetadata: {
                name: 'One Channel',
                color: 'orange'
            }
        },
        {
            id: 'two',
            type: ChannelType.user,
            context: [],
            displayMetadata: {
                name: 'Two Channel',
                color: 'skyblue'
            }
        },
        {
            id: 'three',
            type: ChannelType.user,
            context: [],
            displayMetadata: {
                name: 'Three Channel',
                color: 'ochre'
            }
        }
    ]
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
    this.server = new DefaultFDC3Server(this.sc, d, defaultChannels(), false, 2000, 2000)
});

Given('A newly instantiated FDC3 Server with heartbeat checking', function (this: CustomWorld) {
    const apps = this.props[APP_FIELD] ?? []
    const d = new BasicDirectory(apps)


    this.sc = new TestServerContext(this)
    this.server = new DefaultFDC3Server(this.sc, d, defaultChannels(), true, 2000, 2000)
});

When("I shutdown the server", function (this: CustomWorld) {
    this.server.shutdown()
})