import { DataTable, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index.js';
import expect from 'expect';
import { setupGenericSteps, matchData } from '@finos/testing';

Then('messaging will have outgoing posts', function (this: CustomWorld, dt: DataTable) {
  // just take the last few posts and match those
  const matching = dt.rows().length;
  let toUse = this.sc?.postedMessages;
  if (toUse.length > matching) {
    toUse = toUse.slice(toUse.length - matching, toUse.length);
  }
  matchData(this, toUse, dt);
});

Then('messaging will have {int} posts', function (this: CustomWorld, count: number) {
  expect(this.sc.postedMessages.length).toEqual(count);
});

setupGenericSteps();
