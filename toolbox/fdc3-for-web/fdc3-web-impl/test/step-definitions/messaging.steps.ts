import { Then } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index.js';
import { expect } from 'vitest';
import { matchData } from '@finos/testing';

Then('messaging will have outgoing posts', (world: CustomWorld, dt: DataTable) => {
  // just take the last few posts and match those
  const matching = dt.rows().length;
  let toUse = world.sc?.postedMessages;
  if (toUse.length > matching) {
    toUse = toUse.slice(toUse.length - matching, toUse.length);
  }
  matchData(world, toUse, dt);
});

Then('messaging will have {int} posts', (world: CustomWorld, count: number) => {
  expect(world.sc.postedMessages.length).toEqual(count);
});
