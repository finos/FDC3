/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import contextStore from '../store/ContextStore.js';
import { TemplateTextField } from './common/TemplateTextField.js';

interface FilterOptionsState<T> {
  inputValue: string;
  getOptionLabel: (option: T) => string;
}

interface OptionType {
  title: string;
  value: string;
}

type SetValue = (value: OptionType | null) => void;

type SetError = (error: string | false) => void;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        marginRight: 0,
      },
    },
    controls: {
      '& .MuiIconButton-sizeSmall': {
        padding: '6px',
        marginLeft: theme.spacing(1),
      },
    },
    contextName: {
      flexGrow: 1,
      minWidth: '190px',
    },
    rightAlign: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    link: {
      cursor: 'pointer',
      color: 'black',
    },
  })
);

const contextFilter = createFilterOptions<OptionType>();

export const ContextTemplates = observer(
  ({
    handleTabChange,
    contextStateSetter,
    channel,
  }: {
    handleTabChange: any;
    contextStateSetter: any;
    channel?: any;
  }) => {
    const classes = useStyles();
    const [context, setContext] = useState<OptionType | null>(null);
    const [contextError, setContextError] = useState<string | false>(false);
    const contextsOptions: OptionType[] = contextStore.contextsList.map(({ id }) => {
      return {
        title: id,
        value: id,
      };
    });
    const isInitialMount = useRef(true);

    const handleChange = (setValue: SetValue, setError: SetError) => (event: React.ChangeEvent<{}>, newValue: any) => {
      const selectedContext = contextStore.contextsList.find(({ id }) => id === newValue?.value);
      if (selectedContext) contextStateSetter(selectedContext.template, channel);

      if (typeof newValue === 'string') {
        setValue({
          title: newValue,
          value: newValue,
        });
      } else if (newValue && newValue.inputValue) {
        setValue({
          title: newValue.inputValue,
          value: newValue.inputValue,
        });
      } else {
        setValue(newValue);
      }

      setError(false);
    };

    const getOptionLabel = (option: OptionType) => option.value || option.title;

    const filterOptions = (options: OptionType[], params: FilterOptionsState<OptionType>) => {
      const filtered = contextFilter(options, params);

      if (params.inputValue !== '') {
        filtered.push({
          value: params.inputValue,
          title: `Add "${params.inputValue}"`,
        });
      }

      return filtered;
    };

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        const selectedContext = contextStore.contextsList.find(({ id }) => id === context?.value);
        if (!selectedContext) handleTabChange(null, 0, context?.value);
      }
    }, [context]);

    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          spacing={1}
          justifyContent="space-between"
          className={`${classes.controls} ${classes.rightAlign}`}
        >
          <Grid item className={classes.contextName}>
            <Autocomplete
              id="context-"
              size="small"
              selectOnFocus
              blurOnSelect
              clearOnBlur
              handleHomeEndKeys
              value={context}
              onChange={handleChange(setContext, setContextError)}
              getOptionSelected={(option, value) => option.value === value.value}
              filterOptions={filterOptions}
              options={contextsOptions}
              getOptionLabel={getOptionLabel}
              renderOption={option => option.title}
              renderInput={params => (
                <TemplateTextField
                  label="CONTEXT "
                  placeholder="Enter Context Type"
                  variant="outlined"
                  {...params}
                  error={!!contextError}
                  helperText={contextError}
                />
              )}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
);
