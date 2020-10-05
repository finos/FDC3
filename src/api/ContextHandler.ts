/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '../context/ContextTypes';

export type ContextHandler = (context: Context) => void;
