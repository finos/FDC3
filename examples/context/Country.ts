/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

interface Country extends Context {
    type: 'fdc3.country',
    name: string;
    id: {
        ISOALPHA2?: string;
        ISOALPHA3?: string;
    }
}