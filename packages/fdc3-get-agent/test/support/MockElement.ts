import { MockCSSStyleDeclaration } from "./MockCSSStyleDeclaration";
import { MockIFrame } from "./MockIFrame";


export class MockElement {

    public tag: string;
    public atts: { [name: string]: any; } = {};
    public children: HTMLElement[] = [];

    constructor(tag: string) {
        this.tag = tag;
    }

    style = new MockCSSStyleDeclaration();

    setAttribute(name: string, value: string) {
        this.atts[name] = value;
    }

    removeAttribute(name: string) {
        delete this.atts[name];
    }

    appendChild(child: HTMLElement) {
        this.children.push(child);
        
        //if its an iframe make it load here
        if ((child as unknown as MockIFrame).load) {
            (child as unknown as MockIFrame).load();
        }
    }

    removeChild(child: HTMLElement) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    remove() {
    }
}
