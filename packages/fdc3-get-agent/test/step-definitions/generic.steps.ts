import { Given, Then, When } from 'quickpickle';
import { quickpickleWrapStep, setupGenericSteps } from '@robmoffat/standard-cucumber-steps';

setupGenericSteps({ Given, When, Then, wrapStep: quickpickleWrapStep });
