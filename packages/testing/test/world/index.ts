import { World, setWorldConstructor } from "@cucumber/cucumber";
import { TestMessaging } from "../support/TestMessaging";

export class CustomWorld extends World {

    messaging: TestMessaging | null = null

    props: Record<string, any> = {}
}

setWorldConstructor(CustomWorld)