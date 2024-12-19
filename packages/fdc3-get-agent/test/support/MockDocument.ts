import { MockWindow } from './MockWindow';
import { MockIFrame } from './MockIFrame';
import { MockElement } from './MockElement';

export class MockDocument {
  name: string;
  window: MockWindow;
  iframes: MockIFrame[] = [];

  constructor(name: string, window: MockWindow) {
    this.name = name;
    this.window = window;
  }

  createElement(tag: string): HTMLElement {
    if (tag == 'iframe') {
      const mw = new MockIFrame('iframe', this.window.cw, this.window, 'embedded-iframe');
      this.iframes.push(mw);
      return mw as any;
    } else {
      return new MockElement(tag) as any;
    }
  }

  getElementById(_id: string): HTMLElement | null {
    return new MockElement('div') as any;
  }

  body = new MockElement('body');

  shutdown() {
    this.window.shutdown();
    this.iframes.forEach(i => i.shutdown());
  }
}
