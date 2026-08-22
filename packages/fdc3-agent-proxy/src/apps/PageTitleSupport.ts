/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Connectable } from '@finos/fdc3-standard';
import { AppSupport } from './AppSupport.js';
import { Logger } from '../util/Logger.js';

/**
 * Abstraction over the source of the page title and notifications of changes to
 * it. This seam allows the title-watching behaviour to be tested without a DOM.
 */
export interface TitleWatcher {
  /** Returns the current page title, or null if it cannot be determined. */
  getTitle(): string | null;

  /** Begins watching for title changes, invoking `listener` whenever the title
   *  may have changed. */
  start(listener: () => void): void;

  /** Stops watching for title changes. */
  stop(): void;
}

/**
 * Default `TitleWatcher` implementation that reads `document.title` and uses a
 * `MutationObserver` on the `<title>` element to detect changes. There is no
 * dedicated DOM event for title changes, so a MutationObserver is used instead.
 *
 * If the DOM is not available (e.g. in a non-browser environment) this watcher
 * becomes a no-op.
 */
export class DomTitleWatcher implements TitleWatcher {
  private observer: MutationObserver | null = null;

  getTitle(): string | null {
    if (typeof globalThis.document === 'undefined') {
      return null;
    }
    /* v8 ignore next */
    return globalThis.document.title ?? null;
  }

  /* v8 ignore start -- DOM adapter, exercised in a real browser only */
  start(listener: () => void): void {
    if (typeof globalThis.document === 'undefined' || typeof globalThis.MutationObserver === 'undefined') {
      return;
    }

    const target =
      globalThis.document.querySelector('title') ??
      globalThis.document.head ??
      globalThis.document.documentElement ??
      null;

    if (!target) {
      return;
    }

    this.observer = new globalThis.MutationObserver(() => listener());
    this.observer.observe(target, { subtree: true, childList: true, characterData: true });
  }
  /* v8 ignore stop */

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}

/**
 * Connectable that keeps the Desktop Agent informed of the proxy's page title by
 * sending a `updateInstanceMetadata` request whenever it changes. An initial
 * request is sent on connection. Empty (or whitespace-only) titles are never
 * sent, and duplicate titles are suppressed.
 */
export class PageTitleSupport implements Connectable {
  private lastSentTitle: string | null = null;

  constructor(
    private readonly appSupport: AppSupport,
    private readonly watcher: TitleWatcher = new DomTitleWatcher()
  ) {}

  async connect(): Promise<void> {
    this.watcher.start(() => this.sendTitle());
    await this.sendTitle();
  }

  async disconnect(): Promise<void> {
    this.watcher.stop();
  }

  private async sendTitle(): Promise<void> {
    const title = this.watcher.getTitle()?.trim();

    // Never send empty/whitespace-only titles.
    if (!title) {
      return;
    }

    // Suppress duplicate updates.
    if (title === this.lastSentTitle) {
      return;
    }

    this.lastSentTitle = title;

    try {
      await this.appSupport.updateInstanceMetadata({ title });
    } catch (e) {
      Logger.warn('PageTitleSupport: failed to sync page title to Desktop Agent', e);
    }
  }
}
