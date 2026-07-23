/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, action } from 'mobx';
import systemLogStore from './SystemLogStore.js';
import { getWorkbenchAgent } from '../utility/Fdc3Api.js';

class InfoStore {
  constructor() {
    makeObservable(this, {
      getInfo: action,
      updateTitle: action,
      updateInstanceMetadata: action,
    });
  }

  async getInfo() {
    try {
      const agent = await getWorkbenchAgent();
      const info = await agent.getInfo();
      systemLogStore.addLog({
        name: 'getInfo',
        type: 'success',
        variant: 'code',
        body: JSON.stringify(info, null, 4),
      });
    } catch (e) {
      systemLogStore.addLog({
        name: 'getInfo',
        type: 'error',
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  /**
   * Updates the document title. When the workbench is connected via getAgent with the default
   * page-title syncing enabled, this triggers an automatic updateInstanceMetadata() call.
   */
  updateTitle(title: string) {
    document.title = title;
    systemLogStore.addLog({
      name: 'updateTitle',
      type: 'success',
      value: title,
      variant: 'text',
    });
  }

  /**
   * Directly calls fdc3.updateInstanceMetadata() with the provided title.
   */
  async updateInstanceMetadata(title: string) {
    try {
      const agent = await getWorkbenchAgent();
      await agent.updateInstanceMetadata({ title });
      systemLogStore.addLog({
        name: 'updateInstanceMetadata',
        type: 'success',
        value: title,
        variant: 'text',
      });
    } catch (e) {
      systemLogStore.addLog({
        name: 'updateInstanceMetadata',
        type: 'error',
        value: title,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }
}

const infoStore = new InfoStore();

export default infoStore;
