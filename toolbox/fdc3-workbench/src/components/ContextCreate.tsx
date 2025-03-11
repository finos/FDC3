/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import contextStore, { ContextItem } from '../store/ContextStore';
import systemLogStore from '../store/SystemLogStore';
import { JsonInput } from './common/JsonInput';
import { DialogModal } from './common/DialogModal';
import { TemplateTextField } from './common/TemplateTextField';
import { copyToClipboard } from './common/CopyToClipboard';
import { ContextType } from '../utility/Fdc3Api';

interface OptionType {
  title: string;
  value: string;
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      '& > *': {
        margin: theme.spacing(1),
      },
      '& > *:first-child': {
        marginLeft: 0,
        paddingLeft: 0,
      },
      '& > * > *:first-child': {
        marginLeft: 0,
        paddingLeft: 0,
      },
      '& .MuiGrid-grid-xs-12': {
        paddingLeft: 0,
      },
    },
    controls: {
      '& .MuiIconButton-sizeSmall': {
        padding: '6px',
        marginLeft: theme.spacing(1),
      },
    },
    exampleSelect: {
      flexGrow: 1,
      // marginRight: theme.spacing(1),
      minWidth: '190px',
    },
    textField: {
      width: '100%',
    },
    multilineField: {
      width: '100%',
    },
    button: {
      marginLeft: 'auto',
    },
    rightAlign: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    border: {
      height: '1px',
      width: '100%',
      backgroundColor: '#acb2c0',
      marginTop: '24px',
      marginBottom: '16px',
    },
    delete: {
      height: '15px',
      transform: 'scale(1.7)',
    },
    copy: {
      height: '20px',
    },
    link: {
      cursor: 'pointer',
      color: 'black',
    },
    margins: {
      margin: '0 5px',
    },
    tableContainer: {
      maxHeight: 250,
      '& > table': {
        width: 'calc(100% - 4px)',
      },
    },
  })
);

const emptyJson: ContextType = {
  type: '',
  id: {},
};

export const ContextCreate = observer(({ contextName }: { contextName: string }) => {
  const classes = useStyles();
  const [exampleName, setExampleName] = useState<OptionType | null>({
    title: contextName,
    value: contextName,
  });
  const [duplicateName, setDuplicateName] = useState(false);
  const [contextValue, setContextValue] = useState<ContextType | null>(emptyJson);
  const [context, setContext] = useState<ContextItem | null>({
    id: contextName || 'empty',
    template: emptyJson,
    schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context.schema.json'),
  });
  const [contextError, setContextError] = useState<string | false>(false);
  const [open, setOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<object | null>(null);
  const [disabled, setDisabled] = useState(true);
  const gridRef = useRef<any>(null);

  const handleClickOpen = (id: string, name: any) => {
    setOpen(true);
    setDeleteContext({ id, name });
  };

  const handleClose = (value: boolean) => {
    setOpen(value);
  };

  const handleJsonError = (errors: string[]) => {
    setContextError(errors[0]);
  };

  const handleChangeExample = (newValue: any) => {
    setExampleName(newValue);

    if (newValue?.value) {
      const selectedContext = contextStore.contextsList.find(({ id }) => id === newValue?.value);
      if (selectedContext) {
        setContextValue(selectedContext.template);
        setContext(selectedContext);
      }
    }

    setContextError(false);
  };

  const found = (tempName: string, ignoreUuid?: string) =>
    contextStore.contextsList.reduce((count, { id, uuid }) => {
      if (id === tempName && (!ignoreUuid || ignoreUuid !== uuid)) {
        count = count + 1;
      }
      return count;
    }, 0);

  const handleChangeExampleName = (newValue: any) => {
    setDisabled(false);
    setContextError(false);
    setExampleName(newValue);

    if (context && !found(newValue.value, context.uuid)) setDuplicateName(false);
    else if (found(newValue.value) >= 1) setDuplicateName(true);
  };

  const handleContextChange = (json: ContextType) => {
    setContextValue(json);
    setContextError(false);
  };

  const validate = () => {
    if (!contextValue) {
      setContextError('Context is required');
      return false;
    }

    if (!contextValue?.type) {
      setContextError("Context must have property 'type'");
      return false;
    }

    if (contextValue?.type === '') {
      setContextError("Property 'type' can't be empty");
      return false;
    }

    if (!exampleName) {
      setContextError('Template name is required');
      return false;
    }

    return true;
  };

  const handleCreateExample = () => {
    setExampleName(null);
    setContext(null);
    setContextValue(null);
    setDisabled(true);
  };

  const handleSaveExample = (e: FormEvent | null = null) => {
    e?.preventDefault();
    if (disabled) {
      return;
    } else {
      const isValid: boolean = validate();

      if (isValid && context && exampleName) {
        const selectedContext = contextStore.contextsList.find(({ id }) => id === context.id);
        const currContext = {
          id: exampleName.value,
          schemaUrl: context.schemaUrl,
          template: contextValue,
        };

        if (!selectedContext) contextStore.addContextItem(currContext);

        contextStore.saveContextItem(currContext, context.id);
        handleChangeExample({ title: currContext.id, value: currContext.id });

        systemLogStore.addLog({
          name: 'saveExample',
          type: 'success',
          value: currContext?.id,
          variant: 'text',
        });
      } else {
        systemLogStore.addLog({
          name: 'saveExample',
          type: 'error',
          value: undefined,
          variant: 'text',
        });
      }
      setDisabled(true);
    }
  };

  const handleDuplicateExample = (newValue: any, count = 0) => {
    const copyName = `${newValue.value}-copy${count > 0 ? ` (${count})` : ''}`;
    if (newValue?.value && !found(copyName)) {
      setExampleName({ value: copyName, title: copyName });
      const selectedContext = contextStore.contextsList.find(({ id }) => id === newValue.value);

      if (selectedContext) {
        const newContext: ContextItem = {
          id: copyName,
          template: selectedContext.template,
          schemaUrl: selectedContext.schemaUrl,
        };

        contextStore.addContextItem(newContext);
        contextStore.saveContextItem(newContext);

        setContextValue(selectedContext.template);
        setContext(newContext);

        systemLogStore.addLog({
          name: 'saveExample',
          type: 'success',
          value: newContext.id,
          variant: 'text',
        });
      }
    } else if (found(copyName)) {
      handleDuplicateExample(newValue, ++count);
    }

    setContextError(false);
  };

  const handleResetExample = () => {
    contextStore.resetContextList();
    handleCreateExample();
  };

  const handleDeleteExample = (contextId: any) => {
    const selectedContext = contextStore.contextsList.find(({ id }) => id === contextId);
    if (selectedContext) {
      contextStore.deleteContextItem(selectedContext);
      systemLogStore.addLog({
        name: 'deleteExample',
        type: 'success',
        value: selectedContext?.id,
        variant: 'text',
      });
    } else {
      systemLogStore.addLog({
        name: 'deleteExample',
        type: 'error',
        value: undefined,
        variant: 'text',
      });
    }
  };

  useEffect(() => {
    if (duplicateName) {
      setDisabled(true);
      setContextError('Example name already exists');
    } else setDisabled(false);
  }, [duplicateName, contextValue]);

  useEffect(() => {
    if (gridRef && gridRef.current) gridRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    if (context == null) {
      const newContext: ContextItem = {
        id: 'empty',
        template: emptyJson,
        schemaUrl: new URL('https://fdc3.finos.org/schemas/next/context.schema.json'),
      };
      setContext(newContext);
      setContextValue(emptyJson);
    }
  }, [context]);

  return (
    <div className={classes.root}>
      <DialogModal open={open} onClose={handleClose} onAgree={handleDeleteExample} selectedValue={deleteContext} />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5">Context examples:</Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableBody>
                {contextStore.contextsList.map(({ id, template }, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`row-${index}`}
                    selected={id === exampleName?.value}
                    ref={id === exampleName?.value ? gridRef : null}
                  >
                    <TableCell
                      key={`row-${index}-column-0`}
                      align="left"
                      onClick={() => handleChangeExample({ title: id, value: id })}
                    >
                      <Typography variant="body2">{id}</Typography>
                    </TableCell>
                    <TableCell
                      key={`row-${index}-column-1`}
                      align="left"
                      onClick={() => handleChangeExample({ title: id, value: id })}
                    >
                      <Typography variant="caption">{template?.type}</Typography>
                    </TableCell>
                    <TableCell key={`row-${index}-column-2`} align="right">
                      <Tooltip title="Duplicate example" aria-label="Copy code">
                        <IconButton
                          size="small"
                          aria-label="Copy code example"
                          color="primary"
                          onClick={() => handleDuplicateExample({ title: id, value: id })}
                        >
                          <FileCopyOutlinedIcon className={classes.copy} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell key={`row-${index}-column-3`} align="right">
                      <Tooltip title="Delete example" aria-label="Delete example">
                        <IconButton
                          size="small"
                          aria-label="Delete example"
                          color="primary"
                          onClick={() => handleClickOpen(id, template?.name)}
                        >
                          <DeleteOutlinedIcon className={classes.delete} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <form className={classes.form} noValidate autoComplete="off">
        <Grid container direction="row" spacing={1}>
          <Grid item className={classes.controls}>
            <Button className={classes.button} variant="contained" color="primary" onClick={handleCreateExample}>
              Create new example
            </Button>
          </Grid>
          <Grid item className={classes.controls}>
            <Button className={classes.button} variant="contained" color="primary" onClick={handleResetExample}>
              Reset examples
            </Button>
          </Grid>
        </Grid>
      </form>

      <form className={classes.form} noValidate autoComplete="off" onSubmit={e => handleSaveExample(e)}>
        <Grid container direction="row" spacing={1} className={classes.rightAlign}>
          <Grid item xs={12} className={`${classes.controls} ${classes.exampleSelect}`}>
            <Grid item xs={6} className={classes.field}>
              <Grid item xs={12} className={classes.textField}>
                <Typography variant="h5">Edit example:</Typography>
              </Grid>
              <TemplateTextField
                label="Example name"
                variant="outlined"
                className={classes.textField}
                placeholder="Choose Context Example"
                value={exampleName?.value || ''}
                onChange={e => handleChangeExampleName({ title: e.target.value, value: e.target.value })}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} className={classes.controls}>
            <JsonInput
              json={context?.template}
              onChange={handleContextChange}
              onJsonError={handleJsonError}
              schemaUrl={new URL(context?.schemaUrl || 'https://fdc3.finos.org/schemas/next/context.schema.json')}
              error={contextError}
            />
          </Grid>

          <Grid item>
            <Tooltip title="Copy code" aria-label="Copy code">
              <IconButton
                size="small"
                aria-label="Copy code example"
                color="primary"
                onClick={copyToClipboard(`let context = ${JSON.stringify(contextValue, null, 2)}`, 'createContext')}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleSaveExample}
              disabled={disabled}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
});
