import { StandardIntent } from './Intents';
import { StandardContextType } from '../context/ContextType';

export const IntentsConfiguration = {
  CreateInteraction: ['fdc3.contactList', 'fdc3.interaction', 'fdc3.nothing'],
  StartCall: ['fdc3.contact', 'fdc3.contactList', 'fdc3.nothing'],
  StartChat: ['fdc3.contact', 'fdc3.contactList', 'fdc3.chat.initSettings', 'fdc3.nothing'],
  StartEmail: ['fdc3.email', 'fdc3.nothing'],
  SendChatMessage: ['fdc3.chat.message', 'fdc3.nothing'],
  ViewAnalysis: ['fdc3.instrument', 'fdc3.organization', 'fdc3.portfolio', 'fdc3.nothing'],
  ViewChat: ['fdc3.chat.room', 'fdc3.contact', 'fdc3.contactList', 'fdc3.nothing'],
  ViewChart: [
    'fdc3.chart',
    'fdc3.instrument',
    'fdc3.instrumentList',
    'fdc3.portfolio',
    'fdc3.position',
    'fdc3.nothing',
  ],
  ViewContact: ['fdc3.contact', 'fdc3.nothing'],
  ViewHoldings: ['fdc3.instrument', 'fdc3.instrumentList', 'fdc3.organization', 'fdc3.nothing'],
  ViewInstrument: ['fdc3.instrument', 'fdc3.nothing'],
  ViewInteractions: ['fdc3.contact', 'fdc3.instrument', 'fdc3.organization', 'fdc3.nothing'],
  ViewMessages: ['fdc3.chat.searchCriteria', 'fdc3.nothing'],
  ViewNews: [
    'fdc3.country',
    'fdc3.instrument',
    'fdc3.instrumentList',
    'fdc3.organization',
    'fdc3.portfolio',
    'fdc3.nothing',
  ],
  ViewOrders: ['fdc3.contact', 'fdc3.instrument', 'fdc3.organization', 'fdc3.nothing'],
  ViewProfile: ['fdc3.contact', 'fdc3.organization', 'fdc3.nothing'],
  ViewQuote: ['fdc3.instrument', 'fdc3.nothing'],
  ViewResearch: ['fdc3.contact', 'fdc3.instrument', 'fdc3.organization', 'fdc3.nothing'],
} satisfies Record<StandardIntent, StandardContextType[]>;

const STANDARD_CONTEXT_TYPES: Readonly<StandardContextType[]> = [
  'fdc3.action',
  'fdc3.chart',
  'fdc3.chat.initSettings',
  'fdc3.chat.message',
  'fdc3.chat.room',
  'fdc3.chat.searchCriteria',
  'fdc3.contact',
  'fdc3.contactList',
  'fdc3.country',
  'fdc3.currency',
  'fdc3.email',
  'fdc3.instrument',
  'fdc3.instrumentList',
  'fdc3.interaction',
  'fdc3.message',
  'fdc3.organization',
  'fdc3.portfolio',
  'fdc3.position',
  'fdc3.nothing',
  'fdc3.timerange',
  'fdc3.transactionResult',
  'fdc3.valuation',
] as const;

// used internally to check if a given intent/context is a standard one
export const StandardIntentsSet = new Set(Object.keys(IntentsConfiguration) as StandardIntent[]);
export const StandardContextsSet = new Set(STANDARD_CONTEXT_TYPES);
