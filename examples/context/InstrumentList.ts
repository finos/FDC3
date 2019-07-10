/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

interface InstrumentList extends Context {
    type: 'fdc3.instrumentList';
    instruments: Instrument[];
}