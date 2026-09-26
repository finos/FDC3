import { DemoServerContext } from './DemoServerContext.js';

/** Install the test-only cleanup message used by the non-FDC3 Open App B fixture. */
export function installConformanceFixtureCleanup(sc: DemoServerContext): void {
  window.addEventListener('message', event => {
    const data = event.data as { type?: unknown; requestId?: unknown } | null;
    if (data?.type !== 'fdc3-conformance-close-open-b' || typeof data.requestId !== 'string') return;

    if (!sc.closeConformanceOpenBFrame(event.source as Window, event.origin)) {
      console.warn('Rejected non-FDC3 Open App B frame cleanup request from an unknown app window');
    }
  });
}
