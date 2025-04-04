import { Listener, ResolveError, DesktopAgent } from 'fdc3_1_2';

import { BasicControl1_2 } from './basic-support-1.2';
import { ChannelControl1_2 } from '../support/channels-support-1.2';
import { ContextType, Intent, IntentApp } from '../support/intent-support-1.2';
import { closeMockAppWindow } from '../fdc3-1_2-utils';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import {
  basicAC1,
  basicCL1,
  basicCL2,
  basicGI1,
  basicIL1,
  basicJC1,
  basicRI1,
  basicRI2,
  basicUC1,
} from '../../common/fdc3.basic';
import { wait } from '../../../utils';
import constants from '../../../constants';

declare let fdc3: DesktopAgent;
let listener: Listener;

const control = new BasicControl1_2();
const cc = new ChannelControl1_2();
const documentation_CL = '\r\nDocumentation: ' + APIDocumentation1_2.addContextListener + '\r\nCause';
const documentation_IL = '\r\nDocumentation: ' + APIDocumentation1_2.addIntentListener + '\r\nCause';
const documentation_GI = '\r\nDocumentation: ' + APIDocumentation1_2.getInfo + '\r\nCause';
const documentation_AC = '\r\nDocumentation: ' + APIDocumentation1_2.getOrCreateChannel + '\r\nCause';
const documentation_UC = '\r\nDocumentation: ' + APIDocumentation1_2.getSystemChannels + '\r\nCause';
const documentation_JC = '\r\nDocumentation: ' + APIDocumentation1_2.getCurrentChannel + '\r\nCause';
const documentation_RI = '\r\nDocumentation: ' + APIDocumentation1_2.raiseIntentForContext + '\r\nCause';

export let fdc3BasicCL1_1_2 = () => describe('fdc3.basicCL1', () => basicCL1(fdc3, documentation_CL, listener));
export let fdc3BasicCL2_1_2 = () => describe('fdc3.basicCL2', () => basicCL2(fdc3, documentation_CL, listener));
export let fdc3BasicIL1_1_2 = () => describe('fdc3.basicIL1', () => basicIL1(fdc3, documentation_IL, listener));
export let fdc3BasicGI1_1_2 = () => describe('fdc3.basicGI1', () => basicGI1(control, documentation_GI));
export let fdc3BasicAC1_1_2 = () => describe('fdc3.basicAC1', () => basicAC1(fdc3, documentation_AC));
export let fdc3BasicUC1_1_2 = () => describe('fdc3.basicUC1', () => basicUC1(control, documentation_UC));
export let fdc3BasicJC1_1_2 = () => describe('fdc3.basicJC1', () => basicJC1(cc, fdc3, documentation_JC));
export let fdc3BasicRI1_1_2 = () =>
  describe('fdc3.basicRI1', () => {
    after(async function after() {
      await wait(constants.ShortWait);
      await closeMockAppWindow(this.currentTest.title);
    });
    basicRI1(fdc3, documentation_RI, Intent.aTestingIntent, ContextType.testContextX);
  });
export let fdc3BasicRI2_1_2 = () =>
  describe('fdc3.basicRI2', () => {
    after(async function after() {
      await wait(constants.ShortWait);
      await closeMockAppWindow(this.currentTest.title);
    });
    basicRI2(fdc3, documentation_RI, ContextType.testContextZ);
  });
