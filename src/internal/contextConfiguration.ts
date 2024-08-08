import { StandardContextType } from '../context/ContextType';
import { exhaustiveStringTuple } from './typeHelpers';

const STANDARD_CONTEXT_TYPES = exhaustiveStringTuple<StandardContextType>()(
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
  'fdc3.timeRange',
  'fdc3.transactionResult',
  'fdc3.valuation'
);

// used internally to check if a given intent/context is a standard one
export const StandardContextsSet = new Set(STANDARD_CONTEXT_TYPES);
