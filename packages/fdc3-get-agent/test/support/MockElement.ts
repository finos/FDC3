import { MockCSSStyleDeclaration } from './MockCSSStyleDeclaration';
import { MockIFrame } from './MockIFrame';

export class MockElement {
  public tag: string;
  public atts: { [name: string]: unknown } = {};
  public children: HTMLElement[] = [];

  constructor(tag: string) {
    this.tag = tag;
  }

  style = new MockCSSStyleDeclaration();

  appendChild(child: HTMLElement) {
    this.children.push(child);

    //if its an iframe make it load here
    if ((child as unknown as MockIFrame).load) {
      (child as unknown as MockIFrame).load();
    }
  }

  remove() {}
}
