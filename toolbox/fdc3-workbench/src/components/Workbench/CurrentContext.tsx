/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AccordionContent } from '../common/AccordionContent.js';
import contextStore from '../../store/ContextStore.js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginTop: theme.spacing(2),
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

export const CurrentContext = observer(() => {
  const classes = useStyles();
  const context = JSON.stringify(contextStore.currentContext, undefined, 4);

  return (
    <AccordionContent title="Context">
      <TextField
        disabled
        className={classes.textField}
        id="context-id"
        contentEditable={false}
        fullWidth
        multiline
        variant="outlined"
        size="small"
        value={context}
        InputProps={{
          classes: {
            input: classes.input,
          },
        }}
      />
    </AccordionContent>
  );
});
