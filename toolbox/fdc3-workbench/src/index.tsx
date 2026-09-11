/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

//make sure URL ends with trailing / for resolution of image paths
if (!window.location.href.endsWith('/')) {
  window.location.href = `${window.location.href}/`;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
