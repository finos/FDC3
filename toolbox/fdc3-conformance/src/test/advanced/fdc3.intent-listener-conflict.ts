import { Context, DesktopAgent, Listener, ResolveError, getAgent } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { APIDocumentation } from '../support/apiDocuments';

const documentation = '\r\nDocumentation: ' + APIDocumentation.addIntentListener + '\r\nCause';

const handler = (info: Context) => {
  console.log(`Intent listener triggered with result ${info}`);
};

/**
 * Conformance tests covering `ResolveError.IntentListenerConflict`.
 *
 * Adding an intent listener that conflicts with an existing listener for the same intent MUST be
 * rejected with `ResolveError.IntentListenerConflict`. A new listener conflicts with an existing
 * one for the same intent when either listener is unfiltered (added via `addIntentListener`, so it
 * handles all context types) or when their declared context types overlap. Filtered listeners for
 * the same intent with non-overlapping context types, and listeners for different intents, are
 * allowed.
 */
export default async () =>
  describe('fdc3.intentListenerConflict', () => {
    let fdc3: DesktopAgent;
    const listeners: Listener[] = [];

    beforeEach(async () => {
      fdc3 = await getAgent();
    });

    afterEach(async () => {
      // Tidy up any listeners added during the test so they don't conflict with later tests.
      for (const listener of listeners.splice(0)) {
        try {
          await listener.unsubscribe();
        } catch {
          /* ignore */
        }
      }
    });

    const intent = 'aTestingIntent1';

    const MultipleAddingOfTheSameIntentListenerCausesIntentListenerConflict =
      '(MultipleAddingOfTheSameIntentListenerCausesIntentListenerConflict) Adding a second unfiltered intent listener for the same intent MUST be rejected with ResolveError.IntentListenerConflict';
    it(MultipleAddingOfTheSameIntentListenerCausesIntentListenerConflict, async () => {
      listeners.push(await fdc3.addIntentListener(intent, handler));
      try {
        listeners.push(await fdc3.addIntentListener(intent, handler));
        assert.fail('Expected the second addIntentListener to be rejected but no error was thrown');
      } catch (ex) {
        expect(ex, documentation).to.have.property('message', ResolveError.IntentListenerConflict);
      }
    });

    const AddingFilteredIntentListenerWhenUnfilteredExistsCausesIntentListenerConflict =
      '(AddingFilteredIntentListenerWhenUnfilteredExistsCausesIntentListenerConflict) Adding a filtered intent listener when an unfiltered listener exists for the same intent MUST be rejected with ResolveError.IntentListenerConflict';
    it(AddingFilteredIntentListenerWhenUnfilteredExistsCausesIntentListenerConflict, async () => {
      listeners.push(await fdc3.addIntentListener(intent, handler));
      try {
        listeners.push(await fdc3.addIntentListenerWithContext(intent, 'fdc3.instrument', handler));
        assert.fail('Expected the addIntentListenerWithContext to be rejected but no error was thrown');
      } catch (ex) {
        expect(ex, documentation).to.have.property('message', ResolveError.IntentListenerConflict);
      }
    });

    const AddingUnfilteredIntentListenerWhenFilteredExistsCausesIntentListenerConflict =
      '(AddingUnfilteredIntentListenerWhenFilteredExistsCausesIntentListenerConflict) Adding an unfiltered intent listener when a filtered listener exists for the same intent MUST be rejected with ResolveError.IntentListenerConflict';
    it(AddingUnfilteredIntentListenerWhenFilteredExistsCausesIntentListenerConflict, async () => {
      listeners.push(await fdc3.addIntentListenerWithContext(intent, 'fdc3.instrument', handler));
      try {
        listeners.push(await fdc3.addIntentListener(intent, handler));
        assert.fail('Expected the addIntentListener to be rejected but no error was thrown');
      } catch (ex) {
        expect(ex, documentation).to.have.property('message', ResolveError.IntentListenerConflict);
      }
    });

    const AddingFilteredIntentListenerWithOverlappingContextCausesIntentListenerConflict =
      '(AddingFilteredIntentListenerWithOverlappingContextCausesIntentListenerConflict) Adding a filtered intent listener with an overlapping context type for the same intent MUST be rejected with ResolveError.IntentListenerConflict';
    it(AddingFilteredIntentListenerWithOverlappingContextCausesIntentListenerConflict, async () => {
      listeners.push(await fdc3.addIntentListenerWithContext(intent, ['fdc3.instrument', 'fdc3.contact'], handler));
      try {
        listeners.push(await fdc3.addIntentListenerWithContext(intent, ['fdc3.contact', 'fdc3.order'], handler));
        assert.fail('Expected the conflicting addIntentListenerWithContext to be rejected but no error was thrown');
      } catch (ex) {
        expect(ex, documentation).to.have.property('message', ResolveError.IntentListenerConflict);
      }
    });

    const AddingFilteredIntentListenersWithDifferentContextsIsAllowed =
      '(AddingFilteredIntentListenersWithDifferentContextsIsAllowed) Adding filtered intent listeners for the same intent with non-overlapping context types MUST be allowed';
    it(AddingFilteredIntentListenersWithDifferentContextsIsAllowed, async () => {
      try {
        listeners.push(await fdc3.addIntentListenerWithContext(intent, 'fdc3.instrument', handler));
        listeners.push(await fdc3.addIntentListenerWithContext(intent, 'fdc3.order', handler));
      } catch (ex) {
        assert.fail(
          `Expected non-overlapping filtered intent listeners to be allowed but an error was thrown: ${
            (ex as Error)?.message
          }${documentation}`
        );
      }
      expect(listeners.length, documentation).to.equal(2);
    });

    const AddingIntentListenersForDifferentIntentsIsAllowed =
      '(AddingIntentListenersForDifferentIntentsIsAllowed) Adding intent listeners for different intents MUST be allowed';
    it(AddingIntentListenersForDifferentIntentsIsAllowed, async () => {
      try {
        listeners.push(await fdc3.addIntentListener(intent, handler));
        listeners.push(await fdc3.addIntentListener(intent + '2', handler));
      } catch (ex) {
        assert.fail(
          `Expected intent listeners for different intents to be allowed but an error was thrown: ${
            (ex as Error)?.message
          }${documentation}`
        );
      }
      expect(listeners.length, documentation).to.equal(2);
    });

    const MultipleAddingOfTheSameIntentListenerAfterUnsubscribe =
      '(MultipleAddingOfTheSameIntentListenerAfterUnsubscribe) An intent listener can be re-added once the conflicting listener is removed with unsubscribe';
    it(MultipleAddingOfTheSameIntentListenerAfterUnsubscribe, async () => {
      const first = await fdc3.addIntentListener(intent, handler);
      await first.unsubscribe();
      try {
        listeners.push(await fdc3.addIntentListener(intent, handler));
      } catch (ex) {
        assert.fail(
          `Expected the intent listener to be re-addable after unsubscribe but an error was thrown: ${
            (ex as Error)?.message
          }${documentation}`
        );
      }
      expect(listeners.length, documentation).to.equal(1);
    });
  });
