/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { FormEvent, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Typography, Grid, TextField } from '@material-ui/core';
import { observer } from 'mobx-react';
import contextStore from '../store/ContextStore.js';
import appChannelStore from '../store/AppChannelStore.js';
import { ChannelField } from './ChannelField.js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      marginTop: theme.spacing(1),
      '& > *': {
        margin: theme.spacing(1),
        marginLeft: '0px',
      },
    },
    contextType: {
      flexGrow: 1,
      minWidth: '190px',
    },
    controls: {
      '& > *:first-child': {
        marginLeft: 0,
      },
      '& > *': {
        marginRight: theme.spacing(1),
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
      '& > *:first-child': {
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
      marginRight: theme.spacing(1),
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
      paddingRight: theme.spacing(0.5),
    },
  })
);

interface ListenerOptionType {
  title: string;
  value: string;
  type: string | undefined;
}

export const AppChannels = observer(({ handleTabChange }: { handleTabChange: any }) => {
  const classes = useStyles();
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
    <div className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Get Channel</Typography>
      </Grid>

      <form className={classes.form} noValidate autoComplete="off" onSubmit={e => handleGetorCreateChannel(e)}>
        <Grid container direction="row" spacing={1}>
          <Grid item className={classes.field}>
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
          <Grid item className={classes.controls}>
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
      </form>
      <div className={classes.border}></div>
      <ChannelField handleTabChange={handleTabChange} channelsList={appChannelStore.appChannelsList} />
    </div>
  );
});
