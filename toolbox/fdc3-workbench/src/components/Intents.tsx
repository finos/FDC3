import React, { useEffect, useState } from "react";
import fdc3, { AppIntent, AppMetadata, ContextType, IntentResolution } from "../utility/Fdc3Api";
import { toJS } from "mobx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import { observer } from "mobx-react";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { ContextTemplates } from "../components/ContextTemplates";
import intentStore from "../store/IntentStore";
import { codeExamples } from "../fixtures/codeExamples";
import { TemplateTextField } from "./common/TemplateTextField";
import { copyToClipboard } from "./common/CopyToClipboard";
import { IntentResolutionField } from "./IntentResolutionField";

import { Checkbox } from "@material-ui/core";
import { FormGroup } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { RadioGroup } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

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
			display: "flex",
			alignItems: "center",
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
		bottomMargin: {
			marginBottom: theme.spacing(1),
		},
		removeSidePadding: {
			paddingLeft: 0,
		},
		targetSelect: {
			width: "100%",
			marginRight: theme.spacing(1),
		},
		rightPadding: {
			paddingRight: theme.spacing(0.5),
		},
		input: {
			color: "#0086bf",
			outline: "1px",
			"&.Mui-checked": {
				color: "#0086bf",
			},
		},
		toggle: {
			"&.Mui-selected": {
				color: "#0086bf",
				backgroundColor: "rgba(0, 134, 191, 0.21)",
			},
		},
		indentLeft: {
			marginLeft: "30px",
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
	const [intentTargets, setIntentTargets] = useState<AppMetadata[] | null>(null);
	const [intentInstances, setIntentInstances] = useState<any[]>([]);
	const [intentContextInstances, setIntentContextInstances] = useState<any[]>([]);
	const [targetApp, setTargetApp] = useState<string | null>(null);
	const [targetInstance, setTargetInstance] = useState<any | null>(null);
	const [targetContextInstance, setTargetContextInstance] = useState<any | null>(null);
	const [contextTargetApp, setContextTargetApp] = useState<string | null>(null);
	const [intentObjects, setIntentObjects] = useState<AppIntent[] | null>(null);
	const [contextIntentObjects, setContextIntentObjects] = useState<any[] | null>(null);
	const [raiseIntentContext, setRaiseIntentContext] = useState<ContextType | null>(null);
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
	const [channelType, setChannelType] = useState<string | null>("app-channel");
	const [sendResultOverChannel, setSendResultOverChannel] = useState<boolean | undefined>(false);
	const [currentAppChannelId, setCurrentAppChannelId] = useState<string>("");

	const handleRaiseIntent = async () => {
		setIntentResolution(null);
		if (!intentValue) {
			setRaiseIntentError("enter intent name");
		} else if (!raiseIntentContext) {
			setRaiseIntentError("enter context name");
		} else if (targetInstance && intentInstances){
			let targetObject = intentInstances.find((target) => target.instanceId === targetInstance.instanceId);
			if (targetObject) {
				setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext, targetObject));
				setRaiseIntentError("");
			}
		} else if (targetApp && intentTargets) {
			let targetObject = intentTargets.find((target) => target.appId === targetApp || target.name === targetApp);
			if (targetObject) {
				setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext, targetObject));
				setRaiseIntentError("");
			}
		} else {
			setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext));
			setRaiseIntentError("");
		}
	};

	const handleRaiseIntentForContext = async () => {
		if (!raiseIntentWithContextContext) {
			return;
		}
		if (targetContextInstance && intentContextInstances){
			let targetObject = intentContextInstances.find((target) => target.instanceId === targetContextInstance.instanceId);
			if (targetObject) {
				setIntentForContextResolution(await intentStore.raiseIntentForContext(raiseIntentWithContextContext, targetObject));
			}
		} else if (contextTargetApp && contextIntentObjects) {
			let targetObject = contextIntentObjects.find((target) => target.name === contextTargetApp);
			setIntentForContextResolution(
				await intentStore.raiseIntentForContext(raiseIntentWithContextContext, targetObject.app)
			);
		} else {
			setIntentForContextResolution(await intentStore.raiseIntentForContext(raiseIntentWithContextContext));
		}
	};

	const handleTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		const fetchInstances = async () => {
			if (event.target.value === "None") {
				setTargetApp("");
				setIntentInstances([]);
			} else {
				const currentTargetApp= event.target.value as string;
				setTargetApp(currentTargetApp);
				if(window.fdc3Version == "2.0"){	
					let instances = await fdc3.findInstances({appId: currentTargetApp });
					setIntentInstances(instances);
				}
			}
		};
		fetchInstances();
	};

	const handleAppInstancesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		if (event.target.value === "None") {
			setTargetInstance("");
		} else {
			const instanceExists = intentInstances.find((currentInstance) => currentInstance.instanceId === event.target.value);
			setTargetInstance(instanceExists);
		}
	};

	const handleAppContextInstancesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		if (event.target.value === "None") {
			setTargetContextInstance("");
		} else {
			const instanceExists = intentContextInstances.find((currentInstance) => currentInstance.instanceId === event.target.value);
			setTargetContextInstance(instanceExists);
		}
	};

	const handleContextTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		const fetchInstances = async () => {
			if (event.target.value === "None") {
				setContextTargetApp("");
				setIntentContextInstances([]);
			} else {
				const currentTargetApp= event.target.value as string;
				setContextTargetApp(currentTargetApp);
				if(window.fdc3Version == "2.0"){	
					let foundAppObject = contextIntentObjects?.find((currentIntentObj)=>currentIntentObj.name === currentTargetApp);
					let instances = await fdc3.findInstances({appId: foundAppObject.appId });
					setIntentContextInstances(instances);
				}
			}
		};
		fetchInstances();
	};

	const handleChangeListener =
		(setValue: ListenerSetValue, setError: ListenerSetError) => (event: React.ChangeEvent<{}>, newValue: any) => {
			if (typeof newValue === "string") {
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

		if (params.inputValue !== "") {
			filtered.push({
				value: params.inputValue,
				title: `Add "${params.inputValue}"`,
			});
		}

		return filtered;
	};

	const handleAddIntentListener = () => {
		if (!intentListener) {
			setIntentError("Enter intent");
			return;
		} else {
			console.log(channelType);
			intentStore.addIntentListener(
				intentListener.value,
				toJS(resultTypeContext),
				currentAppChannelId,
				channelType === "private-channel",
				resultOverChannelContextList,
				resultOverChannelContextDelays
			);
			setIntentListener(null);
		}
	};

	const handleChannelTypeChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
		setChannelType(nextView);
	};

	const setChannelContextList = (context: ContextType, index: number) => {
		console.log(index, context);
		setResultOverChannelContextList((curr: any) => {
			return { ...curr, [index]: context };
		});
	};

	const setChannelContextDelay = (delay: string, index: number) => {
		console.log(index, delay);
		setResultOverChannelContextDelays((curr: any) => {
			return { ...curr, [index]: delay };
		});
	};

	const handleAddContextField = () => {
		setContextFields((current) => [
			...current,
			<Grid container direction="row" key={contextFields.length}>
				<Grid item className={classes.indentLeft}>
					<TextField
						variant="outlined"
						label="Delay"
						type="number"
						size="small"
						onChange={(e) => setChannelContextDelay(e.target.value, contextFields.length)}
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
		console.log(contextFields);
	};

	useEffect(() => {
		setIntentValue(null);
		const fetchIntents = async () => {
			try {
				if (raiseIntentContext) {
					let appIntents = await fdc3.findIntentsByContext(toJS(raiseIntentContext));
					if (appIntents) {
						setIntentObjects(appIntents);
						setIntentsForContext(
							appIntents.map(({ intent }: { intent: any }) => {
								return {
									title: intent.name,
									value: intent.name,
								};
							})
						);
					}
				}
			} catch (e) {
				setRaiseIntentError("no intents found");
			}
		};
		fetchIntents();
	}, [raiseIntentContext]);

	useEffect(() => {
		if(!intentValue){
			setTargetApp(null);
			setIntentInstances([]);
			setTargetInstance(null);
		}
		if (intentObjects) {
			const targets = intentObjects.find((obj) => obj.intent.name === intentValue?.value);
			if (targets?.apps) {
				setIntentTargets(targets.apps);
			}
		}
	}, [intentValue]);

	useEffect(() => {
		const fetchIntents = async () => {
			if (!raiseIntentWithContextContext) {
				return;
			}
			try {
				let appIntentsForContext = await fdc3.findIntentsByContext(toJS(raiseIntentWithContextContext));
				if (!appIntentsForContext) {
					return;
				}

				let pairObject: any[] = [];
				appIntentsForContext.forEach((intent) => {
					intent?.apps.forEach((app) => {
						pairObject.push({
							appId: app.appId || app.name,
							name: `${app.appId || app.name} - ${intent.intent.name}`,
							app,
						});
					});
				});
				setContextIntentObjects(pairObject as any[]);
			} catch (e) {}
		};
		fetchIntents();
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
				<Typography variant="h5">Raise Intent</Typography>
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
								renderOption={(option) => option.title}
								renderInput={(params) => (
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
								<FormControl variant="outlined" size="small" className={classes.targetSelect}>
									<InputLabel id="intent-target-app">Target App (optional)</InputLabel>
									<Select
										labelId="intent-target-app"
										id="intent-target-app-select"
										value={targetApp ?? ""}
										onChange={handleTargetChange}
										label="Target App (optional)"
										MenuProps={{
											anchorOrigin: {
												vertical: "bottom",
												horizontal: "left",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "left",
											},
											getContentAnchorEl: null,
										}}
									>
										{!intentTargets?.length && (
											<MenuItem value="" disabled>
												No Target Apps Found
											</MenuItem>
										)}
										{intentTargets?.length && (
											<MenuItem key="" value="None">
												None
											</MenuItem>
										)}
										{intentTargets?.length &&
											intentTargets.map((target) => (
												<MenuItem key={target.appId || target.name} value={target.appId || target.name}>
													{target.appId || target.name}
												</MenuItem>
											))}
									</Select>
								</FormControl>
								
								{intentInstances?.length > 0 && (
									<FormControl variant="outlined" size="small" className={classes.targetSelect}>
										<InputLabel id="intent-target-instance">Target Instance (optional)</InputLabel>
										<Select
											labelId="intent-target-instance"
											id="intent-target-instance-select"
											value={targetInstance?.instanceId ?? ""}
											onChange={handleAppInstancesChange}
											label="Target Instance (optional)"
											MenuProps={{
												anchorOrigin: {
													vertical: "bottom",
													horizontal: "left",
												},
												transformOrigin: {
													vertical: "top",
													horizontal: "left",
												},
												getContentAnchorEl: null,
											}}
										>
											{intentInstances?.length && (
												<MenuItem key="" value="None">
													None
												</MenuItem>
											)}
											{intentInstances?.length && 
												intentInstances.map((target: any) => (
													<MenuItem key={target.instanceId} value={target.instanceId}>
														{target.instanceId}
													</MenuItem>
												))
											}
										</Select>
									</FormControl>
								)}
							</Grid>
						</Grid>
						<Grid item className={classes.controls}>
							<Button variant="contained" color="primary" onClick={handleRaiseIntent} disabled={!raiseIntentContext}>
								Raise Intent
							</Button>

							<Tooltip title="Copy code example" aria-label="Copy code example">
								<IconButton
									size="small"
									aria-label="Copy code example"
									color="primary"
									onClick={copyToClipboard(codeExamples.raiseIntent, "raiseIntent")}
								>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>
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
							<Typography variant="h5">Raise Intent for Context</Typography>
						</Grid>
						<Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
							<ContextTemplates
								handleTabChange={handleTabChange}
								contextStateSetter={setRaiseIntentWithContextContext}
							/>
							<Grid className={classes.rightPadding}>
								<FormControl variant="outlined" size="small" className={classes.targetSelect}>
									<InputLabel id="intent-context-target-app">Target (optional)</InputLabel>
									<Select
										labelId="intent-context-target-app"
										id="intent-context-target-app-select"
										value={contextTargetApp ?? ""}
										onChange={handleContextTargetChange}
										label="Target (optional)"
										MenuProps={{
											anchorOrigin: {
												vertical: "bottom",
												horizontal: "left",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "left",
											},
											getContentAnchorEl: null,
										}}
									>
										{!contextIntentObjects?.length && (
											<MenuItem value="" disabled>
												No Target Apps Found
											</MenuItem>
										)}
										{contextIntentObjects?.length && (
											<MenuItem key="" value="None">
												None
											</MenuItem>
										)}
										{contextIntentObjects?.length &&
											contextIntentObjects.map((target) => (
												<MenuItem value={target.name} key={target.name}>
													{target.name}
												</MenuItem>
											))}
									</Select>
								</FormControl>
								{intentContextInstances?.length > 0 && (
									<FormControl variant="outlined" size="small" className={classes.targetSelect}>
										<InputLabel id="intent-context-target-instance">Target Instance (optional)</InputLabel>
										<Select
											labelId="intent-context-target-instance"
											id="intent-context-target-instance-select"
											value={targetContextInstance?.instanceId ?? ""}
											onChange={handleAppContextInstancesChange}
											label="Target Instance (optional)"
											MenuProps={{
												anchorOrigin: {
													vertical: "bottom",
													horizontal: "left",
												},
												transformOrigin: {
													vertical: "top",
													horizontal: "left",
												},
												getContentAnchorEl: null,
											}}
										>
											{intentContextInstances?.length && (
												<MenuItem key="" value="None">
													None
												</MenuItem>
											)}
											{intentContextInstances?.length && 
												intentContextInstances.map((target: any) => (
													<MenuItem key={target.instanceId} value={target.instanceId}>
														{target.instanceId}
													</MenuItem>
												))
											}
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
									onClick={copyToClipboard(codeExamples.raiseIntentForContext, "raiseIntentForContext")}
								>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
					{intentForContextResolution?.source && (
						<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
							<Grid item>
								<IntentResolutionField data={intentForContextResolution} handleTabChange={handleTabChange} />
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
						<Grid item xs={12}>
							<Typography className={classes.bottomMargin} variant="h5">
								Add Intent Listener
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
								renderOption={(option) => option.title}
								renderInput={(params) => (
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
								Add Listener
							</Button>

							<Tooltip title="Copy code example" aria-label="Copy code example">
								<IconButton
									size="small"
									aria-label="Copy code example"
									color="primary"
									onClick={copyToClipboard(codeExamples.intentListener, "addIntentListener")}
								>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										className={classes.input}
										color="default"
										checked={sendIntentResult}
										onChange={(e) => setSendIntentResult(e.target.checked)}
									/>
								}
								label="Send Intent Result"
							/>
						</FormGroup>
					</Grid>
					{sendIntentResult && (
						<Grid item xs={12} className={classes.indentLeft}>
							<RadioGroup name="intent-result-type" value={resultType} onChange={(e) => setResultType(e.target.value)}>
								<FormControlLabel
									value="context-result"
									control={<Radio className={classes.input} />}
									label="Context result"
								/>
								{resultType === "context-result" && (
									<Grid item className={classes.indentLeft}>
										<ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setResultTypeContext} />
									</Grid>
								)}
								<FormControlLabel
									value="channel-result"
									control={<Radio className={classes.input} />}
									label="Channel result"
								/>
								{resultType === "channel-result" && (
									<Grid item className={classes.indentLeft}>
										<ToggleButtonGroup
											value={channelType}
											exclusive
											onChange={handleChannelTypeChange}
											aria-label="result channel type"
										>
											<ToggleButton className={classes.toggle} value="app-channel" aria-label="left aligned">
												App Channel
											</ToggleButton>
											<ToggleButton className={classes.toggle} value="private-channel" aria-label="left aligned">
												Private Channel
											</ToggleButton>
										</ToggleButtonGroup>

										{channelType === "app-channel" && (
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
											<FormControlLabel
												control={
													<Checkbox
														className={classes.input}
														color="default"
														checked={sendResultOverChannel}
														onChange={(e) => setSendResultOverChannel(e.target.checked)}
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
												<Grid item className={classes.indentLeft}>
													<Tooltip title="Add context result" aria-label="Add context result">
														<IconButton
															size="small"
															aria-label="Add context result"
															color="primary"
															onClick={handleAddContextField}
														>
															<AddCircleOutlineIcon />
														</IconButton>
													</Tooltip>
												</Grid>
											</>
										)}
									</Grid>
								)}
							</RadioGroup>
						</Grid>
					)}
				</Grid>
			</form>
		</div>
	);
});
