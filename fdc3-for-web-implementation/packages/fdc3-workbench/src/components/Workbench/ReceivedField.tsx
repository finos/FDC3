/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
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
		},
	})
);

export const ReceivedField = observer(({ metaData }: { metaData: any }) => {
	const classes = useStyles();
	const formattedData = !metaData?.source
		? "METADATA NOT PROVIDED"
		: `appId: ${metaData.source.appId}\ninstanceId: ${metaData.source.instanceId}`;

	return (
		<TextField
			disabled
			label={"RECEIVED FROM"}
			className={classes.textField}
			InputLabelProps={{
				shrink: true,
			}}
			contentEditable={false}
			fullWidth
			multiline
			variant="outlined"
			size="small"
			value={formattedData}
			InputProps={{
				classes: {
					input: classes.input,
				},
			}}
		/>
	);
});
