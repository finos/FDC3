import React from "react";
import { observer } from "mobx-react";
import * as fdc3 from "@finos/fdc3";
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

export const IntentResults = observer((test: string) => 
	// const classes = useStyles();

    // const displayContext = (result: string) => {
    //     const contextIntentResults = {};
    //     return <TextField
	// 			disabled
	// 			label={"RESULT CONTEXT"}
	// 			className={classes.textField}
	// 			InputLabelProps={{
	// 				shrink: true,
	// 			}}
	// 			contentEditable={false}
	// 			fullWidth
	// 			multiline
	// 			variant="outlined"
	// 			size="small"
	// 			value={result}
	// 			InputProps={{
	// 				classes: {
	// 					input: classes.input,
	// 				},
	// 			}}
	// 		/>
    // }

    // const displayIntentResults = async () => {
    //     try {
    //         const result = await resolution.getResult();
    //         //detect whether the result is Context or a Channel
    //         if (result && result.broadcast) { 
    //           //render channel
    //         } else if (result){
    //           return displayContext(JSON.stringify(result));
    //         } else {
    //           //render no result
    //         }
    //       } catch(error) {
    //         console.error(`${resolution.source} returned a result error: ${error}`);
    //       }          
    
    // }
	 (<TextField
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
			/>)
);
