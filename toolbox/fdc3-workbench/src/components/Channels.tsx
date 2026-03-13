/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Tooltip,
  Grid,
  Link,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import channelStore from '../store/ChannelStore.js';
import { codeExamples } from '../fixtures/codeExamples.js';
import { copyToClipboard } from './common/CopyToClipboard.js';
import { openApiDocsLink } from '../fixtures/openApiDocs.js';
import { ContextLinking } from './ContextLinking.js';
import contextStore from '../store/ContextStore.js';
import { ContextTemplates } from './ContextTemplates.js';
import { ContextType } from '../utility/Fdc3Api.js';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      '& > *': {
        margin: theme.spacing(1),
      },
      '& > *:first-child': {
        marginLeft: 0,
        paddingLeft: 0,
      },
      '& > * > *:first-child': {
        marginLeft: 0,
        paddingLeft: 0,
      },
    },
    channelsSelect: {
      width: '100%',
      marginRight: theme.spacing(1),
    },
    controls: {
      '& .MuiIconButton-sizeSmall': {
        padding: '6px 0px 6px 0px',
      },
      '& > a': {
        display: 'flex',
        padding: '6px 0px 6px 0px',
      },
    },
    border: {
      height: '1px',
      width: '100%',
      backgroundColor: '#acb2c0',
      marginTop: '24px',
      marginBottom: '16px',
    },
    bottomAlignChildren: {
      display: 'flex',
      alignItems: 'end',
    },
    dropDown: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
      minWidth: '190px',
    },
    rightAlign: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  })
);

export const Channels = observer(({ handleTabChange }: { handleTabChange: any }) => {
  const classes = useStyles();
  const [channelId, setChannelId] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [broadcastContext, setBroadcastContext] = useState<ContextType | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setChannelId(event.target.value as string);
    setIsError(false);
  };

  const handleJoinUserChannel = () => {
    if (channelId) {
      channelStore.joinUserChannel(channelId);
      setChannelId('');
    } else {
      setIsError(true);
    }
  };

  const handleLeaveUserChannel = () => {
    channelStore.leaveUserChannel();
  };

  const handleRefreshUserChannel = () => {
    channelStore.getCurrentUserChannel();
  };

  const handleBroadcast = () => {
    if (broadcastContext) contextStore.broadcast(broadcastContext);
  };

  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Current channel</Typography>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        className={`${classes.controls} ${classes.rightAlign}`}
      >
        <Grid item className={classes.dropDown}>
          <Typography variant="body1">{channelStore.currentUserChannel?.id ?? 'None'}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item className={classes.controls}>
              <Button variant="contained" color="primary" onClick={handleRefreshUserChannel}>
                Refresh
              </Button>
            </Grid>
            <Grid item className={classes.controls}>
              <Button variant="contained" color="primary" onClick={handleLeaveUserChannel}>
                Leave
              </Button>
            </Grid>
            <Grid item className={classes.controls}>
              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={copyToClipboard(codeExamples.getCurrentUserChannel, 'getCurrentUserChannel')}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item className={classes.controls}>
              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#getcurrentchannel"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div className={classes.border}></div>

      <Grid item xs={12}>
        <Typography variant="h5">Join user channels</Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        className={`${classes.controls} ${classes.rightAlign}`}
      >
        <Grid item className={classes.dropDown}>
          <FormControl variant="outlined" className={classes.channelsSelect} size="small" error={isError}>
            <InputLabel id="channel">Channel</InputLabel>
            <Select
              labelId="channel"
              id="channel-select"
              value={channelId ?? ''}
              onChange={handleSelectChange}
              label="User Channel"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              {!channelStore.userChannels.length && (
                <MenuItem value="" disabled>
                  No channels received
                </MenuItem>
              )}
              {channelStore.userChannels.length && <MenuItem value="" style={{ height: '0', padding: '0' }} />}
              {channelStore.userChannels.length &&
                channelStore.userChannels.map(({ id }) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
            </Select>
            {isError && <FormHelperText>Select channel from list</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3} className={classes.bottomAlignChildren}>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item className={classes.controls}>
              <Button variant="contained" color="primary" onClick={handleJoinUserChannel}>
                Join
              </Button>
            </Grid>
            <Grid item className={classes.controls}>
              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={copyToClipboard(codeExamples.userChannels, 'joinUserChannel')}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item className={classes.controls}>
              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#joinuserchannel"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div className={classes.border}></div>

      <Grid item xs={12}>
        <Typography variant="h5">Broadcast context</Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        className={`${classes.controls} ${classes.rightAlign}`}
      >
        <Grid item className={classes.dropDown}>
          <ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setBroadcastContext} />
        </Grid>
        <Grid item className={classes.bottomAlignChildren}>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item className={classes.controls}>
              <Button disabled={!broadcastContext} variant="contained" color="primary" onClick={handleBroadcast}>
                Broadcast
              </Button>
            </Grid>
            <Grid item className={classes.controls}>
              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={copyToClipboard(codeExamples.broadcast, 'broadcast')}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item className={classes.controls}>
              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#broadcast"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>
        </Grid>

        <div className={classes.border}></div>

        <ContextLinking />
      </Grid>
    </div>
  );
});
