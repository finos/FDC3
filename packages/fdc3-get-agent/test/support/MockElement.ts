import { MockCSSStyleDeclaration } from './MockCSSStyleDeclaration';

export class MockElement {
  tag: string;
  atts: { [name: string]: any } = {};
  children: HTMLElement[] = [];

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
  }

  removeChild(child: HTMLElement) {
    this.children.splice(this.children.indexOf(child), 1);
  }

  remove() {}
}
