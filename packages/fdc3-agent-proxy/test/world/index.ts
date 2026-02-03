import { setWorldConstructor } from '@cucumber/cucumber';
import { TestMessaging } from '../support/TestMessaging';
import { QuickPickleWorld } from 'quickpickle';

export class CustomWorld extends QuickPickleWorld {
  props: Record<string, any>;

  messaging: TestMessaging | null = null;
  log(message: string): void {
    console.log(message);
  }
}
