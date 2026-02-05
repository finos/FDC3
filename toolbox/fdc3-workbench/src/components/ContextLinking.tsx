/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { FormEvent, HTMLAttributes, useState } from 'react';
import { observer } from 'mobx-react';
import { Typography, Grid, Button, IconButton, Tooltip, Link, Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { codeExamples } from '../fixtures/codeExamples';
import { openApiDocsLink } from '../fixtures/openApiDocs';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import contextStore from '../store/ContextStore';
import { TemplateTextField } from './common/TemplateTextField';
import { copyToClipboard } from './common/CopyToClipboard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// interface copied from lib @material-ui/lab/Autocomplete
interface FilterOptionsState<T> {
  inputValue: string;
  getOptionLabel: (option: T) => string;
}

interface ListenerOptionType {
  title: string;
  value: string;
  type: string | undefined;
}

type ListenerSetValue = (value: ListenerOptionType | null) => void;

type ListenerSetError = (error: string | false) => void;

const styles = {
  root: {
    flexGrow: 1,
  },
  controls: {
    '& .MuiIconButton-sizeSmall': {
      padding: '6px 0px 6px 0px',
    },
    '& > a': {
      display: 'flex',
      padding: '6px 0px 6px 0px',
    },
  },
  contextListenerName: {
    flexGrow: 1,
    mr: 1,
    minWidth: '190px',
  },
  bottomAlignChildren: {
    display: 'flex',
    alignItems: 'end',
  },
  rightAlign: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
};

const listenerFilter = createFilterOptions<ListenerOptionType>();

export const ContextLinking = observer(() => {
  const [contextListener, setContextListener] = useState<ListenerOptionType | null>(null);
  const [contextError, setContextError] = useState<string | false>(false);
  const contextListenersOptionsAll: ListenerOptionType[] = contextStore.contextsList.map(({ id, template }) => {
    return {
      title: id,
      value: id,
      type: template?.type,
    };
  });
  contextListenersOptionsAll.unshift({
    title: 'All',
    value: 'all',
    type: 'All',
  });

  const contextListenersOptions = Array.from(
    new Map(contextListenersOptionsAll.reverse().map(item => [item['type'], item])).values()
  ).reverse();

  const handleChangeListener =
    (setValue: ListenerSetValue, setError: ListenerSetError) => (event: React.ChangeEvent<{}>, newValue: any) => {
      if (typeof newValue === 'string') {
        setValue({
          title: newValue,
          value: newValue,
          type: newValue,
        });
      } else if (newValue && newValue.inputValue) {
        setValue({
          title: newValue.inputValue,
          value: newValue.inputValue,
          type: newValue.inputValue,
        });
      } else {
        setValue(newValue);
      }

      setError(false);
    };

  const getOptionLabel = (option: ListenerOptionType) => {
    if (option.type) {
      return option.type;
    }
    return option.title;
  };

  const filterOptions = (options: ListenerOptionType[], params: FilterOptionsState<ListenerOptionType>) => {
    const filtered = listenerFilter(options, params);

    if (params.inputValue !== '') {
      filtered.push({
        value: params.inputValue,
        title: `Add "${params.inputValue}"`,
        type: params.inputValue,
      });
    }

    return filtered;
  };

  const handleAddContextListener = (e: FormEvent | null = null) => {
    e?.preventDefault();
    if (contextListener) {
      if (contextStore.isContextListenerExists(contextListener.type)) {
        setContextError('Listener already added');
      } else {
        contextStore.addContextListener(contextListener.type);
        setContextListener(null);
      }
    } else {
      setContextError('Enter context type');
    }
  };

  return (
    <div style={styles.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Add context listener</Typography>
      </Grid>

      <Grid container direction="row" justifyContent="space-between" sx={{ ...styles.controls, ...styles.rightAlign }}>
        <Grid item sx={styles.contextListenerName}>
          <Autocomplete
            id="context-listener"
            size="small"
            selectOnFocus
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            value={contextListener}
            onChange={handleChangeListener(setContextListener, setContextError)}
            filterOptions={filterOptions}
            options={contextListenersOptions}
            getOptionLabel={getOptionLabel}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option: ListenerOptionType) => (
              <li {...props}>{option.type}</li>
            )}
            renderInput={params => (
              <TemplateTextField
                label="CONTEXT TYPE"
                placeholder="Enter Context Type"
                variant="outlined"
                {...params}
                error={!!contextError}
                helperText={contextError}
              />
            )}
          />
        </Grid>
        <Grid item sx={styles.bottomAlignChildren}>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item sx={styles.controls}>
              <Button variant="contained" color="primary" onClick={handleAddContextListener}>
                Add listener
              </Button>
            </Grid>
            <Grid item sx={styles.controls}>
              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={copyToClipboard(codeExamples.contextListener, 'addContextListener')}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item sx={styles.controls}>
              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/Channel#addcontextlistener"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});
