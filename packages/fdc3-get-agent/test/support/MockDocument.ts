import { MockWindow } from './MockWindow.js';
import { MockIFrame } from './MockIFrame.js';
import { MockElement } from './MockElement.js';

export class MockDocument {
  name: string;
  window: MockWindow;
  iframes: MockIFrame[] = [];
  static allDocuments: MockDocument[] = [];

  constructor(name: string, window: MockWindow) {
    this.name = name;
    this.window = window;
    if (this.window.cw.debugLogs) {
      console.log(`MockDocument (name: ${name} / window.name: ${this.window.name}): Created`);
    }
    MockDocument.allDocuments.push(this);
  }

  createElement(tag: string): HTMLElement {
    if (tag == 'iframe') {
      if (this.window.cw.debugLogs) {
        console.log(`MockDocument (name: ${this.name} / window.name: ${this.window.name}): creating iframe`);
      }
      const mw = new MockIFrame('iframe', this.window.cw, this.window, 'pending-iframe');
      //n.b. variables are set on the parent window to link each iframe in order to allow use as source in
      // postMessages from them - these are set in the MockIframe.setAttribute function

      this.iframes.push(mw);

      return mw as unknown as HTMLElement;
    } else {
      return new MockElement(tag) as unknown as HTMLElement;
    }
  }

  getElementById(/*_id: string*/): HTMLElement | null {
    return new MockElement('div') as unknown as HTMLElement;
  }

  body = new MockElement('body');

  shutdown() {
    this.window.shutdown();
    this.iframes.forEach(i => i.shutdown());
  }

  static shutdownAllDocuments() {
    MockDocument.allDocuments.forEach((doc: MockDocument) => {
      doc.shutdown();
    });
  }
}
