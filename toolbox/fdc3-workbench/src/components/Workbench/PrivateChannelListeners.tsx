/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { observer } from 'mobx-react';
import privateChannelStore from '../../store/PrivateChannelStore.js';
import { AccordionList, AccordionListItem } from '../common/AccordionList.js';
import { TextField } from '@mui/material';
import { ReceivedField } from './ReceivedField.js';

const classes = {
  textField: {
    mt: 2,
    width: '100%',
  },
  input: {
    fontSize: '14px',
  },
} as const;

export const PrivateChannelListeners = observer(() => {
  const contextListeners: AccordionListItem[] = [];
  const channelEvents: AccordionListItem[] = [];

  privateChannelStore.channelListeners.forEach(({ id, channelId, type, lastReceivedContext, metaData }) => {
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

    contextListeners.push({ id, textPrimary: `Channel Id: ${channelId}: ${type}`, afterEachElement: contextField });
  });

  privateChannelStore.privateChannelEvents.forEach(({ id, channelId, type, contextType }) => {
    const eventDetails = type === 'disconnect' ? type : `${type}: ${contextType ?? 'all context types'}`;
    channelEvents.push({ id, textPrimary: `Channel Id: ${channelId}: ${eventDetails}` });
  });

  const handleDeleteListener = (id: string) => {
    privateChannelStore.removeContextListener(id);
  };

  return (
    <>
      <AccordionList
        title="Private Channels"
        icon="Any context already in the channel will NOT be received automatically"
        noItemsText="No Private Channel Listeners"
        listItems={contextListeners}
        onDelete={handleDeleteListener}
      />
      <AccordionList
        title="Private Channel Events"
        icon="Shows context listener and disconnect events received from private channels"
        noItemsText="No Private Channel Events"
        listItems={channelEvents}
      />
    </>
  );
});
