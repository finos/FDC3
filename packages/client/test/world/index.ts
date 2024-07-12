import { setWorldConstructor } from "@cucumber/cucumber";
import { PropsWorld } from "@kite9/testing";
import { TestMessaging } from "../support/TestMessaging";

export class CustomWorld extends PropsWorld {

    messaging: TestMessaging | null = null

}

setWorldConstructor(CustomWorld)