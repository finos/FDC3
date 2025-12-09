/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TextField, Box } from '@mui/material';
import { ChannelField } from './ChannelField';
import appChannelStore from '../store/AppChannelStore';
import privateChannelStore from '../store/PrivateChannelStore';

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

export const IntentResolutionField = observer(({ data, handleTabChange }: { data: any; handleTabChange: any }) => {
  const [resolutionResult, setResolutionResult] = useState<any>('pending...');
  const [isChannel, setIsChannel] = useState(false);
  const [privateChannel, setPrivateChannel] = useState(false);
  const [channelsList, setChannelsList] = useState<any[]>([]);
  const [channelName, setChannelName] = useState<string>('');

  let results = `appId: ${data.source.appId}\ninstanceId: ${data.source.instanceId}`;

  const displayIntentResults = async () => {
    try {
      if (data.getResult) {
        const result = await data.getResult();

        if (!!result?.broadcast) {
          setResolutionResult('');

          if (result.type === 'app') {
            await appChannelStore.getOrCreateChannel(result.id);
            setChannelName(result.id);
            setIsChannel(true);
            setChannelsList(appChannelStore.appChannelsList);
          }

          if (result.type === 'private') {
            setIsChannel(true);
            setPrivateChannel(true);
            setChannelsList([result]);
            privateChannelStore.addChannelListener(result, 'all');
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
      console.error(`${data.source.appId} returned a result error: ${error}`);
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
});
