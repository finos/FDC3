import { Given, When, Then } from 'quickpickle';
import { expect } from 'vitest';
import { CustomWorld } from '../world/index.js';
import { DefaultAppSupport, DomTitleWatcher, PageTitleSupport, TitleWatcher } from '../../src/index.js';
import { AppSupport } from '../../src/apps/AppSupport.js';

/**
 * Controllable TitleWatcher used in tests in place of the DOM-based watcher.
 */
class FakeTitleWatcher implements TitleWatcher {
  private title: string | null;
  private listener: (() => void) | null = null;

  constructor(title: string | null) {
    this.title = title;
  }

  getTitle(): string | null {
    return this.title;
  }

  start(listener: () => void): void {
    this.listener = listener;
  }

  stop(): void {
    this.listener = null;
  }

  setTitle(title: string | null): void {
    this.title = title;
    this.listener?.();
  }
}

function countUpdateInstanceMetadataPosts(world: CustomWorld): number {
  return world.messaging!.allPosts.filter(p => p.type === 'updateInstanceMetadataRequest').length;
}

Given('a page title watcher with title {string}', (world: CustomWorld, title: string) => {
  world.props['titleWatcher'] = new FakeTitleWatcher(title);
});

Given('page title support is connected', async (world: CustomWorld) => {
  const as = new DefaultAppSupport(world.messaging!, 1500, 3000);
  const support = new PageTitleSupport(as, world.props['titleWatcher']);
  world.props['pageTitleSupport'] = support;
  await support.connect();
});

When('page title support is disconnected', async (world: CustomWorld) => {
  await (world.props['pageTitleSupport'] as PageTitleSupport).disconnect();
});

When('page title support is connected to a failing agent', async (world: CustomWorld) => {
  const failingAppSupport = {
    updateInstanceMetadata: () => Promise.reject(new Error('agent unavailable')),
  } as unknown as AppSupport;
  const support = new PageTitleSupport(failingAppSupport, world.props['titleWatcher']);
  world.props['pageTitleSupport'] = support;
  await support.connect();
});

When('the page title changes to {string}', (world: CustomWorld, title: string) => {
  (world.props['titleWatcher'] as FakeTitleWatcher).setTitle(title);
});

Then('the default DOM title watcher reports no title', () => {
  const watcher = new DomTitleWatcher();
  expect(watcher.getTitle()).toBe(null);
  // stop() should be a safe no-op when nothing is being watched.
  watcher.stop();
});

Then('messaging will have no updateInstanceMetadata posts', (world: CustomWorld) => {
  expect(countUpdateInstanceMetadataPosts(world)).toBe(0);
});

Then('messaging will have {int} updateInstanceMetadata posts', (world: CustomWorld, count: number) => {
  expect(countUpdateInstanceMetadataPosts(world)).toBe(count);
});
