import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, IconButton, Tooltip, Typography, Grid, TextField } from "@material-ui/core";
import { observer } from "mobx-react";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import contextStore, { ContextType } from "../store/ContextStore";
import appChannelStore from "../store/AppChannelStore";
import { codeExamples } from "../fixtures/codeExamples";
import { TemplateTextField } from "./common/TemplateTextField";
import { copyToClipboard } from "./common/CopyToClipboard";
import { ContextTemplates } from "./ContextTemplates";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		title: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
		},
		form: {
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center",
			marginTop: theme.spacing(1),
			"& > *": {
				margin: theme.spacing(1),
				marginLeft: "0px",
			},
		},
        contextType: {
			flexGrow: 1,
			minWidth: "190px",
		},
        topMargin: {
            marginTop: theme.spacing(2),
        },
		controls: {
			"& > *:first-child": {
				marginLeft: 0,
			},
			"& > *": {
				marginRight: theme.spacing(1),
			},
			"& > *:last-child": {
				marginRight: 0,
			},
			"& .MuiIconButton-sizeSmall": {
				padding: "6px",
			},
		},
		rightAlign: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		spread: {
			flexDirection: "row",
			"& > *:first-child": {
				paddingLeft: "0px",
			},
		},
		textField: {
			width: "100%",
			"& input": {
				height: "29px",
				padding: "6px",
			},
		},
		h4: {
			fontSize: "22px",
		},
        h6: {
            fontSize: "14px"
        },
		field: {
			flexGrow: 1,
			marginRight: theme.spacing(1),
			minWidth: "190px",
		},
		border: {
			height: "1px",
			width: "100%",
			backgroundColor: "#acb2c0",
			marginTop: "24px",
			marginBottom: "16px",
		},
        rightPadding: {
            paddingRight: theme.spacing(.5),
        },
	})
);

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

export const AppChannels = observer(({handleTabChange} : {handleTabChange:any}) => {
    const classes = useStyles();
    const [isError, setIsError] = useState<boolean>(false);
    const [render, setRender] = useState<boolean>(false);
    const [currentAppChannelId, setCurrentAppChannelId] = useState<string>("");
    const contextListenersOptions: ListenerOptionType[] = contextStore.contextsList.map(({ id, template }) => {
        return {
			title: id,
			value: id,
			type: template?.type
		};
	});
	contextListenersOptions.unshift({
		title: "All",
		value: "all",
		type: "All"
	});


    const handleGetorCreateChannel = () =>{
        if (currentAppChannelId) {
           let foundChannel = appChannelStore.appChannelsList.find((currentChannel)=>currentChannel.id === currentAppChannelId);
            if (!foundChannel) {
                appChannelStore.getOrCreateChannel(currentAppChannelId);
            }
           setCurrentAppChannelId("");
        }

    };

    const handleChannelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCurrentAppChannelId(event.target.value as string);
    };

    const getOptionLabel = (option: ListenerOptionType) => {
        if (option.value) {
			return option.value;
		}
		return option.title;
	};

    const handleChangeAppListener = (channelId: string) => (event: React.ChangeEvent<{}>, newValue: any) => {
            let foundChannel = appChannelStore.appChannelsList.find((currentChannel)=>currentChannel.id === channelId);
            if (foundChannel) {
                let newListener;
                let foundListener = appChannelStore.appChannelListeners?.find((currentListener)=>currentListener.type === newValue && currentListener.channelId === channelId);

                if(!foundListener){
                    if (typeof newValue === "string") {
                        newListener = {
                            title: newValue,
                            value: newValue,
                            type: newValue
                        };
                    } else if (newValue && newValue.inputValue) {
                        newListener = {
                            title: newValue.inputValue,
                            value: newValue.inputValue,
                            type: newValue.inputValue
                        };
                    } else {
                        newListener = newValue;
                    }
    
                    foundChannel.currentListener = newListener;
                    foundChannel.listenerError = "";
                    
                }
            }
		};
    
    const handleAddContextListener = (channelId: string) => {
        let foundChannel = appChannelStore.appChannelsList.find((currentChannel)=>currentChannel.id === channelId);
        if(foundChannel){
            if(foundChannel?.currentListener){
                if (appChannelStore.isContextListenerExists(channelId, foundChannel?.currentListener.value)) {
                    foundChannel.listenerError = "Listener already added";
                    setRender(true);
                } else {
                    appChannelStore.addChannelListener(channelId, foundChannel.currentListener.value);
                    foundChannel.listenerError = "";
                    setRender(true);
                }
            } else {
                foundChannel.listenerError = "Enter context type";
                setRender(true);
            }
        }
	};

    const handleContextStateChange = (context: ContextType, channel: string) => {
        let foundChannel = appChannelStore.appChannelsList.find((currentChannel)=>currentChannel.id === channel);
		if(foundChannel) {
			foundChannel.context = context
		}
	};

    const handleBroadcast = (channel: any) => {
        if (channel.context) {
            appChannelStore.broadcast(channel.id, channel.context);
        }
    };

	const filterOptions = (options: ListenerOptionType[], params: FilterOptionsState<ListenerOptionType>) => {
        const filtered = listenerFilter(options, params);
		if (params.inputValue !== "") {
			filtered.push({
				value: params.inputValue,
				title: `Add "${params.inputValue}"`,
				type: params.inputValue
			});
		}
		return filtered;
	};

    return (
        <div className={classes.root}>
            <Grid item xs={12}>
				<Typography variant="h5">Get Channel</Typography>
			</Grid>

            <form className={classes.form} noValidate autoComplete="off">
                <Grid container direction="row" spacing={1}>
                    <Grid item className={classes.field}>
                        <TextField 
                            fullWidth 
                            variant="outlined" 
                            label="Channel Name" 
                            type="text" 
                            size="small" 
                            onChange={handleChannelChange}
                        />
                    </Grid>
                    <Grid item className={classes.controls}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGetorCreateChannel}
                            disabled={!currentAppChannelId}
                        >
                            Get or Create Channel
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <div className={classes.border}></div>
                {appChannelStore.appChannelsList.length > 0 && (
                    appChannelStore.appChannelsList.map((channel) => (
                        <Grid container key={channel.id} spacing={2} className={classes.spread}>
                            <Grid item className={classes.field}>
                                <Typography variant="h5">
                                    Channel: {channel.id}
                                </Typography>
                            </Grid>

                            <Grid container className={classes.topMargin}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" className={classes.h6}>
                                        Broadcast Context
                                    </Typography>
                                </Grid>
                                
                                <Grid item sm={7}>
                                    <ContextTemplates handleTabChange={handleTabChange} contextStateSetter={handleContextStateChange} channel={channel.id} />
                                </Grid>
                                <Grid item container className={classes.controls} sm={5} justifyContent="flex-end">
                                    <Button
                                        disabled={!channel.context}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleBroadcast(channel)}
                                    >
                                        Broadcast Context
                                    </Button>

                                    <Tooltip title="Copy code example" aria-label="Copy code example">
                                        <IconButton
                                            size="small"
                                            aria-label="Copy code example"
                                            color="primary"
                                            onClick={copyToClipboard(codeExamples.appChannelBroadcast, "appChannelBroadcast")}
                                        >
                                            <FileCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container>
                            <Grid item xs={12}>
                                    <Typography variant="h5" className={classes.h6}>
                                        Add Context Listener
                                    </Typography>
                                </Grid>
                                <Grid item sm={7} className={classes.rightPadding}>
                                    <Autocomplete
                                        size="small"
                                        selectOnFocus
                                        blurOnSelect
                                        clearOnBlur
                                        handleHomeEndKeys
                                        value={channel.currentListener}
                                        onChange={handleChangeAppListener(channel.id)}
                                        filterOptions={filterOptions}
                                        options={contextListenersOptions}
                                        getOptionLabel={getOptionLabel}
                                        renderOption={(option) => option.type}
                                        renderInput={(params) => (
                                            <TemplateTextField
                                                label="CONTEXT TYPE"
                                                placeholder="Enter Context Type"
                                                variant="outlined"
                                                {...params}
                                                error={!!channel.listenerError}
                                                helperText={channel.listenerError}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item className={classes.controls} sm={5} justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={()=>handleAddContextListener(channel.id)}
                                    >
                                        Add Listener
                                    </Button>

                                    <Tooltip title="Copy code example" aria-label="Copy code example">
                                        <IconButton
                                            size="small"
                                            aria-label="Copy code example"
                                            color="primary"
                                            onClick={copyToClipboard(codeExamples.appChannelContextListener, "addAppChannelContextListener")}
                                        >
                                            <FileCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <div className={classes.border}></div>
                        </Grid>
                    ))
                )}
        </div>
    );
});