import React, { useEffect, useState } from "react";
import * as fdc3 from "@finos/fdc3";
import { toJS } from "mobx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, IconButton, Tooltip, Typography, Grid, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { observer } from "mobx-react";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import {ContextTemplates} from "../components/ContextTemplates";
import intentStore from "../store/IntentStore";
import { codeExamples } from "../fixtures/codeExamples";
import { TemplateTextField } from "./common/TemplateTextField";
import { copyToClipboard } from "./common/CopyToClipboard";
import { AppIntent, AppMetadata, Context } from "@finos/fdc3";

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
			alignItems: "center"
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
            paddingRight: theme.spacing(.5),
        },
	})
);

const filter = createFilterOptions<ListenerOptionType>();

export const Intents = observer(({handleTabChange}: {handleTabChange:any}) => {
	const classes = useStyles();
	const [intentValue, setIntentValue] = useState<ListenerOptionType | null>(null);
	const [raiseIntentError, setRaiseIntentError] = useState<string | false>(false);
	const [intentListener, setIntentListener] = useState<ListenerOptionType | null>(null);
	const [intentsForContext, setIntentsForContext] = useState<ListenerOptionType[] | null>(null);
	const [intentTargets, setIntentTargets] = useState<AppMetadata[]| null>(null);
	const [targetApp, setTargetApp] = useState<string| null>(null);
	const [contextTargetApp, setContextTargetApp] = useState<string| null>(null);
	const [intentObjects, setIntentObjects] = useState< AppIntent[]| null>(null);
	const [contextIntentObjects, setContextIntentObjects] = useState< any[]| null>(null);
	const [raiseIntentContext, setRaiseIntentContext] = useState<Context | null>(null)
	const [raiseIntentWithContextContext, setRaiseIntentWithContextContext] = useState<Context | null>(null)
	const [intentError, setIntentError] = useState<string | false>(false);
	const intentListenersOptions: ListenerOptionType[] = intentStore.intentsList;

	const handleRaiseIntent = () => {
		if (!intentValue) {
			setRaiseIntentError(" enter intent name");
		} else if(!raiseIntentContext){
			setRaiseIntentError(" enter context name");
		} else if (targetApp && intentTargets) {
			let targetObject = intentTargets.find((target) => target.name === targetApp);
			if (targetObject) {
				intentStore.raiseIntent(intentValue.value, raiseIntentContext, targetObject);
				setRaiseIntentError("");
			}
		} else {
			intentStore.raiseIntent(intentValue.value, raiseIntentContext);
			setRaiseIntentError("");
		}
	};

	const handleRaiseIntentForContext = () => {
		if(raiseIntentWithContextContext){
			if(contextTargetApp && contextIntentObjects) {
				let targetObject = contextIntentObjects.find((target) => target.name === contextTargetApp);
				intentStore.raiseIntentForContext(raiseIntentWithContextContext, targetObject);
			} else {
				intentStore.raiseIntentForContext(raiseIntentWithContextContext);
			}
		} 
	};

	const handleTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		if (event.target.value === "None") {
			setTargetApp("");
		} else{
			setTargetApp(event.target.value as string);
		}
		
	};

	const handleContextTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		if (event.target.value === "None") {
			setContextTargetApp("");
		} else{
			setContextTargetApp(event.target.value as string);
		}		
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

	const getOptionLabel = (option: ListenerOptionType) => {
		if (option.value) {
			return option.value;
		}
		return option.title;
	};

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
		if (intentListener) {
			intentStore.addIntentListener(intentListener.value);
			setIntentListener(null);
		} else {
			setIntentError("Enter intent");
		}
	};

	useEffect(() => {
		setIntentValue(null)
		const fetchIntents = async () => {
			try {
				if(raiseIntentContext) {
					let appIntents = await fdc3.findIntentsByContext(toJS(raiseIntentContext));
					if (appIntents) {
						setIntentObjects(appIntents);
						setIntentsForContext(appIntents.map(({intent}: {intent:any})=>{
							return {
								title: intent.name.includes('fdc3') ? intent.name.split('.')[1] : intent.name,
								value: intent.name.includes('fdc3') ? intent.name.split('.')[1] : intent.name
							}
						}));
					}
				}
			} catch (e){
				setRaiseIntentError(" no intents found");
			}
		}
		fetchIntents();
		
	}, [raiseIntentContext]);

	useEffect(() => {
		if(intentObjects){
			let targets = intentObjects.find((obj) => obj.intent.displayName === intentValue?.value);
			if(targets?.apps){
				setIntentTargets(targets.apps);
			}
		}
	}, [intentValue]);

	useEffect(() => {
		const fetchIntents = async () => {
			try {
				if(raiseIntentWithContextContext) {
					let appIntentsForContext = await fdc3.findIntentsByContext(toJS(raiseIntentWithContextContext));
					if (appIntentsForContext) {
						let pairObject: any[] = [];
						appIntentsForContext.forEach((intent)=>{
							intent?.apps.forEach((app)=>{
								pairObject.push( {
									name: `${app.name} - ${intent.intent.name}`,
									app
								});
							})
						});
						setContextIntentObjects(pairObject as any[]);
					}
				}
			} catch (e){
			}
		}
		fetchIntents();
		
	}, [raiseIntentWithContextContext]);

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
									<InputLabel id="intent-target-app">Target (optional)</InputLabel>
									<Select
										labelId="intent-target-app"
										id="intent-target-app-select"
										value={targetApp ?? ""}
										onChange={handleTargetChange}
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
										{!intentTargets?.length && (
											<MenuItem value="" disabled>
												No Target Apps Found
											</MenuItem>
										)}
										{intentTargets?.length && <MenuItem key="" value="None">
												None
											</MenuItem>}
										{intentTargets?.length &&
											intentTargets.map((target) => (
												<MenuItem key={target.name} value={target.name}>
													{target.title}
												</MenuItem>
											))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						<Grid item className={classes.controls}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleRaiseIntent}
								disabled={!raiseIntentContext}
							>
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

					<div className={classes.border}></div>

					<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
						<Grid item xs={12} className={classes.bottomMargin}>
							<Typography variant="h5">Raise Intent for Context</Typography>
						</Grid>
						<Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
							<ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setRaiseIntentWithContextContext} />
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
										{contextIntentObjects?.length && <MenuItem key="" value="None">
												None
											</MenuItem>}
										{contextIntentObjects?.length &&
											contextIntentObjects.map((target) => (
												<MenuItem value={target.name} key={target.name} >
													{target.name}
												</MenuItem>
											))
										}
									</Select>
								</FormControl>
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

					<div className={classes.border}></div>

					<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
						<Grid item xs={12}>
							<Typography className={classes.bottomMargin} variant="h5">Add Context Listener</Typography>
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
				</Grid>
			</form>
		</div>
	);
});
