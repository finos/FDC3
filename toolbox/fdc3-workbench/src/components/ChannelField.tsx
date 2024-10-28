/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import appChannelStore from "../store/AppChannelStore";
import privateChannelStore from "../store/PrivateChannelStore";
import { Button, IconButton, Tooltip, Typography, Grid, Link } from "@material-ui/core";
import { ContextTemplates } from "./ContextTemplates";
import { ContextType, Fdc3Listener } from "../utility/Fdc3Api";
import { copyToClipboard } from "./common/CopyToClipboard";
import { codeExamples } from "../fixtures/codeExamples";
import { openApiDocsLink } from "../fixtures/openApiDocs";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import contextStore from "../store/ContextStore";
import { TemplateTextField } from "./common/TemplateTextField";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

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
		secondMargin: {
			marginTop: theme.spacing(1),
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
				padding: "6px 0px 6px 0px",
			},
			"& > a": {
				display: "flex",
				padding: "6px 0px 6px 0px",
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
			fontSize: "14px",
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
			paddingRight: theme.spacing(0.5),
		},
	})
);

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
		const classes = useStyles();
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
			title: "All",
			value: "all",
			type: "All",
		});

		const contextListenersOptions = Array.from(
			new Map(contextListenersOptionsAll.reverse().map((item) => [item["type"], item])).values()
		).reverse();

		const getOptionLabel = (option: ListenerOptionType) => option.type ?? option.title ?? option;

		const handleAddContextListener = (channelId: string) => {
			let foundChannel = currentChannelList.find((currentChannel: any) => currentChannel.id === channelId);
			if (!foundChannel) {
				return;
			}

			if (foundChannel?.currentListener) {
				if (channelStore.isContextListenerExists(channelId, foundChannel?.currentListener.type)) {
					foundChannel.listenerError = "Listener already added";
				} else {
					channelStore.addChannelListener(foundChannel, foundChannel.currentListener.type);
					foundChannel.listenerError = "";
				}
			} else {
				foundChannel.listenerError = "Enter context type";
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
				(currentListener) => currentListener.type === newValue && currentListener.channelId === channelId
			);
			if (foundListener) {
				return;
			}

			if (typeof newValue === "string") {
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
			foundChannel.listenerError = "";
		};

		const filterOptions = (options: ListenerOptionType[], params: FilterOptionsState<ListenerOptionType>) => {
			const filtered = listenerFilter(options, params);
			if (params.inputValue !== "") {
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
			<div className={classes.topMargin}>
				{currentChannelList.length > 0 &&
					currentChannelList.map((channel: any) => {
						const element = (
							<Grid container key={channel.id} className={classes.spread}>
								<Grid item className={classes.field}>
									<Typography variant="h5">Channel: {channel.id}</Typography>
								</Grid>
								<Grid container className={classes.topMargin}>
									<Grid item xs={12}>
										<Typography variant="h6" className={classes.h6}>
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
									<Grid item container className={classes.controls} sm={5} justifyContent="flex-end">
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
												onClick={copyToClipboard(codeExamples.appChannelBroadcast, "channelBroadcast")}
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
								<Grid container className={classes.secondMargin}>
									<Grid item xs={12}>
										<Typography variant="h6" className={classes.h6}>
											Add context listener
										</Typography>
									</Grid>
									<Grid item sm={7} className={classes.rightPadding}>
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
											getOptionSelected={(option, value) => option.type === value.type}
											freeSolo={true}
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
											onKeyDown={(event) => {
												if (event.key === "Enter") {
													event.defaultPrevented = true;
													handleAddContextListener(channel.id);
												}
											}}
										/>
									</Grid>

									<Grid item container className={classes.controls} sm={5} justifyContent="flex-end">
										<Button variant="contained" color="primary" onClick={() => handleAddContextListener(channel.id)}>
											Add listener
										</Button>

										<Tooltip title="Copy code example" aria-label="Copy code example">
											<IconButton
												size="small"
												aria-label="Copy code example"
												color="primary"
												onClick={copyToClipboard(codeExamples.appChannelContextListener, "addAppContextListener")}
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
								<Button
									variant="contained"
									color="secondary"
									onClick={() => handleRemoveOrDisconnect(channel)}
									className={classes.secondMargin}
								>
									{isPrivateChannel ? "Disconnect" : "Discard Channel"}
								</Button>
								<div className={classes.border}></div>
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
