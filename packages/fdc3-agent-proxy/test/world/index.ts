import { TestMessaging } from '../support/TestMessaging.js';
import { QuickPickleWorld, QuickPickleWorldInterface } from 'quickpickle';

export interface CustomWorldInterface extends QuickPickleWorldInterface {
  props: Record<string, any>;
  messaging: TestMessaging | null;
  log: (message: string) => void;
}

export class CustomWorld extends QuickPickleWorld implements CustomWorldInterface {
  props: Record<string, any> = {};
  messaging: TestMessaging | null = null;

  log(message: string): void {
    console.log(message);
  }
}
