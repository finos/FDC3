/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ChannelField } from './ChannelField.js';
import appChannelStore from '../store/AppChannelStore.js';
import privateChannelStore from '../store/PrivateChannelStore.js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    input: {
      fontSize: '14px',
      color: 'rgba(0, 0, 0, 0.6)',
    },
    '& .Mui-disabled': {
      borderColor: theme.palette.text.primary,
    },
  })
);

export const IntentResolutionField = observer(({ data, handleTabChange }: { data: any; handleTabChange: any }) => {
  const classes = useStyles();
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

        //detect whether the result is Context or a Channel
        if (!!result?.broadcast) {
          setResolutionResult('');

          //App Channel
          if (result.type === 'app') {
            await appChannelStore.getOrCreateChannel(result.id);
            setChannelName(result.id);
            setIsChannel(true);
            setChannelsList(appChannelStore.appChannelsList);
          }

          // Private Channel
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
          //void result returned
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
    <div>
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
          classes: {
            input: classes.input,
          },
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
          InputProps={{
            classes: {
              input: classes.input,
            },
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
    </div>
  );
});
