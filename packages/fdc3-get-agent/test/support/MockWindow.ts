import { DesktopAgent } from '@kite9/fdc3-standard';
import { CustomWorld } from '../world';
import { EventHandler } from './EventHandler';
import { MockElement } from './MockElement';
import {
  AgentEventMessage,
  AgentResponseMessage,
  AppRequestMessage,
  Fdc3UserInterfaceMessage,
  isFdc3UserInterfaceHello,
  WebConnectionProtocolMessage,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

type STANDARD_MESSAGES =
  | AppRequestMessage
  | AgentResponseMessage
  | AgentEventMessage
  | WebConnectionProtocolMessage
  | Fdc3UserInterfaceMessage;

export class MockWindow extends MockElement {
  fdc3: DesktopAgent | undefined;
  cw: CustomWorld;
  name: string;

  constructor(tag: string, cw: CustomWorld, name: string) {
    super(tag);
    this.cw = cw;
    this.name = name;
    if (cw.debugLogs) {
      console.debug(`MockWindow (name: ${this.name} / tag: ${this.tag}): Created`);
    }
  }

  eventHandlers: EventHandler[] = [];
  events: { type: string; data: MessageEvent }[] = [];

  //references used to attribute postMessages to sources
  parent: MockWindow | null = null;
  child: MockWindow | null = null;
  commsIframe: MockWindow | null = null;
  channelSelectorIframe: MockWindow | null = null;
  intentResolverIframe: MockWindow | null = null;

  location = {
    origin: 'https://dummyOrigin.test',
    href: 'https://dummyOrigin.test/path',
  };

  addEventListener(type: string, callback: (e: Event) => void): void {
    this.eventHandlers.push({ type, callback });
    if (this.cw.debugLogs) {
      console.log(`MockWindow (name: ${this.name} / tag: ${this.tag}): added event handler: ${type}`);
    }
  }

  removeEventListener(type: string, el: EventListener): void {
    const removeIndex = this.eventHandlers.findIndex(e => e.type === type && e.callback === el);
    if (removeIndex !== -1) {
      this.eventHandlers.splice(removeIndex, 1);
      if (this.cw.debugLogs) {
        console.debug(`MockWindow (name: ${this.name} / tag: ${this.tag}): removed event handler: ${type}`);
      }
    }
  }

  dispatchEvent(event: Event): void {
    this.events.push({ type: event.type, data: (event as unknown as MessageEvent).data });
    this.eventHandlers.forEach(e => {
      if (e.type === event.type) {
        e.callback(event);
      }
    });
  }

  postMessage(msg: STANDARD_MESSAGES, targetOrigin: string, transfer: MessagePort[] | undefined): void {
    //usually only one of these will be set - however parent might be set initially,
    //  but later overridden by commsIframe wafter a WCP2LoadUrl
    let source = this.commsIframe ?? this.child ?? this.parent ?? this;

    //adjust source for mock UI iframes - these variables are set in MockDocument.setAttribute
    if (isFdc3UserInterfaceHello(msg)) {
      if (msg.payload.implementationDetails == 'mock channel selector') {
        source = this.channelSelectorIframe!;
      } else if (msg.payload.implementationDetails == 'mock intent resolver') {
        source = this.intentResolverIframe!;
      }
    }

    const event = {
      type: 'message',
      data: msg,
      origin: targetOrigin,
      ports: transfer,
      //TODO: set source for UI iframes, comms iframe, parent DA or child app depending on message type
      source,
    } as unknown as MessageEvent;

    if (this.cw.debugLogs) {
      console.debug(
        `MockWindow (name: ${this.name} / tag: ${this.tag}): postMessage called with source: ${(event.source as WindowProxy)?.name ?? 'UNKNOWN'}`
      );
    }
    this.dispatchEvent(event);
  }

  shutdown() {
    this.eventHandlers = [];
    this.fdc3 = undefined;
    if (this.cw.mockFDC3Server) {
      this.cw.mockFDC3Server.shutdown();
    }
  }
}
