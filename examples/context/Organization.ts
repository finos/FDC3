/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

interface Organization extends Context {
    type: 'fdc3.organization',
    name: string;
    id: {
        LEI?: string;
        PERMID?: string;
    }
}