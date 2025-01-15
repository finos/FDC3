import { AbstractFDC3Logger } from '@finos/fdc3-agent-proxy';

export class Logger extends AbstractFDC3Logger {
  static override get prefix(): string {
    return 'FDC3 getAgent: ';
  }
}
