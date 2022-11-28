import React, { useEffect, useState, useRef, FormEvent } from "react";
import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Grid, Typography, Tooltip, IconButton, Table, TableBody, TableRow, TableCell, TableContainer } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import contextStore, { ContextType, ContextItem } from "../store/ContextStore";
import systemLogStore from "../store/SystemLogStore";
import { JsonInput } from "./common/JsonInput";
import { DialogModal } from "./common/DialogModal";
import { TemplateTextField } from "./common/TemplateTextField";
import { copyToClipboard } from "./common/CopyToClipboard";

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
			width: "100%"
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
		delete: {
			height:'15px',
			transform: 'scale(1.7)',
		},
		copy: {
			height:'20px',
		},
		link: {
			cursor: "pointer",
			color: "black"
		},
		margins: {
			margin: "0 5px"
		},
		tableContainer: {
			maxHeight: 350
		}
	})
);

const emptyJson: ContextType = {
	type: "",
	id: {}
};

export const ContextCreate = observer(({contextName}: {contextName:string}) => {
	const classes = useStyles();
	const [templateName, setTemplateName] = useState<OptionType | null>({
		title: contextName,
		value: contextName});
	const [duplicateName, setDuplicateName] = useState(false);
	const [contextValue, setContextValue] = useState<ContextType | null>(emptyJson);
	const [context, setContext] = useState<ContextItem | null>({
		id: contextName || "empty",
		template: emptyJson,
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/context.schema.json"),
	});
	const [contextError, setContextError] = useState<string | false>(false);
	const [open, setOpen] = useState(false);
	const [deleteContext, setDeleteContext] = useState<object | null>(null);
	const [disabled, setDisabled] = useState(true);
	const gridRef = useRef<any>(null);
	
	const handleClickOpen = (id: string, name: any) => {
		setOpen(true);
		setDeleteContext({id, name})
	};

	const handleClose = (value: boolean) => {
		setOpen(value);
	};

	const handleJsonError = (errors: string[]) => {
		setContextError(errors[0]);
	};

	const handleChangeTemplate = (newValue: any) => {
		setTemplateName(newValue);

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
		contextStore.contextsList.reduce((count, {id, uuid}) => {
			if(id === tempName && (!ignoreUuid || ignoreUuid !== uuid)) {
				count = count + 1;
			}
			return count;
		}, 0);

	const handleChangeTemplateName = (newValue: any) => {
		setDisabled(false);
		setContextError(false)
		setTemplateName(newValue);

		if(context && !found(newValue.value, context.uuid)) setDuplicateName(false);
		else if(found(newValue.value) >= 1) setDuplicateName(true);
	}

	const handleContextChange = (json: ContextType) => {
		setContextValue(json);
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

		if(!templateName) {
			setContextError("Template name is required");
			return false;
		}
		
		return true;
	};

	const handleCreateTemplate = () => {
		setTemplateName(null)
		setContext(null);
		setContextValue(null);
		setDisabled(true);
	};

	const handleSaveTemplate = (e: FormEvent | null = null) => {
		e?.preventDefault();
		if(disabled) {
			return;
		} else {
			const isValid: boolean = validate();

			if (isValid && context && templateName) {
				
				const selectedContext = contextStore.contextsList.find(({ id }) => id === context.id);
				const currContext = {
					id: templateName.value,
					schemaUrl: context.schemaUrl,
					template: contextValue,
				}

				if(!selectedContext) contextStore.addContextItem(currContext);

				contextStore.saveContextItem(currContext, context.id);
				handleChangeTemplate({title: currContext.id, value: currContext.id});

				systemLogStore.addLog({
					name: "saveTemplate",
					type: "success",
					value: currContext?.id,
					variant: "text",
				});
			} else {
				systemLogStore.addLog({
					name: "saveTemplate",
					type: "error",
					value: undefined,
					variant: "text",
				});
			}
			setDisabled(true);
		}
	};

	const handleDuplicateTemplate = (newValue: any, count = 0) => {
		const copyName = `${newValue.value}-copy${count > 0 ? ` (${count})` : ''}`;
		if (newValue?.value && !found(copyName)) {
			setTemplateName({value: copyName, title: copyName});
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
					name: "saveTemplate",
					type: "success",
					value: newContext.id,
					variant: "text",
				});
			}
		} else if(found(copyName)) {
			handleDuplicateTemplate(newValue, ++count)
		}

		setContextError(false);
	}

	const handleResetTemplate = () => {
		contextStore.resetContextList();
		handleCreateTemplate()
	};

	const handleDeleteTemplate = (contextId:any) => {
		const selectedContext = contextStore.contextsList.find(({ id }) => id === contextId);
		if (selectedContext) {
			contextStore.deleteContextItem(selectedContext);
			systemLogStore.addLog({
				name: "deleteTemplate",
				type: "success",
				value: selectedContext?.id,
				variant: "text",
			});
		} else {
			systemLogStore.addLog({
				name: "deleteTemplate",
				type: "error",
				value: undefined,
				variant: "text",
			});
		}
	};

	useEffect(() => {
	  if(duplicateName) {
		setDisabled(true);
		setContextError("Template name already exists");
	  }
	  else setDisabled(false);
	}, [duplicateName, contextValue])
	
	useEffect(() => {
		if(gridRef && gridRef.current) gridRef.current.scrollIntoView({behavior: 'auto', block: 'nearest'});
		if(context == null) {
			const newContext: ContextItem = {
				id: "empty",
				template: emptyJson,
				schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/context.schema.json"),
			};
			setContext(newContext);
			setContextValue(emptyJson);
		}
	}, [context])

	return (
		<div className={classes.root}>
			<DialogModal open={open} onClose={handleClose} onAgree={handleDeleteTemplate} selectedValue={deleteContext} />
			<Grid container spacing={1} >
				<Grid item xs={12} >
					<Typography variant="h5" >Context templates:</Typography>
				</Grid>
				<TableContainer className={classes.tableContainer}>
					<Table>
						<TableBody>
							{contextStore.contextsList.map(({ id, template }, index) => (
								<TableRow hover role="checkbox" tabIndex={-1} key={`row-${index}`} selected={id === templateName?.value} ref={id === templateName?.value ? gridRef : null}>
									<TableCell key={`row-${index}-column-0`} align="left" onClick={() => handleChangeTemplate({title: id, value: id})}>
										<Typography variant="subtitle1" >
											{id}
										</Typography>
									</TableCell>
									<TableCell key={`row-${index}-column-1`} align="left" onClick={() => handleChangeTemplate({title: id, value: id})}>
										<Typography variant="caption" >{template?.type}</Typography>
									</TableCell>
									<TableCell key={`row-${index}-column-2`} align="right">
										<Tooltip title="Duplicate Template" aria-label="Copy code">
											<IconButton
												size="small"
												aria-label="Copy code example"
												color="primary"
												onClick={() => handleDuplicateTemplate({title: id, value: id})}>
												<FileCopyOutlinedIcon className={classes.copy}/>
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell key={`row-${index}-column-3`} align="right">
										<Tooltip title="Delete template" aria-label="Delete template">
											<IconButton
												size="small"
												aria-label="Delete template"
												color="primary"
												onClick={() => handleClickOpen(id, template?.name)}
											>
												<DeleteOutlinedIcon className={classes.delete}/>
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<form className={classes.form} noValidate autoComplete="off">
				<Grid container direction="row" spacing={1}>
					<Grid item className={classes.controls}>
						<Button className={classes.button} variant="contained" color="primary" onClick={handleCreateTemplate}>
							Create new template
						</Button>
					</Grid>
					<Grid item className={classes.controls}>
						<Button className={classes.button} variant="contained" color="primary" onClick={handleResetTemplate}>
							Reset templates
						</Button>
					</Grid>
				</Grid>
			</form>
			
			<form className={classes.form} noValidate autoComplete="off" onSubmit={(e)=>handleSaveTemplate(e)}>
				<Grid container direction="row" spacing={1} className={classes.rightAlign}>
					<Grid item xs={12} className={`${classes.controls} ${classes.templateSelect}`}>
						<Grid item xs={6} className={classes.field}>
							<Grid item xs={12} className={classes.textField}>
								<Typography variant="h5" >Edit template:</Typography>
							</Grid>
							<TemplateTextField
								label="Template name"
								variant="outlined"
								className={classes.textField}
								placeholder="Choose Context Template"
								value={templateName?.value || ''}
								onChange={(e) => handleChangeTemplateName({title: e.target.value, value: e.target.value})}
							/>
						</Grid>
					</Grid>

					<Grid item xs={12} className={classes.controls}>
						<JsonInput
							json={context?.template}
							onChange={handleContextChange}
							onJsonError={handleJsonError}
							schemaUrl={new URL(context?.schemaUrl || 'https://fdc3.finos.org/schemas/1.2/context.schema.json')}
							error={contextError}
						/>
					</Grid>

					<Grid item>
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
						
						<Button className={classes.button} variant="contained" color="primary" onClick={handleSaveTemplate} disabled={disabled}>
							Save Changes
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
});
