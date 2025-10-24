/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import {
  AppMetadata,
  ContextType,
  getTargetOptions,
  getTargetOptionsForContext,
  getWorkbenchAgent,
  IntentResolution,
  IntentTargetOption,
} from '../utility/Fdc3Api';
import { toJS } from 'mobx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  TextField,
  Switch,
  Link,
  ListSubheader,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { ContextTemplates } from '../components/ContextTemplates';
import intentStore from '../store/IntentStore';
import { codeExamples } from '../fixtures/codeExamples';
import { openApiDocsLink } from '../fixtures/openApiDocs';
import { TemplateTextField } from './common/TemplateTextField';
import { copyToClipboard } from './common/CopyToClipboard';
import { IntentResolutionField } from './IntentResolutionField';

import { Checkbox } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { Alert, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// interface copied from lib @material-ui/lab/Autocomplete
interface FilterOptionsState<T> {
  inputValue: string;
  getOptionLabel: (option: T) => string;
}

interface ListenerOptionType {
  title: string;
  value: string;
}

type ListenerSetValue = (value: ListenerOptionType | null) => void;

type ListenerSetError = (error: string | false) => void;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      '& > *': {
        margin: theme.spacing(1),
        marginLeft: '0px',
      },
    },
    controls: {
      '& > *:first-child': {
        marginLeft: 0,
      },
      '& > *': {
        marginRight: theme.spacing(1),
      },
      '& > *:last-child': {
        marginRight: 0,
      },
      '& .MuiIconButton-sizeSmall': {
        padding: '6px 0px 6px 0px',
      },
      '& > a': {
        display: 'flex',
        padding: '6px 0px 6px 0px',
      },
      display: 'flex',
      alignItems: 'center',
    },
    rightAlign: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    spread: {
      flexDirection: 'row',
      '& > *:first-child': {
        paddingLeft: '0px',
      },
    },
    textField: {
      width: '100%',
      '& input': {
        height: '29px',
        padding: '6px',
      },
    },
    h4: {
      fontSize: '22px',
    },
    field: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
      minWidth: '190px',
    },
    border: {
      height: '1px',
      width: '100%',
      backgroundColor: '#acb2c0',
      marginTop: '24px',
      marginBottom: '16px',
    },
    bottomMargin: {
      marginBottom: theme.spacing(1),
    },
    removeSidePadding: {
      paddingLeft: 0,
    },
    targetSelect: {
      width: '100%',
      marginRight: theme.spacing(1),
    },
    rightPadding: {
      paddingRight: theme.spacing(0.5),
    },
    input: {
      color: '#0086bf',
      outline: '1px',
      '&.Mui-checked': {
        color: '#0086bf',
      },
    },
    toggle: {
      '&.Mui-selected': {
        color: '#0086bf',
        backgroundColor: 'rgba(0, 134, 191, 0.21)',
      },
    },
    indentLeft: {
      marginLeft: '30px',
    },
    caption: {
      color: '#0086bf',
      marginTop: '10px',
    },
  })
);

const filter = createFilterOptions<ListenerOptionType>();

export const Intents = observer(({ handleTabChange }: { handleTabChange: any }) => {
  const classes = useStyles();
  const [intentValue, setIntentValue] = useState<ListenerOptionType | null>(null);
  const [raiseIntentError, setRaiseIntentError] = useState<string | false>(false);
  const [intentListener, setIntentListener] = useState<ListenerOptionType | null>(null);
  const [intentsForContext, setIntentsForContext] = useState<ListenerOptionType[] | null>(null);
  const [targetApp, setTargetApp] = useState<string>('None');
  const [contextTargetApp, setContextTargetApp] = useState<string>('None');
  const [raiseIntentContext, setRaiseIntentContext] = useState<ContextType | null>(null);
  const [addIntentListenerWithContextContext, setAddIntentListenerWithContextContext] = useState<ContextType | null>(
    null
  );

  const [raiseIntentWithContextContext, setRaiseIntentWithContextContext] = useState<ContextType | null>(null);
  const [intentError, setIntentError] = useState<string | false>(false);
  const [intentResolution, setIntentResolution] = useState<IntentResolution | undefined | null>(null);
  const [intentForContextResolution, setIntentForContextResolution] = useState<IntentResolution | undefined | null>(
    null
  );
  const intentListenersOptions: ListenerOptionType[] = intentStore.intentsList;
  const [contextFields, setContextFields] = useState<any[]>([]);
  const [resultTypeContext, setResultTypeContext] = useState<ContextType | null>(null);
  const [resultOverChannelContextList, setResultOverChannelContextList] = useState<any>({});
  const [resultOverChannelContextDelays, setResultOverChannelContextDelays] = useState<any>({});
  const [sendIntentResult, setSendIntentResult] = useState<boolean | undefined>(false);
  const [resultType, setResultType] = useState<string | null>(null);
  const [useTargets, setUseTargets] = useState<boolean>(false);
  const [useContextTargets, setUseContextTargets] = useState<boolean>(false);
  const [channelType, setChannelType] = useState<string | null>('app-channel');
  const [sendResultOverChannel, setSendResultOverChannel] = useState<boolean | undefined>(false);
  const [currentAppChannelId, setCurrentAppChannelId] = useState<string>('');
  const [targetOptions, setTargetOptions] = useState<ReactElement[]>([]);
  const [targetOptionsforContext, setTargetOptionsforContext] = useState<ReactElement[]>([]);

  const [addListenerWithContext, setAddListenerWithContext] = useState<boolean | undefined>(false);

  const handleRaiseIntent = async () => {
    setIntentResolution(null);
    if (!intentValue) {
      setRaiseIntentError('Enter intent name');
    } else if (!raiseIntentContext) {
      setRaiseIntentError('Select a context first');
    } else {
      if (targetApp && targetApp != 'None') {
        try {
          const targetObj = JSON.parse(targetApp);
          let target = targetObj as AppMetadata;

          setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext, target));
          setRaiseIntentError('');
          return;
        } catch (e) {
          console.error('Error passing raiseIntent target option value!', contextTargetApp, e);
          setTargetApp('None');
        }
      }
      //allow failover to raise without target if we were unable to parse it
      setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext));
      setRaiseIntentError('');
    }
  };

  const handleRaiseIntentForContext = async () => {
    setIntentForContextResolution(null);
    if (!raiseIntentWithContextContext) {
      return;
    }
    if (contextTargetApp && contextTargetApp != 'None') {
      try {
        const targetObj = JSON.parse(contextTargetApp);
        let target = targetObj as AppMetadata;

        setIntentForContextResolution(await intentStore.raiseIntentForContext(raiseIntentWithContextContext, target));
        return;
      } catch (e) {
        console.error('Error passing raiseIntentForContext target option value!', contextTargetApp, e);
        setContextTargetApp('None');
      }
    }
    //allow failover to raise without target if we were unable to parse it
    setIntentForContextResolution(await intentStore.raiseIntentForContext(raiseIntentWithContextContext));
  };

  const clearTargets = () => {
    setTargetApp('');
    setTargetOptions([]);
  };

  const clearContextTargets = () => {
    setContextTargetApp('');
    setUseContextTargets(false);
    setTargetOptionsforContext([]);
  };

  const handleTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === 'None') {
      setTargetApp('None');
    } else {
      setTargetApp(event.target.value as string);
    }
  };

  const handleContextTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === 'None') {
      setContextTargetApp('None');
    } else {
      setContextTargetApp(event.target.value as string);
    }
  };

  const handleChangeListener =
    (setValue: ListenerSetValue, setError: ListenerSetError) => (event: React.ChangeEvent<{}>, newValue: any) => {
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

  const getOptionLabel = (option: ListenerOptionType) => option.value || option.title;

  const filterOptions = (options: ListenerOptionType[], params: FilterOptionsState<ListenerOptionType>) => {
    const filtered = filter(options, params);

    if (params.inputValue !== '') {
      filtered.push({
        value: params.inputValue,
        title: `Add "${params.inputValue}"`,
      });
    }

    return filtered;
  };

  const handleTargetMenuOpen = () => {
    const fetchAppsAndInstances = async () => {
      if (!intentValue) {
        setRaiseIntentError('Enter intent name');
      } else if (!raiseIntentContext) {
        setRaiseIntentError('Select a context first');
      } else {
        const intentTargetOptions: IntentTargetOption[] = await getTargetOptions(
          intentValue.value,
          toJS(raiseIntentContext)
        );

        if (intentTargetOptions.length === 0) {
          setUseTargets(false);
          clearTargets();
          return;
        }

        const menuItems: ReactElement[] = [];

        //check if there are any target options
        if (intentTargetOptions.length === 0) {
          menuItems.push(
            <MenuItem value="" key="no-target-apps-found" disabled>
              No target apps found
            </MenuItem>
          );
        } else {
          menuItems.push(
            <MenuItem key="none" value="None">
              None
            </MenuItem>
          );

          //add app targets
          menuItems.push(<ListSubheader key={`subheading-app-targets`}>Target apps</ListSubheader>);
          intentTargetOptions.forEach(option => {
            const targetLabel: string = option.metadata.title ?? option.appId;
            if (option.launchNew) {
              menuItems.push(
                <MenuItem className="app" key={option.appId} value={JSON.stringify(option.metadata)}>
                  {targetLabel}
                </MenuItem>
              );
            }
          });

          //check if there are any target options
          if (intentTargetOptions.find(value => value?.instances.length > 0)) {
            //add app instance targets
            menuItems.push(<ListSubheader key={`subheading-app-instance-targets`}>Target app instances</ListSubheader>);
            intentTargetOptions.forEach(option => {
              const targetLabel: string = option.metadata.title ?? option.appId;
              option?.instances.forEach(instance => {
                menuItems.push(
                  <MenuItem className="instance" key={instance.instanceId} value={JSON.stringify(instance)}>
                    {`${targetLabel} (${instance.instanceId})`}
                  </MenuItem>
                );
              });
            });
          }
        }

        setTargetOptions(menuItems);
      }
    };
    fetchAppsAndInstances();
  };

  const handleContextTargetMenuOpen = () => {
    const fetchIntents = async () => {
      const menuItems: ReactElement[] = [];
      try {
        if (!raiseIntentWithContextContext) {
          //no settable error at the moment... setRaiseIntentError("enter context name");
        } else {
          const contextTargetOptions = await getTargetOptionsForContext(toJS(raiseIntentWithContextContext));

          if (Object.keys(contextTargetOptions).length > 0) {
            menuItems.push(
              <MenuItem key="none" value="None">
                None
              </MenuItem>
            );

            //add app targets
            menuItems.push(<ListSubheader key={`subheading-app-targets`}>Target apps</ListSubheader>);
            contextTargetOptions.forEach(option => {
              const targetLabel: string = option.metadata.title ?? option.appId;
              if (option.launchNew) {
                menuItems.push(
                  <MenuItem className="app" key={option.appId} value={JSON.stringify(option.metadata)}>
                    {targetLabel}
                  </MenuItem>
                );
              }
            });

            //check if there are any target options
            //check if there are any target options
            if (contextTargetOptions.find(value => value.instances.length > 0)) {
              //add app instance targets
              menuItems.push(
                <ListSubheader key={`subheading-app-instance-targets`}>Target app instances</ListSubheader>
              );
              contextTargetOptions.forEach(option => {
                const targetLabel: string = option.metadata.title ?? option.appId;
                option?.instances.forEach(instance => {
                  menuItems.push(
                    <MenuItem className="instance" key={instance.instanceId} value={JSON.stringify(instance)}>
                      {`${targetLabel} (${instance.instanceId})`}
                    </MenuItem>
                  );
                });
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
      }

      if (menuItems.length === 0) {
        menuItems.push(
          <MenuItem value="" key="no-target-apps-found" disabled>
            No target apps found
          </MenuItem>
        );
      }
      setTargetOptionsforContext(menuItems);
    };
    fetchIntents();
  };

  const handleAddIntentListener = () => {
    if (!intentListener) {
      setIntentError('Enter intent');
      return;
    } else {
      intentStore.addIntentListener(
        intentListener.value,
        undefined,
        sendIntentResult && resultType === 'context-result' ? toJS(resultTypeContext) : null,
        sendIntentResult && resultType === 'channel-result' ? currentAppChannelId : undefined,
        sendIntentResult && resultType === 'channel-result' ? channelType === 'private-channel' : undefined,
        sendIntentResult && resultType === 'channel-result' ? resultOverChannelContextList : undefined,
        sendIntentResult && resultType === 'channel-result' ? resultOverChannelContextDelays : undefined
      );
      setIntentListener(null);
    }
    setSendIntentResult(false);
  };

  const handleAddIntentListenerWithContext = () => {
    if (!intentListener) {
      setIntentError('Enter intent');
      return;
    } else if (!addIntentListenerWithContextContext) {
      setIntentError('Enter Context');
    } else {
      intentStore.addIntentListener(
        intentListener.value,
        addIntentListenerWithContextContext,
        sendIntentResult && resultType === 'context-result' ? toJS(resultTypeContext) : null,
        sendIntentResult && resultType === 'channel-result' ? currentAppChannelId : undefined,
        sendIntentResult && resultType === 'channel-result' ? channelType === 'private-channel' : undefined,
        sendIntentResult && resultType === 'channel-result' ? resultOverChannelContextList : undefined,
        sendIntentResult && resultType === 'channel-result' ? resultOverChannelContextDelays : undefined
      );
      setIntentListener(null);
      setAddIntentListenerWithContextContext(null);
    }
    setSendIntentResult(false);
  };

  const handleChannelTypeChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
    setChannelType(nextView);
  };

  const handleTargetToggle = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setUseTargets(checked);
    if (!checked) {
      clearTargets();
    }
  };

  const handleContextTargetToggle = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setUseContextTargets(checked);
    if (!checked) {
      clearContextTargets();
    }
  };

  const setChannelContextList = (context: ContextType, index: number) => {
    setResultOverChannelContextList((curr: any) => {
      return { ...curr, [index]: context };
    });
  };

  const setChannelContextDelay = (delay: string, index: number) => {
    setResultOverChannelContextDelays((curr: any) => {
      const lastDelay = curr[index - 1] || 0;
      return { ...curr, [index]: lastDelay + Number(delay) };
    });
  };

  const handleAddContextField = () => {
    setContextFields(current => [
      ...current,
      <Grid container direction="row" key={contextFields.length}>
        <Grid item className={classes.indentLeft}>
          <TextField
            variant="outlined"
            label="Delay (ms)"
            type="number"
            size="small"
            onChange={e => setChannelContextDelay(e.target.value, contextFields.length)}
          />
        </Grid>
        <Grid item className={`${classes.indentLeft} ${classes.field}`}>
          <ContextTemplates
            handleTabChange={handleTabChange}
            contextStateSetter={(context: any) => setChannelContextList(context, contextFields.length)}
          />
        </Grid>
      </Grid>,
    ]);
  };

  useEffect(() => {
    setIntentValue(null);
    const fetchIntents = async () => {
      try {
        if (!raiseIntentContext) {
          return;
        }
        setRaiseIntentError(false);
        let appIntents = await getWorkbenchAgent().then(agent => agent.findIntentsByContext(toJS(raiseIntentContext)));

        setUseTargets(false);
        clearTargets();

        if (appIntents.length > 0) {
          setIntentsForContext(
            appIntents.map(({ intent }: { intent: any }) => {
              return {
                title: intent.name,
                value: intent.name,
              };
            })
          );
        }
      } catch (e) {
        setIntentsForContext([]);
        setRaiseIntentError('no intents found');
      }
    };
    fetchIntents();
  }, [raiseIntentContext]);

  useEffect(() => {
    if (!intentValue) {
      setUseTargets(false);
      clearTargets();
      return;
    }
  }, [intentValue]);

  useEffect(() => {
    clearContextTargets();
    if (!raiseIntentWithContextContext) {
      setUseContextTargets(false);
      return;
    }
  }, [raiseIntentWithContextContext]);

  useEffect(() => {
    if (sendResultOverChannel) {
      handleAddContextField();
    } else {
      setContextFields([]);
    }
  }, [sendResultOverChannel]);

  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5">Raise intent</Typography>
      </Grid>

      <form className={classes.form} noValidate autoComplete="off">
        <Grid container direction="row" spacing={2}>
          <Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
            <Grid item className={classes.field}>
              <ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setRaiseIntentContext} />
              <Autocomplete
                className={classes.rightPadding}
                id="raise-intent"
                size="small"
                selectOnFocus
                blurOnSelect
                clearOnBlur
                handleHomeEndKeys
                value={intentValue}
                onChange={handleChangeListener(setIntentValue, setRaiseIntentError)}
                filterOptions={filterOptions}
                options={intentsForContext || intentListenersOptions}
                getOptionLabel={getOptionLabel}
                renderOption={option => option.title}
                renderInput={params => (
                  <TemplateTextField
                    label="INTENT TYPE"
                    placeholder="Enter Intent Type"
                    variant="outlined"
                    {...params}
                    error={!!raiseIntentError}
                    helperText={raiseIntentError}
                  />
                )}
              />
              <Grid className={classes.rightPadding}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useTargets}
                        onChange={handleTargetToggle}
                        color="primary"
                        disabled={!intentValue}
                      />
                    }
                    label="Select Target"
                  />
                </FormGroup>

                {useTargets && (
                  <FormControl variant="outlined" size="small" className={classes.targetSelect}>
                    <InputLabel id="intent-target-app">Target app (optional)</InputLabel>
                    <Select
                      labelId="intent-target-app"
                      id="intent-target-app-select"
                      value={targetApp ?? ''}
                      onChange={handleTargetChange}
                      onOpen={handleTargetMenuOpen}
                      label="Target App (optional)"
                      MenuProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      {targetOptions}
                    </Select>
                  </FormControl>
                )}
              </Grid>
            </Grid>
            <Grid item className={classes.controls}>
              <Button variant="contained" color="primary" onClick={handleRaiseIntent} disabled={!intentValue}>
                Raise intent
              </Button>

              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={() => {
                    const context = JSON.stringify(raiseIntentContext, null, 2);
                    const intent = String(intentValue);

                    let exampleToUse = codeExamples.raiseIntent(context, intent);
                    if ((targetApp as any)?.instanceId) {
                      exampleToUse = codeExamples.raiseIntentInstance(context, intent);
                    } else if (targetApp) {
                      exampleToUse = codeExamples.raiseIntentTarget(context, intent);
                    }
                    copyToClipboard(exampleToUse, 'raiseIntent')();
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>

              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#raiseintent"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>
          {intentResolution?.source && (
            <Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
              <Grid item className={classes.textField}>
                <IntentResolutionField data={intentResolution} handleTabChange={handleTabChange} />
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => setIntentResolution(null)}>
                  Clear result
                </Button>
              </Grid>
            </Grid>
          )}
          <div className={classes.border}></div>

          <Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
            <Grid item xs={12} className={classes.bottomMargin}>
              <Typography variant="h5">Raise intent for context</Typography>
            </Grid>
            <Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
              <ContextTemplates
                handleTabChange={handleTabChange}
                contextStateSetter={setRaiseIntentWithContextContext}
              />
              <Grid className={classes.rightPadding}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={useContextTargets} color="primary" onChange={handleContextTargetToggle} />
                    }
                    label="Select Target"
                    disabled={!raiseIntentWithContextContext}
                  />
                </FormGroup>

                {useContextTargets && (
                  <FormControl variant="outlined" size="small" className={classes.targetSelect}>
                    <InputLabel id="intent-context-target-app">Target (optional)</InputLabel>
                    <Select
                      labelId="intent-context-target-app"
                      id="intent-context-target-app-select"
                      value={contextTargetApp ?? ''}
                      onChange={handleContextTargetChange}
                      onOpen={handleContextTargetMenuOpen}
                      label="Target App (optional)"
                      MenuProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      {targetOptionsforContext}
                    </Select>
                  </FormControl>
                )}
              </Grid>
            </Grid>
            <Grid item className={classes.controls}>
              <Button
                disabled={!raiseIntentWithContextContext}
                variant="contained"
                color="primary"
                onClick={handleRaiseIntentForContext}
              >
                Raise intent for context
              </Button>

              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={() => {
                    const context = JSON.stringify(raiseIntentWithContextContext, null, 2);
                    let exampleToUse = codeExamples.raiseIntentForContext(context);
                    if ((contextTargetApp as any)?.instanceId) {
                      exampleToUse = codeExamples.raiseIntentForContextInstance(context);
                    } else if (contextTargetApp) {
                      exampleToUse = codeExamples.raiseIntentForContextTarget(context);
                    }
                    copyToClipboard(exampleToUse, 'raiseIntentForContext')();
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>

              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#raiseintentforcontext"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>
          {intentForContextResolution?.source && (
            <Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
              <Grid item className={classes.textField}>
                <IntentResolutionField data={intentForContextResolution} handleTabChange={handleTabChange} />
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => setIntentForContextResolution(null)}>
                  Clear result
                </Button>
              </Grid>
            </Grid>
          )}
          <div className={classes.border}></div>

          <Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
            <Grid item xs={12}>
              <Typography className={classes.bottomMargin} variant="h5">
                Add intent listener
              </Typography>
            </Grid>
            <Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
              <Autocomplete
                id="intent-listener"
                size="small"
                selectOnFocus
                blurOnSelect
                clearOnBlur
                handleHomeEndKeys
                value={intentListener}
                onChange={handleChangeListener(setIntentListener, setIntentError)}
                filterOptions={filterOptions}
                options={intentListenersOptions}
                getOptionLabel={getOptionLabel}
                renderOption={option => option.title}
                renderInput={params => (
                  <TemplateTextField
                    label="INTENT LISTENER"
                    placeholder="Enter Intent Type"
                    variant="outlined"
                    {...params}
                    error={!!intentError}
                    helperText={intentError}
                  />
                )}
              />
            </Grid>

            <Grid item className={classes.controls}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddIntentListener}
                disabled={intentListener === null}
              >
                Add listener
              </Button>

              <Tooltip title="Copy code example" aria-label="Copy code example">
                <IconButton
                  size="small"
                  aria-label="Copy code example"
                  color="primary"
                  onClick={() => {
                    let exampleToUse = codeExamples.intentListener;
                    if (resultType === 'context-result') {
                      exampleToUse = codeExamples.intentListenerWithContextResult;
                    } else if (resultType === 'channel-result') {
                      if (channelType === 'app-channel') {
                        exampleToUse = codeExamples.intentListenerWithAppChannel;
                      } else {
                        exampleToUse = codeExamples.intentListenerWithPrivateChannel;
                      }
                    }
                    copyToClipboard(exampleToUse, 'addIntentListener')();
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>

              <Link
                onClick={openApiDocsLink}
                target="FDC3APIDocs"
                href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#addintentlistener"
              >
                <InfoOutlinedIcon />
              </Link>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.input}
                    color="default"
                    checked={addListenerWithContext}
                    onChange={e => setAddListenerWithContext(e.target.checked)}
                  />
                }
                label="Add intent listener with context"
              />
            </FormGroup>
          </Grid>

          {addListenerWithContext && (
            <Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
              <Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
                <ContextTemplates
                  handleTabChange={handleTabChange}
                  contextStateSetter={setAddIntentListenerWithContextContext}
                />
              </Grid>
              <Grid item className={classes.controls}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddIntentListenerWithContext}
                  disabled={intentListener === null || addIntentListenerWithContextContext === null}
                >
                  Add listener
                </Button>

                <Tooltip title="Copy code example" aria-label="Copy code example">
                  <IconButton
                    size="small"
                    aria-label="Copy code example"
                    color="primary"
                    onClick={() => {
                      let exampleToUse = codeExamples.intentListenerWithContext;
                      copyToClipboard(exampleToUse, 'addIntentListenerWithContext')();
                    }}
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>

                <Link
                  onClick={openApiDocsLink}
                  target="FDC3APIDocs"
                  href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#addintentlistenerWithContext"
                >
                  <InfoOutlinedIcon />
                </Link>
              </Grid>
            </Grid>
          )}

          {window.fdc3Version === '2.0' && (
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      className={classes.input}
                      color="default"
                      checked={sendIntentResult}
                      onChange={e => setSendIntentResult(e.target.checked)}
                    />
                  }
                  label="Send intent result"
                />
              </FormGroup>
            </Grid>
          )}

          {sendIntentResult && (
            <Grid item xs={12} className={classes.indentLeft}>
              <RadioGroup name="intent-result-type" value={resultType} onChange={e => setResultType(e.target.value)}>
                <FormControlLabel
                  value="context-result"
                  control={<Radio className={classes.input} />}
                  label="Context result"
                />
                {resultType === 'context-result' && (
                  <Grid item className={classes.indentLeft}>
                    <ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setResultTypeContext} />
                  </Grid>
                )}
                <FormControlLabel
                  value="channel-result"
                  control={<Radio className={classes.input} />}
                  label="Channel result"
                />
                {resultType === 'channel-result' && (
                  <Grid item className={classes.indentLeft}>
                    <ToggleButtonGroup
                      value={channelType}
                      exclusive
                      onChange={handleChannelTypeChange}
                      aria-label="result channel type"
                    >
                      <ToggleButton className={classes.toggle} value="app-channel" aria-label="left aligned">
                        App channel
                      </ToggleButton>
                      <ToggleButton className={classes.toggle} value="private-channel" aria-label="left aligned">
                        Private channel
                      </ToggleButton>
                    </ToggleButtonGroup>

                    {channelType === 'app-channel' && (
                      <Grid item className={classes.field}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Channel Name"
                          type="text"
                          size="small"
                          onChange={(e: any) => setCurrentAppChannelId(e.target.value)}
                          value={currentAppChannelId}
                        />
                      </Grid>
                    )}
                    <FormGroup>
                      {channelType === 'private-channel' && (
                        <Typography variant="caption" className={classes.caption}>
                          Context streaming will start AFTER a context listener is added to the channel
                        </Typography>
                      )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            className={classes.input}
                            color="default"
                            checked={sendResultOverChannel}
                            onChange={e => setSendResultOverChannel(e.target.checked)}
                          />
                        }
                        label="Send context result over channel"
                      />
                    </FormGroup>
                    {sendResultOverChannel && (
                      <>
                        {contextFields.map((field, index) => (
                          <React.Fragment key={index}>{field}</React.Fragment>
                        ))}
                        <Grid item className={`${classes.indentLeft} ${classes.controls}`}>
                          <Tooltip
                            title="Add context result (delays will trigger sequentially)"
                            aria-label="Add context result (delays will trigger sequentially)"
                          >
                            <IconButton
                              size="small"
                              aria-label="Add context result (delays will trigger sequentially)"
                              color="primary"
                              onClick={handleAddContextField}
                            >
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </Tooltip>

                          <Link
                            target="FDC3APIDocs"
                            href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#addintentlistener"
                          >
                            <InfoOutlinedIcon />
                          </Link>
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              </RadioGroup>
            </Grid>
          )}
          <Grid item xs={12}>
            <Alert severity="info">
              Desktop Agents often require apps that listen for intents to include the intent in their appD record.
              Refer to your Desktop Agent&apos;s documentation if the workbench doesn&apos;t appear in the intent
              resolver.
            </Alert>
          </Grid>
        </Grid>
      </form>
    </div>
  );
});
