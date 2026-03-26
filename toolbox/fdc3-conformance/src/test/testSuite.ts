import mocha from 'mocha';
import constants from '../constants';
import fdc3FindIntent from './advanced/fdc3.findIntent';
import fdc3FindIntentsByContext from './advanced/fdc3.findIntentsByContext';
import fdc3GetInfo from './advanced/fdc3.getInfo';
import fdc3getAppMetadata from './advanced/fdc3.getAppMetadata';
import fdc3FindInstances from './advanced/fdc3.findInstances';
import fdc3Open from './advanced/fdc3.open';
import fdc3RaiseIntent from './advanced/fdc3.raiseIntent';
import fdc3RaiseIntent_Result from './advanced/fdc3.raiseIntent-Result';
import fdc3RaiseIntent_NoAppsFound from './advanced/fdc3.raiseIntent-NoAppsFound';
import fdc3AppChannels from './advanced/fdc3.app-channels';
import fdc3UserChannels from './advanced/fdc3.user-channels';
import {
  fdc3BasicGetAgent,
  fdc3BasicCL1,
  fdc3BasicCL2,
  fdc3BasicIL1,
  fdc3BasicGI1,
  fdc3BasicAC1,
  fdc3BasicUC1,
  fdc3BasicJC1,
  fdc3BasicRI1,
  fdc3BasicRI2,
} from './basic/fdc3.basic';
import {
  fdc3ResolveAmbiguousIntentTarget,
  fdc3ResolveAmbiguousContextTarget,
  fdc3ResolveAmbiguousIntentTargetMultiInstance,
  fdc3ResolveAmbiguousContextTargetMultiInstance,
  fdc3ChannelChangedEvent,
} from './manual/fdc3.manual';

type testSet = { [key: string]: (() => Promise<Mocha.Suite>)[] };

const basicSuite: testSet = {
  'fdc3.basicGetAgent': [fdc3BasicGetAgent],
  'fdc3.basicCL1': [fdc3BasicCL1],
  'fdc3.basicCL2': [fdc3BasicCL2],
  'fdc3.basicIL1': [fdc3BasicIL1],
  'fdc3.basicGI1': [fdc3BasicGI1],
  'fdc3.basicAC1': [fdc3BasicAC1],
  'fdc3.basicUC1': [fdc3BasicUC1],
  'fdc3.basicJC1': [fdc3BasicJC1],
  'fdc3.basicRI1': [fdc3BasicRI1],
  'fdc3.basicRI2': [fdc3BasicRI2],
};

const advancedSuite: testSet = {
  'fdc3.open': [fdc3Open],
  'fdc3.getInfo': [fdc3GetInfo],
  'fdc3.getAppMetadata': [fdc3getAppMetadata],
  'fdc3.appChannels': [fdc3AppChannels],
  'fdc3.userChannels': [fdc3UserChannels],
  'fdc3.findInstances': [fdc3FindInstances],
  'fdc3.findIntent': [fdc3FindIntent],
  'fdc3.findIntentsByContext': [fdc3FindIntentsByContext],
  'fdc3.raiseIntent': [fdc3RaiseIntent],
  'fdc3.raiseIntent (result)': [fdc3RaiseIntent_Result],
  'fdc3.raiseIntent (throws error)': [fdc3RaiseIntent_NoAppsFound],
};

const ambiguousTests: testSet = {
  'fdc3.ResolveAmbiguousIntentTarget': [fdc3ResolveAmbiguousIntentTarget],
  'fdc3.ResolveAmbiguousContextTarget': [fdc3ResolveAmbiguousContextTarget],
  'fdc3.ResolveAmbiguousIntentTargetMultiInstance': [fdc3ResolveAmbiguousIntentTargetMultiInstance],
  'fdc3.ResolveAmbiguousContextTargetMultiInstance': [fdc3ResolveAmbiguousContextTargetMultiInstance],
  'fdc3.ChannelChangedEvent': [fdc3ChannelChangedEvent],
};

function stripSuites(ts: testSet[]): (() => Promise<Mocha.Suite>)[] {
  const out: (() => Promise<Mocha.Suite>)[] = [];
  ts.map(item => {
    const sets = Object.values(item);
    sets.forEach(set => set.forEach(test => out.push(test)));
  });
  return out;
}

export const allTests: testSet = {
  All: stripSuites([basicSuite, advancedSuite]),
  ...basicSuite,
  ...advancedSuite,
};

export const allManualTests: testSet = {
  ...ambiguousTests,
};

export const packs: { [index: string]: string[] } = {
  All: ['All'],
  'Individual Basic': Object.keys(basicSuite),
  'Individual Advanced': Object.keys(advancedSuite),
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
export const executeTestsInBrowser = async (pack: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (mocha as any).timeout(constants.TestTimeout);
  const suite = allTests[pack];
  for (let index = 0; index < suite.length; index++) {
    await suite[index]();
  }
  mocha.run();
};

/**
 * Intended for running Manual tests in container with results shown
 * in HTML page
 */
export const executeManualTestsInBrowser = async (pack: string) => {
  console.log('Pack', pack);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (mocha as any).timeout(constants.TestTimeout);
  const suite = allManualTests[pack];
  console.log('************ found suite ************', suite);
  for (let index = 0; index < suite.length; index++) {
    await suite[index]();
  }
  mocha.run();
};
