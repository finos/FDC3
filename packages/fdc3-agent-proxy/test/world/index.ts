import { setWorldConstructor } from '@cucumber/cucumber';
import { TestMessaging } from '../support/TestMessaging';
import { PropsWorld } from '@finos/testing';

export class CustomWorld extends PropsWorld {
  messaging: TestMessaging | null = null;
}

setWorldConstructor(CustomWorld);
