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
  'fdc3.basicGetAgent 2.2': [fdc3BasicGetAgent_2_2],
  'fdc3.basicCL1 2.0': [fdc3BasicCL1_2_0],
  'fdc3.basicCL2 2.0': [fdc3BasicCL2_2_0],
  'fdc3.basicIL1 2.0': [fdc3BasicIL1_2_0],
  'fdc3.basicGI1 2.0': [fdc3BasicGI1_2_0],
  'fdc3.basicAC1 2.0': [fdc3BasicAC1_2_0],
  'fdc3.basicUC1 2.0': [fdc3BasicUC1_2_0],
  'fdc3.basicJC1 2.0': [fdc3BasicJC1_2_0],
  'fdc3.basicRI1 2.0': [fdc3BasicRI1_2_0],
  'fdc3.basicRI2 2.0': [fdc3BasicRI2_2_0],
};

const advancedSuite_2_0: testSet = {
  'fdc3.open 2.0': [fdc3Open_2_0],
  'fdc3.getInfo 2.0': [fdc3GetInfo_2_0],
  'fdc3.getAppMetadata 2.0': [fdc3getAppMetadata_2_0],
  'Channels 2.0': [channels_2_0],
  'fdc3.findInstances 2.0': [fdc3FindInstances_2_0],
  'fdc3.findIntent 2.0': [fdc3FindIntent_2_0],
  'fdc3.findIntentsByContext 2.0': [fdc3FindIntentsByContext_2_0],
  'fdc3.raiseIntent 2.0': [fdc3RaiseIntent_2_0],
  'fdc3.raiseIntent 2.0 (result)': [fdc3RaiseIntent_2_0_Result],
  'fdc3.raiseIntent 2.0 (throws error)': [fdc3RaiseIntent_2_0_NoAppsFound],
};

const ambiguousTests_2_0: testSet = {
  'fdc3.ResolveAmbiguousIntentTarget 2.0': [fdc3ResolveAmbiguousIntentTarget_2_0],
  'fdc3.ResolveAmbiguousContextTarget 2.0': [fdc3ResolveAmbiguousContextTarget_2_0],
  'fdc3.ResolveAmbiguousIntentTargetMultiInstance 2.0': [fdc3ResolveAmbiguousIntentTargetMultiInstance_2_0],
  'fdc3.ResolveAmbiguousContextTargetMultiInstance 2.0': [fdc3ResolveAmbiguousContextTargetMultiInstance_2_0],
  'fdc3.ChannelChangedEvent 2.2': [fdc3ChannelChangedEvent_2_2],
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
  'All 2.0': stripSuites([basicSuite_2_0, advancedSuite_2_0]),
  'Basic 2.0': stripSuites([basicSuite_2_0]),
  'Advanced 2.0': stripSuites([advancedSuite_2_0]),
  ...basicSuite_2_0,
  ...advancedSuite_2_0,
};

export const allManualTests: testSet = {
  ...ambiguousTests_2_0,
};

export const packs: { [index: string]: string[] } = {
  '2.0 (Combined)': ['All 2.0', 'Basic 2.0', 'Advanced 2.0'],
  '2.0 (Individual Basic)': Object.keys(basicSuite_2_0),
  '2.0 (Individual Advanced)': Object.keys(advancedSuite_2_0),
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
  (mocha as any).timeout(constants.TestTimeout);
  const suite = allManualTests[pack];
  console.log('************ found suite******', suite);
  suite.forEach(s => s());
  mocha.run();
};
