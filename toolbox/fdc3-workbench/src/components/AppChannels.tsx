/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { FormEvent, useState } from 'react';
import { Button, Typography, Grid, TextField, Box } from '@mui/material';
import { observer } from 'mobx-react';
import contextStore from '../store/ContextStore';
import appChannelStore from '../store/AppChannelStore';
import { ChannelField } from './ChannelField';

const classes = {
  root: {
    flexGrow: 1,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    mt: 1,
    '& > *': {
      m: 1,
      ml: '0px',
    },
  },
  contextType: {
    flexGrow: 1,
    minWidth: '190px',
  },
  controls: {
    '& > *:first-of-type': {
      marginLeft: 0,
    },
    '& > *': {
      mr: 1,
    },
    '& > *:last-child': {
      marginRight: 0,
    },
    '& .MuiIconButton-sizeSmall': {
      padding: '6px 0px 6px 0px',
    },
    '& > a': {
      display: 'flex',
      padding: '6px 0px 6px 0px',
    },
  },
  rightAlign: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  spread: {
    flexDirection: 'row',
    '& > *:first-of-type': {
      paddingLeft: '0px',
    },
  },
  textField: {
    width: '100%',
    '& input': {
      height: '29px',
      padding: '6px',
    },
  },
  h4: {
    fontSize: '22px',
  },
  h6: {
    fontSize: '14px',
  },
  field: {
    flexGrow: 1,
    mr: 1,
    minWidth: '190px',
  },
  border: {
    height: '1px',
    width: '100%',
    backgroundColor: '#acb2c0',
    marginTop: '24px',
    marginBottom: '16px',
  },
  rightPadding: {
    pr: 0.5,
  },
};

interface ListenerOptionType {
  title: string;
  value: string;
  type: string | undefined;
}

export const AppChannels = observer(({ handleTabChange }: { handleTabChange: any }) => {
  const [currentAppChannelId, setCurrentAppChannelId] = useState<string>('');
  const contextListenersOptionsAll: ListenerOptionType[] = contextStore.contextsList.map(({ id, template }) => {
    return {
      title: id,
      value: id,
      type: template?.type,
    };
  });
  contextListenersOptionsAll.unshift({
    title: 'All',
    value: 'all',
    type: 'All',
  });

  const handleGetorCreateChannel = (e: FormEvent | null = null) => {
    e?.preventDefault();
    if (currentAppChannelId) {
      let foundChannel = appChannelStore.appChannelsList.find(
        currentChannel => currentChannel.id === currentAppChannelId
      );
      if (!foundChannel) {
        appChannelStore.getOrCreateChannel(currentAppChannelId);
      }
      setCurrentAppChannelId('');
    }
  };

  const handleChannelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentAppChannelId(event.target.value as string);
  };

  return (
    <Box sx={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Get Channel</Typography>
      </Grid>

      <Box component="form" sx={classes.form} noValidate autoComplete="off" onSubmit={e => handleGetorCreateChannel(e)}>
        <Grid container direction="row" spacing={1}>
          <Grid item sx={classes.field}>
            <TextField
              fullWidth
              variant="outlined"
              label="Channel Name"
              type="text"
              size="small"
              onChange={handleChannelChange}
              value={currentAppChannelId}
            />
          </Grid>
          <Grid item sx={classes.controls}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGetorCreateChannel}
              disabled={!currentAppChannelId}
            >
              Get or Create Channel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={classes.border}></Box>
      <ChannelField handleTabChange={handleTabChange} channelsList={appChannelStore.appChannelsList} />
    </Box>
  );
});
