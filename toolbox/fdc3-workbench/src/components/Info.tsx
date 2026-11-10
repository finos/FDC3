/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import infoStore from '../store/InfoStore.js';

const styles = {
  root: {
    flexGrow: 1,
  },
  controls: {
    mt: 2,
  },
  border: {
    borderBottom: '1px solid #acb2c0',
    marginTop: '20px',
    marginBottom: '20px',
  },
} as const;

export const Info = observer(() => {
  const [title, setTitle] = useState<string>('');

  const handleGetInfo = () => {
    infoStore.getInfo();
  };

  const handleUpdateTitle = () => {
    infoStore.updateTitle(title);
  };

  const handleUpdateMetadata = () => {
    infoStore.updateInstanceMetadata(title);
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

      <div style={styles.border}></div>

      <Grid item xs={12}>
        <Typography variant="h5">Instance Metadata</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Set a title for this instance. "Update Title" changes the document title (which triggers an automatic{' '}
          <code>updateInstanceMetadata()</code> call), while "Update Metadata" calls{' '}
          <code>fdc3.updateInstanceMetadata()</code> directly.
        </Typography>
      </Grid>
      <Grid container direction="row" spacing={1} alignItems="center" sx={styles.controls}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Instance title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" disabled={!title} onClick={handleUpdateTitle}>
            Update Title
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" disabled={!title} onClick={handleUpdateMetadata}>
            Update Metadata
          </Button>
        </Grid>
      </Grid>
    </div>
  );
});
