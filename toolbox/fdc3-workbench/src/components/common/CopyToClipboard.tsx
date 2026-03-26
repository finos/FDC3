/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { runInAction } from 'mobx';
import systemLogStore from '../../store/SystemLogStore.js';

export const copyToClipboard = (text: string, name: string) => () => {
  navigator.clipboard.writeText(text);
  runInAction(() => {
    systemLogStore.addLog({
      name: 'copyToClipboard',
      type: 'info',
      value: name,
      variant: 'text',
    });
  });
};
