import { ServerContext } from '../../src/ServerContext'
import { v4 as uuidv4 } from 'uuid'
import { CustomWorld } from '../world'
import { AppMetadata } from '@finos/fdc3'

type MessageRecord = {
    to: AppMetadata,
    msg: object
}


export class TestServerContext implements ServerContext {

    public postedMessages: MessageRecord[] = []
    private readonly cw: CustomWorld


    constructor(cw: CustomWorld) {
        this.cw = cw
    }

    provider(): string {
        return "cucumber-provider"
    }
    providerVersion(): string {
        return "1.2.3.TEST"
    }
    fdc3Version(): string {
        return "2.0"
    }

    createUUID(): string {
        return uuidv4()
    }

    post(msg: object, to: AppMetadata): Promise<void> {
        this.postedMessages.push({ msg, to })
        return Promise.resolve();
    }

    log(message: string): void {
        this.cw.log(message)
    }

}