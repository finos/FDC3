/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

interface Position extends Context {
    type: 'fdc3.position';
    instrument: Instrument;
    holding: number;
}