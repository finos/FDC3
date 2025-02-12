import { World } from '@cucumber/cucumber';

export class PropsWorld extends World {
  props: Record<string, any> = {};
}
