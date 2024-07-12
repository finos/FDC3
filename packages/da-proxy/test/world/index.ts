import { World, setWorldConstructor } from "@cucumber/cucumber";
import { TestMessaging } from "../support/TestMessaging";
import { PropsWorld } from "@kite9/testing";

export class CustomWorld extends PropsWorld {

    messaging: TestMessaging | null = null

    log(s: string) {
        console.log(s)
    }

}

setWorldConstructor(CustomWorld)