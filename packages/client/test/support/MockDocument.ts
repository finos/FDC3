

class MockCSSStyleDeclaration {

    props: { [name: string]: any } = {}

    setProperty(name: string, value: string) {
        this.props[name] = value
    }

    removeProperty(name: string) {
        delete this.props[name]
    }

}

class MockElement {

    tag: string
    atts: { [name: string]: any } = {}
    children: HTMLElement[] = []

    constructor(tag: string) {
        this.tag = tag
    }

    style = new MockCSSStyleDeclaration()

    setAttribute(name: string, value: string) {
        this.atts[name] = value
    }

    removeAttribute(name: string) {
        delete this.atts[name]
    }

    appendChild(child: HTMLElement) {
        this.children.push(child)
    }
}

export class MockDocument {

    name: string

    constructor(name: string) {
        this.name = name
    }

    createElement(tag: string): HTMLElement {
        return new MockElement(tag) as any
    }

    body = new MockElement("body")
}


// for the purposes of testing, set up a single document
export const mockDocument = new MockDocument("mockDocument")