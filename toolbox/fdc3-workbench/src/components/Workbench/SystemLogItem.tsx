/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { ListItem, TextField, Typography } from '@material-ui/core';
import { LogItem } from '../../store/SystemLogStore.js';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface SystemLogItemProps {
  logItem: LogItem;
}

const useStyles = (props: SystemLogItemProps) =>
  makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: theme.spacing(3, 0),
        '&:first-child': {
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
      message: {
        color: theme.palette[props.logItem.type].dark,
      },
      textField: {
        width: '100%',
      },
      input: {
        fontSize: '14px',
        color: theme.palette.text.primary,
      },
      '& .Mui-disabled': {
        borderColor: theme.palette.text.primary,
      },
    })
  );

export const SystemLogItem: React.FC<SystemLogItemProps> = (props: SystemLogItemProps) => {
  const { logItem } = props;
  const classes = useStyles(props)();

  return (
    <ListItem className={classes.root} divider>
      <Typography className={classes.message} variant="body1">
        {logItem.message}
      </Typography>

      {logItem.variant === 'code' && (
        <TextField
          disabled
          className={classes.textField}
          id={logItem.id}
          contentEditable={false}
          fullWidth
          multiline
          variant="outlined"
          size="small"
          value={logItem.body}
          InputProps={{
            classes: {
              input: classes.input,
            },
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
