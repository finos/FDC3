import { StandardIntent } from '../intents/Intents.js';
import { exhaustiveStringTuple } from './typeHelpers.js';

const STANDARD_INTENTS = exhaustiveStringTuple<StandardIntent>()(
  'CreateInteraction',
  'CreateOrUpdateProfile',
  'SendChatMessage',
  'StartCall',
  'StartChat',
  'StartEmail',
  'ViewAnalysis',
  'ViewChat',
  'ViewChart',
  'ViewContact',
  'ViewHoldings',
  'ViewInstrument',
  'ViewInteractions',
  'ViewMessages',
  'ViewNews',
  'ViewOrders',
  'ViewProfile',
  'ViewQuote',
  'ViewResearch'
);

// used internally to check if a given intent/context is a standard one
export const StandardIntentsSet = new Set(STANDARD_INTENTS);
