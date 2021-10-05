import React, { useState } from "react";
import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Grid, Typography, Tooltip, IconButton } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import contextStore, { ContextType, ContextItem } from "../store/ContextStore";
import systemLogStore from "../store/SystemLogStore";
import { JsonInput } from "./common/JsonInput";
import { TemplateTextField } from "./common/TemplateTextField";
import { codeExamples } from "../fixtures/codeExamples";
import { ContextLinking } from "./ContextLinking";
import { copyToClipboard } from "./common/CopyToClipboard";

// interface copied from lib @material-ui/lab/Autocomplete
interface FilterOptionsState<T> {
	inputValue: string;
	getOptionLabel: (option: T) => string;
}

interface OptionType {
	title: string;
	value: string;
}

const filter = createFilterOptions<OptionType>();

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		form: {
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center",
			marginTop: theme.spacing(1),
			"& > *": {
				margin: theme.spacing(1),
			},
			"& > *:first-child": {
				marginLeft: 0,
				paddingLeft: 0,
			},
			"& > * > *:first-child": {
				marginLeft: 0,
				paddingLeft: 0,
			},
			"& .MuiGrid-grid-xs-12": {
				paddingLeft: 0,
			},
		},
		controls: {
			"& .MuiIconButton-sizeSmall": {
				padding: "6px",
				marginLeft: theme.spacing(1),
			},
		},
		templateSelect: {
			flexGrow: 1,
			// marginRight: theme.spacing(1),
			minWidth: "190px",
		},
		textField: {
			width: "100%",
		},
		multilineField: {
			width: "100%",
		},
		button: {
			marginLeft: "auto",
		},
		rightAlign: {
			flexDirection: "row",
			justifyContent: "flex-end",
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

export const ContextCreate = observer(() => {
	const classes = useStyles();
	const [templateName, setTemplateName] = useState<OptionType | null>(null);
	const [contextValue, setContextValue] = useState<ContextType | null>(null);
	const [context, setContext] = useState<ContextItem | null>(null);
	const [contextError, setContextError] = useState<string | false>(false);
	const contextListenersOptions: OptionType[] = contextStore.contextsList.map(({ id }) => {
		return {
			title: id,
			value: id,
		};
	});

	const handleContextChange = (json: ContextType) => {
		setContextValue(json);
		setContextError(false);
	};

	const handleJsonError = (errors: string[]) => {
		setContextError(errors[0]);
	};

	// TODO: save template that was setup without template name
	const handleChangeTemplate = (event: React.ChangeEvent<{}>, newValue: any) => {
		setTemplateName(newValue);

		if (newValue?.value) {
			const selectedContext = contextStore.contextsList.find(({ id }) => id === newValue?.value);

			if (selectedContext) {
				setContextValue(selectedContext.template);
				setContext(selectedContext);
			} else {
				const newContext: ContextItem = {
					id: newValue.value,
					template: contextValue,
					schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/context.schema.json"),
				};

				contextStore.addContextItem(newContext);
				setContext(newContext);
				setContextValue(newContext.template);
			}
		}

		setContextError(false);
	};

	const validate = () => {
		if (!contextValue) {
			setContextError("Context is required");
			return false;
		}

		if (!contextValue?.type) {
			setContextError("Context must have property 'type'");
			return false;
		}

		if (contextValue?.type === "") {
			setContextError("Property 'type' can't be empty");
			return false;
		}

		return true;
	};

	const handleCreateContext = () => {
		const isValid: boolean = validate();

		if (isValid && contextValue && !contextError) {
			contextStore.createContext(contextValue);
			//disabled clearing of context value and template name
			// setContextValue(null);
			// setTemplateName(null);
			// setContext({
			// 	id: "empty",
			// 	template: null,
			// });
			systemLogStore.addLog({
				name: "createContext",
				type: "success",
				value: context?.id,
				variant: "text",
			});
		} else {
			systemLogStore.addLog({
				name: "createContext",
				type: "error",
				value: context?.id,
				variant: "text",
			});
		}
	};

	const getOptionLabel = (option: OptionType) => {
		if (option.value) {
			return option.value;
		}

		return option.title;
	};

	const filterOptions = (options: OptionType[], params: FilterOptionsState<OptionType>) => {
		const filtered = filter(options, params);

		if (params.inputValue !== "") {
			filtered.push({
				value: params.inputValue,
				title: `Add "${params.inputValue}"`,
			});
		}

		return filtered;
	};

	// TODO: disable button if nothing in template changed
	const handleSaveTemplate = () => {
		if (context) {
			contextStore.saveContextItem({
				id: context.id,
				schemaUrl: context.schemaUrl,
				template: contextValue,
			});
			systemLogStore.addLog({
				name: "saveTemplate",
				type: "success",
				value: context?.id,
				variant: "text",
			});
		} else {
			systemLogStore.addLog({
				name: "createContext",
				type: "success",
				value: undefined,
				variant: "text",
			});
		}
	};

	const handleBroadcast = () => {
		contextStore.broadcast();
	};

	return (
		<div className={classes.root}>
			<Grid item xs={12}>
				<Typography variant="h5">Create Context</Typography>
			</Grid>
			<form className={classes.form} noValidate autoComplete="off">
				<Grid container direction="row" spacing={1} className={classes.rightAlign}>
					<Grid item className={`${classes.controls} ${classes.templateSelect}`}>
						<Autocomplete
							id="context-template"
							size="small"
							selectOnFocus
							blurOnSelect
							clearOnBlur
							handleHomeEndKeys
							value={templateName}
							onChange={handleChangeTemplate}
							filterOptions={filterOptions}
							options={contextListenersOptions}
							getOptionLabel={getOptionLabel}
							getOptionSelected={(option, value) => option.value === value.value}
							renderOption={(option) => option.title}
							renderInput={(params) => (
								<TemplateTextField
									//className={classes.textField}
									label="TEMPLATE"
									placeholder="Choose Context Template"
									variant="outlined"
									style={{
										borderColor: "blue",
									}}
									{...params}
								/>
							)}
						/>
					</Grid>

					<Grid item>
						<Button className={classes.button} variant="contained" color="primary" onClick={handleSaveTemplate}>
							Save Template
						</Button>
					</Grid>

					<Grid item xs={12} className={classes.controls}>
						<JsonInput
							json={context?.template}
							onChange={handleContextChange}
							onJsonError={handleJsonError}
							schemaUrl={context?.schemaUrl}
							error={contextError}
						/>
					</Grid>

					<Grid item className={classes.controls}>
						<Button className={classes.button} variant="contained" color="primary" onClick={handleCreateContext}>
							Create context
						</Button>

						<Tooltip title="Copy code" aria-label="Copy code">
							<IconButton
								size="small"
								aria-label="Copy code example"
								color="primary"
								onClick={copyToClipboard(`let context = ${JSON.stringify(contextValue, null, 2)}`, "createContext")}
							>
								<FileCopyIcon />
							</IconButton>
						</Tooltip>
					</Grid>
					<Grid item className={classes.controls}>
						<Button
							disabled={!contextStore.currentContext}
							variant="contained"
							color="primary"
							onClick={handleBroadcast}
						>
							Broadcast Context
						</Button>

						<Tooltip title="Copy code example" aria-label="Copy code example">
							<IconButton
								size="small"
								aria-label="Copy code example"
								color="primary"
								onClick={copyToClipboard(codeExamples.broadcast, "broadcast")}
							>
								<FileCopyIcon />
							</IconButton>
						</Tooltip>
					</Grid>

					<div className={classes.border}></div>

					<ContextLinking />
				</Grid>
			</form>
		</div>
	);
});
