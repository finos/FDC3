import { Given, Then, When } from 'quickpickle';
import { quickpickleWrapStep, setupGenericSteps } from '@finos/cucumber-testing-steps';

setupGenericSteps({ Given, When, Then, wrapStep: quickpickleWrapStep });
