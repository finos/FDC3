import React, { useState } from "react";
import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Link } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import contextStore from "../store/ContextStore";
import { TemplateTextField } from "./common/TemplateTextField";

interface FilterOptionsState<T> {
	inputValue: string;
	getOptionLabel: (option: T) => string;
}

interface OptionType {
	title: string;
	value: string;
}

type SetValue = (value: OptionType | null) => void;

type SetError = (error: string | false) => void;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		form: {
			display: "flex",
			flexWrap: "wrap",
			marginTop: theme.spacing(1),
			"& > *": {
				margin: theme.spacing(1),
				marginRight: 0,
			},
		},
		controls: {
			"& .MuiIconButton-sizeSmall": {
				padding: "6px",
				marginLeft: theme.spacing(1),
			},
		},
		contextName: {
			flexGrow: 1,
			marginRight: theme.spacing(1),
			minWidth: "190px",
		},
		rightAlign: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		link: {
			cursor: "pointer",
			color: "black"
		}
	})
);

const contextFilter = createFilterOptions<OptionType>();

export const ContextTemplates = observer(({handleTabChange} : {handleTabChange:any}) => {
	const classes = useStyles();
	const [context, setContext] = useState<OptionType | null>(null);
	const [contextError, setContextError] = useState<string | false>(false);
	const contextsOptions: OptionType[] = contextStore.contextsList.map(({ id }) => {
		return {
			title: id,
			value: id,
		};
	});

	const handleChange =
		(setValue: SetValue, setError: SetError) => (event: React.ChangeEvent<{}>, newValue: any) => {
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

	const getOptionLabel = (option: OptionType) => {
		if (option.value) {
			return option.value;
		}
		return option.title;
	};

	const filterOptions = (options: OptionType[], params: FilterOptionsState<OptionType>) => {
		const filtered = contextFilter(options, params);

		if (params.inputValue !== "") {
			filtered.push({
				value: params.inputValue,
				title: `Add "${params.inputValue}"`,
			});
		}

		return filtered;
	};

	const handleSelectContext = (value: string) => {
		const selectedContext = contextStore.contextsList.find(({ id }) => id === value);
		if(selectedContext && selectedContext.template) contextStore.setContext(selectedContext.template);
		else handleTabChange(null, 0)
	}

	const handleRenderOption = (option: OptionType) => (
		<li>
			<Link underline="none" onClick={() => handleSelectContext(option.value)} className={classes.link}>
				<a> {option.title} </a>
			</Link>
		</li>
	)

	return (
		<div className={classes.root}>
			<form className={classes.form} noValidate autoComplete="off">
				<Grid
					container
					direction="row"
					spacing={1}
					justifyContent="space-between"
					className={`${classes.controls} ${classes.rightAlign}`}
				>
					<Grid item className={classes.contextName}>
						<Autocomplete
							id="context-"
							size="small"
							selectOnFocus
							blurOnSelect
							clearOnBlur
							handleHomeEndKeys
							value={context}
							onChange={handleChange(setContext, setContextError)}
							filterOptions={filterOptions}
							options={contextsOptions}
							getOptionLabel={getOptionLabel}
							renderOption={handleRenderOption}
							renderInput={(params) => (
								<TemplateTextField
									label="CONTEXT "
									placeholder="Enter Context Type"
									variant="outlined"
									{...params}
									error={!!contextError}
									helperText={contextError}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</form>
		</div>
	);
});
