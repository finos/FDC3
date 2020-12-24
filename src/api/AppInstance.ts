/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2020 FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '../context/ContextTypes';
import { ContextHandler } from './ContextHandler';
import { Listener } from './Listener';

/**
 * An interface that relates an instance of an app to other apps
 */
export interface AppInstance {
  readonly instanceId: string;
  readonly status: AppInstanceStatus;

  /**
   * Adds a listener for incoming contexts whenever a broadcast happens from this instance.
   */
  addContextListener(handler: ContextHandler): Listener;

  /**
   * Adds a listener for incoming contexts of the specified context type whenever a broadcast happens from this instance.
   */
  addContextListener(contextType: string, handler: ContextHandler): Listener;

  /**
   * Sends the given context to this app instance.
   * The context will be recieved on the applicable contextListener for the instance.
   */
  broadcast(context: Context): void;

  /**
   *
   */
  onStatusChanged(
    handler: (newVal: AppInstanceStatus, oldVal: AppInstanceStatus) => {}
  ): void;
}

export enum AppInstanceStatus {
  Ready = 'ready',
  Loading = 'loading',
  Unregistered = 'unregistered',
}
