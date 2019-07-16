/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

interface Portfolio extends Context {
    type: 'fdc3.portfolio',
    id: {
        portfolioId?: string;
    },
    positions: Position[]
}
