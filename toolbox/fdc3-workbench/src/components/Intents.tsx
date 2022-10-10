import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, IconButton, Tooltip, Typography, Grid } from "@material-ui/core";
import { observer } from "mobx-react";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import contextStore from "../store/ContextStore";
import intentStore from "../store/IntentStore";
import { codeExamples } from "../fixtures/codeExamples";
import { TemplateTextField } from "./common/TemplateTextField";
import { copyToClipboard } from "./common/CopyToClipboard";

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
	})
);

const filter = createFilterOptions<ListenerOptionType>();

export const Intents = observer(() => {
	const classes = useStyles();
	const [intentValue, setIntentValue] = useState<ListenerOptionType | null>(null);
	const [raiseIntentError, setRaiseIntentError] = useState<string | false>(false);
	const [intentListener, setIntentListener] = useState<ListenerOptionType | null>(null);
	const [intentError, setIntentError] = useState<string | false>(false);
	const intentListenersOptions: ListenerOptionType[] = intentStore.intentsList;
	const context = JSON.parse(JSON.stringify(contextStore.currentContext))?.type;

	const handleRaiseIntent = () => {
		if (intentValue) {
			intentStore.raiseIntent(intentValue.value);
			setRaiseIntentError("");
		} else {
			setRaiseIntentError(" enter intent name");
		}
	};

	const handleRaiseIntentForContext = () => {
		intentStore.raiseIntentForContext();
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

	return (
		<div className={classes.root}>
			<Grid item xs={12}>
				<Typography variant="h5">Raise Intent</Typography>
			</Grid>

			<form className={classes.form} noValidate autoComplete="off">
				<Grid container direction="row" spacing={2}>
					<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
						<Grid item className={classes.field}>
							<Autocomplete
								id="raise-intent"
								size="small"
								selectOnFocus
								blurOnSelect
								clearOnBlur
								handleHomeEndKeys
								value={intentValue}
								onChange={handleChangeListener(setIntentValue, setRaiseIntentError)}
								filterOptions={filterOptions}
								options={intentListenersOptions}
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
						</Grid>

						<Grid item className={classes.controls}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleRaiseIntent}
								disabled={!contextStore.currentContext}
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
						<Grid item xs={12}>
							<Typography variant="h5">Raise Intent for Context</Typography>
						</Grid>
						<Grid item className={classes.field}>
							<TemplateTextField
								label="Current context type"
								disabled={true}
								variant="outlined"
								defaultValue={context || "Create a context"}
								className={classes.textField}
							/>
						</Grid>
						<Grid item className={classes.controls}>
							<Button
								disabled={!contextStore.currentContext}
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
							<Typography variant="h5">Add Context Listener</Typography>
						</Grid>
						<Grid item className={classes.field}>
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
