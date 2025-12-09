/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { HTMLAttributes, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import appChannelStore from '../store/AppChannelStore';
import privateChannelStore from '../store/PrivateChannelStore';
import { Button, IconButton, Tooltip, Typography, Grid, Link, Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { ContextTemplates } from './ContextTemplates';
import { ContextType, Fdc3Listener } from '../utility/Fdc3Api';
import { copyToClipboard } from './common/CopyToClipboard';
import { codeExamples } from '../fixtures/codeExamples';
import { openApiDocsLink } from '../fixtures/openApiDocs';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import contextStore from '../store/ContextStore';
import { TemplateTextField } from './common/TemplateTextField';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ListenerOptionType {
  title: string;
  value: string;
  type: string | undefined;
}

interface FilterOptionsState<T> {
  inputValue: string;
  getOptionLabel: (option: T) => string;
}

const listenerFilter = createFilterOptions<ListenerOptionType>();

const styles = {
  topMargin: {
    mt: 2,
  },
  secondMargin: {
    mt: 1,
  },
  controls: {
    '& > *:first-child': {
      marginLeft: 0,
    },
    '& > *': {
      mr: 1,
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
  },
  spread: {
    flexDirection: 'row',
    '& > *:first-child': {
      paddingLeft: '0px',
    },
  },
  h6: {
    fontSize: '14px',
  },
  field: {
    flexGrow: 1,
    mr: 1,
    minWidth: '190px',
  },
  border: {
    height: '1px',
    width: '100%',
    backgroundColor: '#acb2c0',
    marginTop: '24px',
    marginBottom: '16px',
  },
  rightPadding: {
    pr: 0.5,
  },
};

export const ChannelField = observer(
  ({
    handleTabChange,
    channelsList,
    isPrivateChannel = false,
    channelName,
  }: {
    handleTabChange: any;
    channelsList: any;
    isPrivateChannel?: boolean;
    channelName?: string;
  }) => {
    const [contextItem, setContextItem] = useState<ContextType | null>(null);
    const [currentChannelList, setCurrentChannelList] = useState<any>(channelsList);

    const channelStore = isPrivateChannel ? privateChannelStore : appChannelStore;

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

    const getOptionLabel = (option: ListenerOptionType | string) =>
      typeof option === 'string' ? option : option.type ?? option.title ?? '';

    const handleAddContextListener = (channelId: string) => {
      let foundChannel = currentChannelList.find((currentChannel: any) => currentChannel.id === channelId);
      if (!foundChannel) {
        return;
      }

      if (foundChannel?.currentListener) {
        if (channelStore.isContextListenerExists(channelId, foundChannel?.currentListener.type)) {
          foundChannel.listenerError = 'Listener already added';
        } else {
          channelStore.addChannelListener(foundChannel, foundChannel.currentListener.type);
          foundChannel.listenerError = '';
        }
      } else {
        foundChannel.listenerError = 'Enter context type';
      }
    };

    const handleContextStateChange = (context: ContextType, channel: string) => {
      let foundChannel = currentChannelList.find((currentChannel: any) => currentChannel.id === channel);
      if (foundChannel) {
        setContextItem(context);
        runInAction(() => {
          foundChannel.context = context;
        });
      }
    };

    const handleBroadcast = (channel: any) => {
      if (channel.context && contextItem) {
        channelStore.broadcast(channel, contextItem);
      }
    };

    const handleChangeAppListener = (channelId: string) => (event: React.ChangeEvent<{}>, newValue: any) => {
      let foundChannel = currentChannelList.find((currentChannel: any) => currentChannel.id === channelId);
      if (!foundChannel) {
        return;
      }

      let newListener: ListenerOptionType | undefined;
      let foundListener = channelStore.channelListeners?.find(
        currentListener => currentListener.type === newValue && currentListener.channelId === channelId
      );
      if (foundListener) {
        return;
      }

      if (typeof newValue === 'string') {
        newListener = {
          title: newValue,
          value: newValue,
          type: newValue,
        };
      } else if (newValue && newValue.inputValue) {
        newListener = {
          title: newValue.inputValue,
          value: newValue.inputValue,
          type: newValue.inputValue,
        };
      } else {
        newListener = newValue;
      }

      runInAction(() => {
        foundChannel.currentListener = newListener;
      });
      foundChannel.listenerError = '';
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

    const handleRemoveOrDisconnect = (channel: any) => {
      if (isPrivateChannel) {
        privateChannelStore.disconnect(channel);
      } else {
        appChannelStore.remove(channel);
      }
      setCurrentChannelList(currentChannelList.filter((currentChannel: any) => currentChannel.id !== channel.id));
    };

    useEffect(() => {
      setCurrentChannelList(channelsList);
    }, [channelsList]);

    return (
      <div style={{ marginTop: 16 }}>
        {currentChannelList.length > 0 &&
          currentChannelList.map((channel: any) => {
            const element = (
              <Grid container key={channel.id} sx={styles.spread}>
                <Grid item sx={styles.field}>
                  <Typography variant="h5">Channel: {channel.id}</Typography>
                </Grid>
                <Grid container sx={styles.topMargin}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={styles.h6}>
                      Broadcast
                    </Typography>
                  </Grid>

                  <Grid item sm={7}>
                    <ContextTemplates
                      handleTabChange={handleTabChange}
                      contextStateSetter={handleContextStateChange}
                      channel={channel.id}
                    />
                  </Grid>
                  <Grid item container sx={styles.controls} sm={5} justifyContent="flex-end">
                    <Button
                      disabled={!channel.context}
                      variant="contained"
                      color="primary"
                      onClick={() => handleBroadcast(channel)}
                    >
                      Broadcast
                    </Button>

                    <Tooltip title="Copy code example" aria-label="Copy code example">
                      <IconButton
                        size="small"
                        aria-label="Copy code example"
                        color="primary"
                        onClick={copyToClipboard(codeExamples.appChannelBroadcast, 'channelBroadcast')}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Link
                      onClick={openApiDocsLink}
                      target="FDC3APIDocs"
                      href="https://fdc3.finos.org/docs/api/ref/Channel#broadcast"
                    >
                      <InfoOutlinedIcon />
                    </Link>
                  </Grid>
                </Grid>
                <Grid container sx={styles.secondMargin}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={styles.h6}>
                      Add context listener
                    </Typography>
                  </Grid>
                  <Grid item sm={7} sx={styles.rightPadding}>
                    <Autocomplete
                      size="small"
                      selectOnFocus
                      blurOnSelect
                      clearOnBlur
                      handleHomeEndKeys
                      value={channel.currentListener ?? null}
                      onChange={handleChangeAppListener(channel.id)}
                      filterOptions={filterOptions}
                      options={contextListenersOptions}
                      getOptionLabel={getOptionLabel}
                      isOptionEqualToValue={(option: ListenerOptionType, value: ListenerOptionType) =>
                        option.type === value.type
                      }
                      freeSolo={true}
                      renderOption={(props: HTMLAttributes<HTMLLIElement>, option: ListenerOptionType) => (
                        <li {...props}>{option.type}</li>
                      )}
                      renderInput={params => (
                        <TemplateTextField
                          label="CONTEXT TYPE"
                          placeholder="Enter Context Type"
                          variant="outlined"
                          {...params}
                          error={!!channel.listenerError}
                          helperText={channel.listenerError}
                        />
                      )}
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                          event.defaultPrevented = true;
                          handleAddContextListener(channel.id);
                        }
                      }}
                    />
                  </Grid>

                  <Grid item container sx={styles.controls} sm={5} justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={() => handleAddContextListener(channel.id)}>
                      Add listener
                    </Button>

                    <Tooltip title="Copy code example" aria-label="Copy code example">
                      <IconButton
                        size="small"
                        aria-label="Copy code example"
                        color="primary"
                        onClick={copyToClipboard(codeExamples.appChannelContextListener, 'addAppContextListener')}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Link
                      onClick={openApiDocsLink}
                      target="FDC3APIDocs"
                      href="https://fdc3.finos.org/docs/api/ref/Channel#addcontextlistener"
                    >
                      <InfoOutlinedIcon />
                    </Link>
                  </Grid>
                </Grid>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveOrDisconnect(channel)} sx={styles.secondMargin}>
                  {isPrivateChannel ? 'Disconnect' : 'Discard Channel'}
                </Button>
                <div style={styles.border}></div>
              </Grid>
            );

            if (channelName) {
              return channel.id === channelName && element;
            } else {
              return element;
            }
          })}
      </div>
    );
  }
);
