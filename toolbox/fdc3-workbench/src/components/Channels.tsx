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
  SelectChangeEvent,
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import channelStore from '../store/ChannelStore';
import { codeExamples } from '../fixtures/codeExamples';
import { copyToClipboard } from './common/CopyToClipboard';
import { openApiDocsLink } from '../fixtures/openApiDocs';
import { ContextLinking } from './ContextLinking';
import contextStore from '../store/ContextStore';
import { ContextTemplates } from './ContextTemplates';
import { ContextType } from '../utility/Fdc3Api';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const styles = {
  root: {
    flexGrow: 1,
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    mt: 1,
    '& > *': {
      m: 1,
    },
    '& > *:first-of-type': {
      marginLeft: 0,
      paddingLeft: 0,
    },
    '& > * > *:first-of-type': {
      marginLeft: 0,
      paddingLeft: 0,
    },
  },
  channelsSelect: {
    width: '100%',
    mr: 1,
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
    mr: 1,
    minWidth: '190px',
  },
  rightAlign: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
} as const;

export const Channels = observer(({ handleTabChange }: { handleTabChange: any }) => {
  const [channelId, setChannelId] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [broadcastContext, setBroadcastContext] = useState<ContextType | null>(null);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setChannelId(event.target.value);
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
    <div style={styles.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Current channel</Typography>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        sx={{ ...styles.controls, ...styles.rightAlign }}
      >
        <Grid item sx={styles.dropDown}>
          <Typography variant="body1">{channelStore.currentUserChannel?.id ?? 'None'}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item sx={styles.controls}>
              <Button variant="contained" color="primary" onClick={handleRefreshUserChannel}>
                Refresh
              </Button>
            </Grid>
            <Grid item sx={styles.controls}>
              <Button variant="contained" color="primary" onClick={handleLeaveUserChannel}>
                Leave
              </Button>
            </Grid>
            <Grid item sx={styles.controls}>
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
            <Grid item sx={styles.controls}>
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

      <div style={styles.border}></div>

      <Grid item xs={12}>
        <Typography variant="h5">Join user channels</Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        sx={{ ...styles.controls, ...styles.rightAlign }}
      >
        <Grid item sx={styles.dropDown}>
          <FormControl variant="outlined" sx={styles.channelsSelect} size="small" error={isError}>
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
        <Grid item xs={12} sm={3} sx={styles.bottomAlignChildren}>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item sx={styles.controls}>
              <Button variant="contained" color="primary" onClick={handleJoinUserChannel}>
                Join
              </Button>
            </Grid>
            <Grid item sx={styles.controls}>
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
            <Grid item sx={styles.controls}>
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

      <div style={styles.border}></div>

      <Grid item xs={12}>
        <Typography variant="h5">Broadcast context</Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        sx={{ ...styles.controls, ...styles.rightAlign }}
      >
        <Grid item sx={styles.dropDown}>
          <ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setBroadcastContext} />
        </Grid>
        <Grid item sx={styles.bottomAlignChildren}>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item sx={styles.controls}>
              <Button disabled={!broadcastContext} variant="contained" color="primary" onClick={handleBroadcast}>
                Broadcast
              </Button>
            </Grid>
            <Grid item sx={styles.controls}>
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
            <Grid item sx={styles.controls}>
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

        <div style={styles.border}></div>

        <ContextLinking />
      </Grid>
    </div>
  );
});
