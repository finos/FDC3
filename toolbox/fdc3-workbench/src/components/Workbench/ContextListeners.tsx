/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { observer } from 'mobx-react';
import contextStore from '../../store/ContextStore';
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

export const ContextListeners = observer(() => {
  const contextListeners: AccordionListItem[] = contextStore.contextListeners.map(
    ({ id, type, lastReceivedContext, metaData }) => {
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

      return { id, textPrimary: `${type}`, afterEachElement: contextField };
    }
  );

  const handleDeleteListener = (id: string) => {
    contextStore.removeContextListener(id);
  };

  return (
    <AccordionList
      title="User Channels"
      icon="Any context already in the channel will be received automatically"
      noItemsText="No User Channel Listeners"
      listItems={contextListeners}
      onDelete={handleDeleteListener}
    />
  );
});
