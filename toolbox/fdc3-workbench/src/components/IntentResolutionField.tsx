import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		textField: {
			marginTop: theme.spacing(2),
			width: "100%",
		},
		input: {
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		"& .Mui-disabled": {
			borderColor: theme.palette.text.primary,
		},
	})
);

export const IntentResolutionField = observer(({data}: {data: any}) => {
	const classes = useStyles();
	const [resolutionResult, setResolutionResult] = useState<any>("pending...");
	let results = 
	`Resolved by:\n
		\tappId: ${data.source.appId}\n
		\tinstanceId: ${data.source.instanceId}\n
	Results: ${resolutionResult}`;


    const displayIntentResults = async () => {
		try {
			if(resolutionResult.hasOwnProperty('getResult')) {
				const result = await resolutionResult.getResult();
				//detect whether the result is Context or a Channel
				if (result && result.broadcast) { 
				//render channel
				} else if (result){
					resolutionResult.resultContext = JSON.stringify(result, null, 2);
				} else {
				}
				setResolutionResult(result);
			}
		} catch(error) {
			console.error(`${resolutionResult.source} returned a result error: ${error}`);
		}
    }

	useEffect(() => {
		results = `Resolved by:\n
		appId: ${data.source.appId}\n
		instanceId: ${data.source.instanceId}\n
	Results: ${resolutionResult}`;
	}, [resolutionResult])

	displayIntentResults();
	
	return (
	 	<TextField
			disabled
			label={"RESULT CONTEXT"}
			InputLabelProps={{
				shrink: true,
			}}
			contentEditable={false}
			fullWidth
			multiline
			variant="outlined"
			size="small"
			value={results}
			InputProps={{
				classes: {
					input: classes.input,
				},
			}}
		/>)
});
