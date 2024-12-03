import { DesktopAgent } from '@kite9/fdc3-standard';
import { CustomWorld } from '../world';
import { EventHandler } from './EventHandler';
import { MockElement } from './MockElement';

/**
 * Used for routing of post-message events while running tests
 */

export class MockWindow extends MockElement {
  fdc3: DesktopAgent | undefined;
  cw: CustomWorld;
  name: string;

  constructor(tag: string, cw: CustomWorld, name: string) {
    super(tag);
    this.cw = cw;
    this.name = name;
  }

  eventHandlers: EventHandler[] = [];
  events: any[] = [];

  parent: MockWindow | null = null;

  location = {
    origin: 'https://dummyOrigin.test',
    href: 'https://dummyOrigin.test/path',
  };

  addEventListener(type: string, callback: (e: Event) => void): void {
    this.eventHandlers.push({ type, callback });
  }

  removeEventListener(type: string, el: EventListener): void {
    const removeIndex = this.eventHandlers.findIndex(e => e.type === type && e.callback === el);
    if (removeIndex !== -1) {
      this.eventHandlers.splice(removeIndex, 1);
    }
  }

  dispatchEvent(event: Event): void {
    this.events.push({ type: event.type, data: (event as any).data });
    this.eventHandlers.forEach(e => {
      if (e.type === event.type) {
        e.callback(event);
      }
    });
  }

  postMessage(msg: object, targetOrigin: string, transfer: MessagePort[] | undefined): void {
    this.dispatchEvent({
      type: 'message',
      data: msg,
      origin: targetOrigin,
      ports: transfer,
      source: this.parent ?? this, // when posting from client, set source to self
    } as any);
  }

  shutdown() {
    this.eventHandlers = [];
    this.fdc3 = undefined;
    if (this.cw.mockFDC3Server) {
      this.cw.mockFDC3Server.shutdown();
    }
  }
}
