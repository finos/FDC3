/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

interface Instrument extends Context {
    type: 'fdc3.instrument';
    name: string;
    id: {
        ticker?: string;
        ISIN?: string;
        CUSIP?: string;
        SEDOL?: string;
        RIC?: string;
        BBG?: string;
        PERMID?: string;
        FIGI?: string;
        FDS_ID?: string;
    }
}