/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TextField, Box } from '@mui/material';
import { ChannelField } from './ChannelField.js';
import appChannelStore, { Fdc3ChannelRecord } from '../store/AppChannelStore.js';
import privateChannelStore from '../store/PrivateChannelStore.js';
import { IntentResolution } from '../utility/Fdc3Api.js';
import { AppIdentifier, Channel, PrivateChannel } from '@finos/fdc3';

const classes = {
  textField: {
    mt: 2,
    width: '100%',
  },
  input: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
};

export const IntentResolutionField = observer(
  ({
    data,
    handleTabChange,
  }: {
    data: IntentResolution;
    handleTabChange: (event: React.ChangeEvent<object> | null, newValue: number, contextName?: string) => void;
  }) => {
    const [resolutionResult, setResolutionResult] = useState<string | null>('pending...');
    const [isChannel, setIsChannel] = useState(false);
    const [privateChannel, setPrivateChannel] = useState(false);
    const [channelsList, setChannelsList] = useState<Fdc3ChannelRecord[]>([]);
    const [channelName, setChannelName] = useState<string>('');

    const source = data.source as AppIdentifier;
    const results = `appId: ${source.appId}\ninstanceId: ${source.instanceId}`;

    const displayIntentResults = async () => {
      try {
        if (data.getResult) {
          const result = await data.getResult();

          if (result && typeof result === 'object' && 'broadcast' in result) {
            const channel = result as Channel;
            setResolutionResult('');

            if (channel.type === 'app') {
              await appChannelStore.getOrCreateChannel(channel.id);
              setChannelName(channel.id);
              setIsChannel(true);
              setChannelsList(appChannelStore.appChannelsList);
            }

            if (channel.type === 'private') {
              setIsChannel(true);
              setPrivateChannel(true);
              setChannelsList([{ id: channel.id, channel: channel }]);
              privateChannelStore.addChannelListener(channel as PrivateChannel, 'all');
            }
            setResolutionResult(null);
          } else if (result) {
            setResolutionResult(JSON.stringify(result, null, 2));
          } else {
            setResolutionResult('<void>');
          }
        }
      } catch (error) {
        if (`${error}`.includes('NoResultReturned')) setResolutionResult('<void>');
        else setResolutionResult(`${error}`);
        console.error(`${source.appId} returned a result error: ${error}`);
      }
    };

    useEffect(() => {
      displayIntentResults();
    }, []);

    return (
      <Box>
        <TextField
          disabled
          label={'Resolved By'}
          InputLabelProps={{
            shrink: true,
          }}
          contentEditable={false}
          fullWidth
          multiline
          variant="outlined"
          size="small"
          value={results}
          InputProps={{
            sx: classes.input,
          }}
        />
        {resolutionResult && (
          <TextField
            disabled
            label={'Results'}
            InputLabelProps={{
              shrink: true,
            }}
            contentEditable={false}
            fullWidth
            multiline
            variant="outlined"
            size="small"
            value={resolutionResult}
            sx={classes.textField}
            InputProps={{
              sx: classes.input,
            }}
          />
        )}
        {isChannel && (
          <ChannelField
            handleTabChange={handleTabChange}
            channelsList={channelsList}
            isPrivateChannel={privateChannel}
            channelName={channelName}
          />
        )}
      </Box>
    );
  }
);
