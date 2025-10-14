/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import systemLogStore from '../../store/SystemLogStore.js';
import { SystemLogItem } from './SystemLogItem.js';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
  })
);

export const SystemLog = observer(() => {
  const classes = useStyles();

  return (
    <List component="nav" className={classes.root} aria-label="mailbox folders">
      {systemLogStore.logList.map(logItem => (
        <SystemLogItem key={logItem.id} logItem={logItem} />
      ))}
    </List>
  );
});
