import { World, setWorldConstructor } from "@cucumber/cucumber";
import { TestServerContext } from "../support/TestServerContext";
import { DefaultFDC3Server } from "../../src/BasicFDC3Server";

export class CustomWorld extends World {

    sc = new TestServerContext(this)
    server  = new DefaultFDC3Server(this.sc)
    props: Record<string, any> = {}
}

setWorldConstructor(CustomWorld)