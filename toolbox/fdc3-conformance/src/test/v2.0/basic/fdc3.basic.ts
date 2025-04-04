import { Listener, ResolveError, DesktopAgent } from 'fdc3_2_0';

import { BasicControl2_0 } from './basic-support-2.0';
import { ChannelControl2_0 } from '../support/channels-support-2.0';

import { APIDocumentation2_0 } from '../apiDocuments-2.0';
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
import { ContextType, Intent } from '../support/intent-support-2.0';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { wait } from '../../../utils';
import constants from '../../../constants';

declare let fdc3: DesktopAgent;
let listener: Listener;

const control = new BasicControl2_0();
const cc = new ChannelControl2_0();
const documentation_CL = '\r\nDocumentation: ' + APIDocumentation2_0.addContextListener + '\r\nCause';
const documentation_IL = '\r\nDocumentation: ' + APIDocumentation2_0.addIntentListener + '\r\nCause';
const documentation_GI = '\r\nDocumentation: ' + APIDocumentation2_0.getInfo + '\r\nCause';
const documentation_AC = '\r\nDocumentation: ' + APIDocumentation2_0.getOrCreateChannel + '\r\nCause';
const documentation_UC = '\r\nDocumentation: ' + APIDocumentation2_0.getUserChannels + '\r\nCause';
const documentation_JC = '\r\nDocumentation: ' + APIDocumentation2_0.getCurrentChannel + '\r\nCause';
const documentation_RI = '\r\nDocumentation: ' + APIDocumentation2_0.raiseIntentForContext + '\r\nCause';

export let fdc3BasicCL1_2_0 = () => describe('fdc3.basicCL1_2.0', () => basicCL1(fdc3, documentation_CL, listener));
export let fdc3BasicCL2_2_0 = () => describe('fdc3.basicCL2_2.0', () => basicCL2(fdc3, documentation_CL, listener));
export let fdc3BasicIL1_2_0 = () => describe('fdc3.basicIL1_2.0', () => basicIL1(fdc3, documentation_IL, listener));
export let fdc3BasicGI1_2_0 = () => describe('fdc3.basicGI1_2.0', () => basicGI1(control, documentation_GI));
export let fdc3BasicAC1_2_0 = () => describe('fdc3.basicAC1_2.0', () => basicAC1(fdc3, documentation_AC));
export let fdc3BasicUC1_2_0 = () => describe('fdc3.basicUC1_2.0', () => basicUC1(control, documentation_UC));
export let fdc3BasicJC1_2_0 = () => describe('fdc3.basicJC1_2.0', () => basicJC1(cc, fdc3, documentation_JC));
export let fdc3BasicRI1_2_0 = () =>
  describe('fdc3.basicRI1_2.0', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest.title);
    });
    basicRI1(fdc3, documentation_RI, Intent.aTestingIntent, ContextType.testContextX);
  });
export let fdc3BasicRI2_2_0 = () =>
  describe('fdc3.basicRI2_2.0', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest.title);
    });
    basicRI2(fdc3, documentation_RI, ContextType.testContextZ);
  });
