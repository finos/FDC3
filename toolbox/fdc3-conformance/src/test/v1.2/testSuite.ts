import mocha from 'mocha';
import constants from '../../constants';
import channels_1_2 from './advanced/channels';
import fdc3FindIntent_1_2 from './advanced/fdc3.findIntent';
import fdc3FindIntentsByContext_1_2 from './advanced/fdc3.findIntentsByContext';
import fdc3Open_1_2 from './advanced/fdc3.open';
import fdc3RaiseIntent_1_2_NoAppsFound from './advanced/fdc3.raiseIntent-NoAppsFound';
import fdc3RaiseIntent_1_2 from './advanced/fdc3.raiseIntent';
import fdc3GetInfo_1_2 from './advanced/fdc3.getInfo';
import {
  fdc3BasicCL1_1_2,
  fdc3BasicCL2_1_2,
  fdc3BasicIL1_1_2,
  fdc3BasicGI1_1_2,
  fdc3BasicAC1_1_2,
  fdc3BasicUC1_1_2,
  fdc3BasicJC1_1_2,
  fdc3BasicRI1_1_2,
  fdc3BasicRI2_1_2,
} from './basic/fdc3.basic';

type testSet = { [key: string]: (() => void)[] };

const basicSuite_1_2: testSet = {
  'fdc3.basicCL1 1.2': [fdc3BasicCL1_1_2],
  'fdc3.basicCL2 1.2': [fdc3BasicCL2_1_2],
  'fdc3.basicIL1 1.2': [fdc3BasicIL1_1_2],
  'fdc3.basicGI1 1.2': [fdc3BasicGI1_1_2],
  'fdc3.basicAC1 1.2': [fdc3BasicAC1_1_2],
  'fdc3.basicUC1 1.2': [fdc3BasicUC1_1_2],
  'fdc3.basicJC1 1.2': [fdc3BasicJC1_1_2],
  'fdc3.basicRI1 1.2': [fdc3BasicRI1_1_2],
  'fdc3.basicRI2 1.2': [fdc3BasicRI2_1_2],
};

const advancedSuite_1_2: testSet = {
  'fdc3.open 1.2': [fdc3Open_1_2],
  'fdc3.getInfo 1.2': [fdc3GetInfo_1_2],
  'channels 1.2': [channels_1_2],
  'fdc3.findIntent 1.2': [fdc3FindIntent_1_2],
  'fdc3.raiseIntent 1.2': [fdc3RaiseIntent_1_2],
  'fdc3.raiseIntent 1.2 (NoAppsFound)': [fdc3RaiseIntent_1_2_NoAppsFound],
  'fdc3.findIntentsByContext 1.2': [fdc3FindIntentsByContext_1_2],
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
  'All 1.2': stripSuites([basicSuite_1_2, advancedSuite_1_2]),
  'Basic 1.2': stripSuites([basicSuite_1_2]),
  'Advanced 1.2': stripSuites([advancedSuite_1_2]),
  ...basicSuite_1_2,
  ...advancedSuite_1_2,
};

export const packs: { [index: string]: string[] } = {
  '1.2 (Combined)': ['All 1.2', 'Basic 1.2', 'Advanced 1.2'],
  '1.2 (Individual Basic)': Object.keys(basicSuite_1_2),
  '1.2 (Individual Advanced)': Object.keys(advancedSuite_1_2),
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
