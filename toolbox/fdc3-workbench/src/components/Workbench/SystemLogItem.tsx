/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { ListItem, TextField, Typography } from '@mui/material';
import { LogItem } from '../../store/SystemLogStore';
import { SxProps, Theme } from '@mui/material/styles';

interface SystemLogItemProps {
  logItem: LogItem;
}

const classes = {
  root: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    py: 3,
    px: 0,
    '&:first-of-type': {
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
  },
  textField: {
    width: '100%',
  },
  input: (theme: Theme) => ({
    fontSize: '14px',
    color: theme.palette.text.primary,
  }),
} as const;

const getMessageSx = (logItem: LogItem): SxProps<Theme> => ({
  color: theme => theme.palette[logItem.type].dark,
});

export const SystemLogItem: React.FC<SystemLogItemProps> = (props: SystemLogItemProps) => {
  const { logItem } = props;

  return (
    <ListItem sx={classes.root} divider>
      <Typography sx={getMessageSx(logItem)} variant="body1">
        {logItem.message}
      </Typography>

      {logItem.variant === 'code' && (
        <TextField
          disabled
          sx={classes.textField}
          id={logItem.id}
          contentEditable={false}
          fullWidth
          multiline
          variant="outlined"
          size="small"
          value={logItem.body}
          InputProps={{
            sx: classes.input,
          }}
        />
      )}

      {logItem.variant === 'text' && logItem.body && (
        <Typography variant="body1">
          {logItem.type === 'error' && 'ERROR:'}
          {logItem.type === 'warning' && 'WARNING:'}
          {logItem.type === 'info' && 'INFO:'}
          {logItem.type === 'success' && 'SUCCESS:'}

          {logItem.body}
        </Typography>
      )}
    </ListItem>
  );
};
