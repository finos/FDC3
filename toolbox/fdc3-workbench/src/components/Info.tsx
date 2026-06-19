/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { observer } from 'mobx-react';
import { Button, Grid, Typography } from '@mui/material';
import infoStore from '../store/InfoStore.js';

const styles = {
  root: {
    flexGrow: 1,
  },
  controls: {
    mt: 2,
  },
} as const;

export const Info = observer(() => {
  const handleGetInfo = () => {
    infoStore.getInfo();
  };

  return (
    <div style={styles.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Implementation Metadata</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Call <code>fdc3.getInfo()</code> to retrieve metadata about the FDC3 Desktop Agent implementation. The result
          is displayed in the System Log.
        </Typography>
      </Grid>
      <Grid item xs={12} sx={styles.controls}>
        <Button variant="contained" color="primary" onClick={handleGetInfo}>
          Get Info
        </Button>
      </Grid>
    </div>
  );
});
