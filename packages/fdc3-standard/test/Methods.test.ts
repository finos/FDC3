import { describe, test, expect } from 'vitest';
import {
  compareVersionNumbers,
  ImplementationMetadata,
  versionIsAtLeast,
  isStandardContextType,
  isStandardIntent,
} from '../src/index.js';

describe('test version comparison functions', () => {
  test('compareVersionNumbers', () => {
    expect(compareVersionNumbers('1.1', '1.2')).toBe(-1);
    expect(compareVersionNumbers('1.2', '1.1')).toBe(1);
    expect(compareVersionNumbers('1.2', '1.2')).toBe(0);
    expect(compareVersionNumbers('1.1.1', '1.2')).toBe(-1);
    expect(compareVersionNumbers('1.1.1', '1.1')).toBe(1);
    expect(compareVersionNumbers('1.1', '1.1.1')).toBe(-1);
    expect(compareVersionNumbers('1.1.1', '1.1.1')).toBe(0);
  });

  test('versionIsAtLeast', () => {
    const metaOneTwo: ImplementationMetadata = {
      fdc3Version: '1.2',
      provider: 'test',
      appMetadata: { appId: 'dummy', name: 'dummy' },
      optionalFeatures: {
        OriginatingAppMetadata: true,
        UserChannelMembershipAPIs: false,
        DesktopAgentBridging: false,
      },
    };
    expect(versionIsAtLeast(metaOneTwo, '1.1')).toBe(true);
    expect(versionIsAtLeast(metaOneTwo, '1.2')).toBe(true);
    expect(versionIsAtLeast(metaOneTwo, '1.2.1')).toBe(false);
    expect(versionIsAtLeast(metaOneTwo, '2.0')).toBe(false);

    const metaOneTwoOne: ImplementationMetadata = {
      fdc3Version: '1.2.1',
      provider: 'test',
      appMetadata: { appId: 'dummy', name: 'dummy' },
      optionalFeatures: {
        OriginatingAppMetadata: true,
        UserChannelMembershipAPIs: false,
        DesktopAgentBridging: false,
      },
    };
    expect(versionIsAtLeast(metaOneTwoOne, '1.1')).toBe(true);
    expect(versionIsAtLeast(metaOneTwoOne, '1.2')).toBe(true);
    expect(versionIsAtLeast(metaOneTwoOne, '1.2.1')).toBe(true);
    expect(versionIsAtLeast(metaOneTwoOne, '2.0')).toBe(false);
  });

  test('isStandardContextType should return TRUE for standard context types', () => {
    expect(isStandardContextType('fdc3.action')).toBe(true);
    expect(isStandardContextType('fdc3.chart')).toBe(true);
    expect(isStandardContextType('fdc3.chat.initSettings')).toBe(true);
    expect(isStandardContextType('fdc3.chat.message')).toBe(true);
    expect(isStandardContextType('fdc3.chat.room')).toBe(true);
    expect(isStandardContextType('fdc3.chat.searchCriteria')).toBe(true);
    expect(isStandardContextType('fdc3.contact')).toBe(true);
    expect(isStandardContextType('fdc3.contactList')).toBe(true);
    expect(isStandardContextType('fdc3.country')).toBe(true);
    expect(isStandardContextType('fdc3.currency')).toBe(true);
    expect(isStandardContextType('fdc3.email')).toBe(true);
    expect(isStandardContextType('fdc3.instrument')).toBe(true);
    expect(isStandardContextType('fdc3.instrumentList')).toBe(true);
    expect(isStandardContextType('fdc3.interaction')).toBe(true);
    expect(isStandardContextType('fdc3.message')).toBe(true);
    expect(isStandardContextType('fdc3.organization')).toBe(true);
    expect(isStandardContextType('fdc3.portfolio')).toBe(true);
    expect(isStandardContextType('fdc3.position')).toBe(true);
    expect(isStandardContextType('fdc3.nothing')).toBe(true);
    expect(isStandardContextType('fdc3.timeRange')).toBe(true);
    expect(isStandardContextType('fdc3.transactionResult')).toBe(true);
    expect(isStandardContextType('fdc3.valuation')).toBe(true);
  });

  test('isStandardContextType should return FALSE for custom context types', () => {
    expect(isStandardContextType('myApp.customContext')).toBe(false);
  });

  test('isStandardIntent should return TRUE for standard intents', () => {
    expect(isStandardIntent('CreateInteraction')).toBe(true);
    expect(isStandardIntent('SendChatMessage')).toBe(true);
    expect(isStandardIntent('StartCall')).toBe(true);
    expect(isStandardIntent('StartChat')).toBe(true);
    expect(isStandardIntent('StartEmail')).toBe(true);
    expect(isStandardIntent('ViewAnalysis')).toBe(true);
    expect(isStandardIntent('ViewChat')).toBe(true);
    expect(isStandardIntent('ViewChart')).toBe(true);
    expect(isStandardIntent('ViewContact')).toBe(true);
    expect(isStandardIntent('ViewHoldings')).toBe(true);
    expect(isStandardIntent('ViewInstrument')).toBe(true);
    expect(isStandardIntent('ViewInteractions')).toBe(true);
    expect(isStandardIntent('ViewMessages')).toBe(true);
    expect(isStandardIntent('ViewNews')).toBe(true);
    expect(isStandardIntent('ViewOrders')).toBe(true);
    expect(isStandardIntent('ViewProfile')).toBe(true);
    expect(isStandardIntent('ViewQuote')).toBe(true);
    expect(isStandardIntent('ViewResearch')).toBe(true);
  });

  test('isStandardIntent should return FALSE for custom intents', () => {
    expect(isStandardIntent('myApp.CustomIntent')).toBe(false);
  });
});
