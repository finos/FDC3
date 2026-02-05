/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { observer } from 'mobx-react';
import appChannelStore from '../../store/AppChannelStore';
import { AccordionList, AccordionListItem } from '../common/AccordionList';
import { TextField } from '@mui/material';
import { ReceivedField } from './ReceivedField';

const classes = {
  textField: {
    mt: 2,
    width: '100%',
  },
  input: {
    fontSize: '14px',
  },
} as const;

export const AppChannelListeners = observer(() => {
  let contextListeners: AccordionListItem[] = [];

  appChannelStore.channelListeners.forEach(({ id, channelId, type, lastReceivedContext, metaData }) => {
    const receivedContextListenerValue = lastReceivedContext ? JSON.stringify(lastReceivedContext, undefined, 4) : '';
    const contextField = (
      <div>
        <TextField
          disabled
          label={'LAST RECEIVED CONTEXT'}
          sx={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          contentEditable={false}
          fullWidth
          multiline
          variant="outlined"
          size="small"
          value={receivedContextListenerValue}
          InputProps={{
            sx: classes.input,
          }}
        />
        {window.fdc3Version === '2.0' && <ReceivedField metaData={metaData} />}
      </div>
    );

    contextListeners.push({ id, textPrimary: `${channelId}: ${type}`, afterEachElement: contextField });
  });

  const handleDeleteListener = (id: string) => {
    appChannelStore.removeContextListener(id);
  };

  return (
    <AccordionList
      title="App Channels"
      icon="Any context already in the channel will NOT be received automatically"
      noItemsText="No App Channel Listeners"
      listItems={contextListeners}
      onDelete={handleDeleteListener}
    />
  );
});
