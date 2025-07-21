import { World, setWorldConstructor } from '@cucumber/cucumber';

export class CustomWorld extends World {
  props: Record<string, any> = {};
}

setWorldConstructor(CustomWorld);
