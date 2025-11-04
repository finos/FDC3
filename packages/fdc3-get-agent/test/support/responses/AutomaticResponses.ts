import { InstanceID } from '@finos/fdc3-web-impl';
import { MockFDC3Server } from '../MockFDC3Server';

export interface AutomaticResponse {
  filter: (t: string) => boolean;
  action: (input: object, m: MockFDC3Server, from: InstanceID) => Promise<void>;
}
