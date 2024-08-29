// import { AppIdentifier } from "@finos/fdc3";
// import { RegisterableListener } from "@kite9/da-proxy";
// import { AppRequestMessage } from "@kite9/fdc3-common";
// import { v4 as uuidv4 } from 'uuid'
// import { AbstractWebMessaging } from "../../src/messaging/AbstractWebMessaging";
// import { CurrentChannel } from "./responses/CurrentChannel";
// import { FindIntent } from "./responses/FindIntent";
// import { Handshake } from "./responses/Handshake";
// import { RaiseIntent } from "./responses/RaiseIntent";
// import { UserChannels } from "./responses/UserChannels";



// export class TestMessaging extends AbstractWebMessaging {

//     readonly listeners: Map<string, RegisterableListener> = new Map()
//     readonly allPosts: AppRequestMessage[] = []

//     constructor() {
//         super({
//             channelSelector: true,
//             intentResolver: true,
//             timeout: 2000,
//             dontSetWindowFdc3: false
//         }, 'abc123')
//     }

//     readonly automaticResponses: AutomaticResponse[] = [
//         new FindIntent(),
//         new RaiseIntent(),
//         new Handshake(),
//         new UserChannels(),
//         new CurrentChannel()
//     ]

//     register(l: RegisterableListener) {
//         this.listeners.set(l.id!!, l)
//     }

//     unregister(id: string) {
//         this.listeners.delete(id)
//     }

//     createMeta() {
//         return {
//             "requestUuid": this.createUUID(),
//             "timestamp": new Date(),
//             "source": this.getSource(),
//             "responseUuid": this.createUUID()
//         }
//     }


//     getSource(): AppIdentifier {
//         return {
//             appId: "SomeDummyApp",
//             instanceId: "some.dummy.instance"
//         }
//     }

//     createUUID(): string {
//         return uuidv4()
//     }


//     post(message: AppRequestMessage): Promise<void> {
//         this.allPosts.push(message)
//         for (let i = 0; i < this.automaticResponses.length; i++) {
//             const ar = this.automaticResponses[i]
//             if (ar.filter(message.type)) {
//                 return ar.action(message, this)
//             }
//         }

//         return Promise.resolve();
//     }

//     receive(m: any) {
//         this.listeners.forEach((v, k) => {
//             if (v.filter(m)) {
//                 console.log("Processing in " + k)
//                 v.action(m)
//             } else {
//                 console.log("Ignoring in " + k)
//             }
//         })
//     }
// }