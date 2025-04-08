import { Context } from '@finos/fdc3';

import { OpenControl } from '../../common/control/open-control';
import { OpenControl2_0 } from '../../v2.0/support/open-support-2.0';

export class OpenControl2_1 extends OpenControl2_0 implements OpenControl<Context> {}
