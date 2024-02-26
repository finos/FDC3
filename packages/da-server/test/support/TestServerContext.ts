import { ServerContext } from '../../src/ServerContext'
import { v4 as uuidv4 } from 'uuid'
import { CustomWorld } from '../world'


export class TestServerContext implements ServerContext {

    public postedMessages: object[] = []
    private readonly cw: CustomWorld


    constructor(cw: CustomWorld) {
        this.cw = cw
    }

    createUUID() : string {
        return uuidv4()
    }

    post(message: object): Promise<void> {
        this.postedMessages.push(message)
        return Promise.resolve();
    }

    log(message: string): void {
        this.cw.log(message)
    }

}