/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Given } from 'quickpickle';
import type { PropsWorldLike } from '@finos/cucumber-testing-steps';
import { loadSchemasIntoWorld } from './loadSchemas.js';

export function setupSchemaSteps(): void {
  Given('schemas loaded', async (world: PropsWorldLike) => {
    await loadSchemasIntoWorld(world);
  });
}
