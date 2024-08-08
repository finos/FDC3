import { AppIdentifier } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { RegisterableListener } from "../listeners/RegisterableListener";

export abstract class AbstractMessaging implements Messaging {

    abstract getSource(): AppIdentifier
    abstract createUUID(): string
    abstract post(message: object): Promise<void>

    abstract register(l: RegisterableListener): void
    abstract unregister(id: string): void

    abstract createMeta(): object

    waitFor<X>(filter: (m: any) => boolean): Promise<X> {
        const id = this.createUUID()
        return new Promise<X>((resolve, _reject) => {
            this.register({
                id,
                filter: filter,
                action: (m) => {
                    this.unregister(id)
                    resolve(m)
                },
                register: () => Promise.resolve()
            } as RegisterableListener);
        })
    }

    async exchange<X>(message: any, expectedTypeName: string): Promise<X> {
        this.post(message)
        const out: any = await this.waitFor(m =>
            (m.type == expectedTypeName)
            && (m.meta.requestUuid == message.meta.requestUuid))

        if (out?.payload?.error) {
            throw new Error(out.payload.error)
        } else {
            return out
        }
    }
}