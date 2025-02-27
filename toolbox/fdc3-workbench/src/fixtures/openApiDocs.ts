/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import React from 'react';

export const openApiDocsLink = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  const href = event?.currentTarget?.getAttribute('href');
  if (href) {
    window.open(href, 'FDC3APIDocs');
  }
  return false;
};
