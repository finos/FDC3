import mocha from 'mocha';
import constants from '../constants';
import channels_2_0 from './advanced/channels';
import fdc3FindIntent_2_0 from './advanced/fdc3.findIntent';
import fdc3FindIntentsByContext_2_0 from './advanced/fdc3.findIntentsByContext';
import fdc3GetInfo_2_0 from './advanced/fdc3.getInfo';
import fdc3getAppMetadata_2_0 from './advanced/fdc3.getAppMetadata';
import fdc3FindInstances_2_0 from './advanced/fdc3.findInstances';
import fdc3Open_2_0 from './advanced/fdc3.open';
import fdc3RaiseIntent_2_0 from './advanced/fdc3.raiseIntent';
import fdc3RaiseIntent_2_0_Result from './advanced/fdc3.raiseIntent-Result';
import fdc3RaiseIntent_2_0_NoAppsFound from './advanced/fdc3.raiseIntent-NoAppsFound';
import {
  fdc3BasicGetAgent_2_2,
  fdc3BasicCL1_2_0,
  fdc3BasicCL2_2_0,
  fdc3BasicIL1_2_0,
  fdc3BasicGI1_2_0,
  fdc3BasicAC1_2_0,
  fdc3BasicUC1_2_0,
  fdc3BasicJC1_2_0,
  fdc3BasicRI1_2_0,
  fdc3BasicRI2_2_0,
} from './basic/fdc3.basic';
import {
  fdc3ResolveAmbiguousIntentTarget_2_0,
  fdc3ResolveAmbiguousContextTarget_2_0,
  fdc3ResolveAmbiguousIntentTargetMultiInstance_2_0,
  fdc3ResolveAmbiguousContextTargetMultiInstance_2_0,
  fdc3ChannelChangedEvent_2_2,
} from './manual/fdc3.manual';

type testSet = { [key: string]: (() => void)[] };

const basicSuite_2_0: testSet = {
  'fdc3.basicGetAgent': [fdc3BasicGetAgent_2_2],
  'fdc3.basicCL1': [fdc3BasicCL1_2_0],
  'fdc3.basicCL2': [fdc3BasicCL2_2_0],
  'fdc3.basicIL1': [fdc3BasicIL1_2_0],
  'fdc3.basicGI1': [fdc3BasicGI1_2_0],
  'fdc3.basicAC1': [fdc3BasicAC1_2_0],
  'fdc3.basicUC1': [fdc3BasicUC1_2_0],
  'fdc3.basicJC1': [fdc3BasicJC1_2_0],
  'fdc3.basicRI1': [fdc3BasicRI1_2_0],
  'fdc3.basicRI2': [fdc3BasicRI2_2_0],
};

const advancedSuite_2_0: testSet = {
  'fdc3.open': [fdc3Open_2_0],
  'fdc3.getInfo': [fdc3GetInfo_2_0],
  'fdc3.getAppMetadata': [fdc3getAppMetadata_2_0],
  Channels: [channels_2_0],
  'fdc3.findInstances': [fdc3FindInstances_2_0],
  'fdc3.findIntent': [fdc3FindIntent_2_0],
  'fdc3.findIntentsByContext': [fdc3FindIntentsByContext_2_0],
  'fdc3.raiseIntent': [fdc3RaiseIntent_2_0],
  'fdc3.raiseIntent (result)': [fdc3RaiseIntent_2_0_Result],
  'fdc3.raiseIntent (throws error)': [fdc3RaiseIntent_2_0_NoAppsFound],
};

const ambiguousTests_2_0: testSet = {
  'fdc3.ResolveAmbiguousIntentTarget': [fdc3ResolveAmbiguousIntentTarget_2_0],
  'fdc3.ResolveAmbiguousContextTarget': [fdc3ResolveAmbiguousContextTarget_2_0],
  'fdc3.ResolveAmbiguousIntentTargetMultiInstance': [fdc3ResolveAmbiguousIntentTargetMultiInstance_2_0],
  'fdc3.ResolveAmbiguousContextTargetMultiInstance': [fdc3ResolveAmbiguousContextTargetMultiInstance_2_0],
  'fdc3.ChannelChangedEvent': [fdc3ChannelChangedEvent_2_2],
};

function stripSuites(ts: testSet[]): (() => void)[] {
  const out: (() => void)[] = [];
  ts.map(item => {
    const sets = Object.values(item);
    sets.forEach(set => set.forEach(test => out.push(test)));
  });
  return out;
}

export const allTests: testSet = {
  All: stripSuites([basicSuite_2_0, advancedSuite_2_0]),
  Basic: stripSuites([basicSuite_2_0]),
  Advanced: stripSuites([advancedSuite_2_0]),
  ...basicSuite_2_0,
  ...advancedSuite_2_0,
};

export const allManualTests: testSet = {
  ...ambiguousTests_2_0,
};

export const packs: { [index: string]: string[] } = {
  Combined: ['All', 'Basic', 'Advanced'],
  'Individual Basic': Object.keys(basicSuite_2_0),
  'Individual Advanced': Object.keys(advancedSuite_2_0),
};

export function getPackNames(): string[] {
  return Object.keys(packs);
}

export function getPackMembers(packName: string): string[] {
  return packs[packName];
}

/**
 * Intended for running tests in container with results shown
 * in HTML page
 */
export const executeTestsInBrowser = (pack: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (mocha as any).timeout(constants.TestTimeout);
  const suite = allTests[pack];
  suite.forEach(s => s());
  mocha.run();
};

/**
 * Intended for running Manual tests in container with results shown
 * in HTML page
 */
export const executeManualTestsInBrowser = (pack: string) => {
  console.log('Pack', pack);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (mocha as any).timeout(constants.TestTimeout);
  const suite = allManualTests[pack];
  console.log('************ found suite******', suite);
  suite.forEach(s => s());
  mocha.run();
};
