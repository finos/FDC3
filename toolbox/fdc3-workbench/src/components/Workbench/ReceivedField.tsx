/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
import { observer } from "mobx-react";
import { TextField } from "@mui/material";

const classes = {
	textField: {
		mt: 2,
		width: "100%",
	},
	input: {
		fontSize: "14px",
	},
} as const;

export const ReceivedField = observer(({ metaData }: { metaData: any }) => {
	const formattedData = !metaData?.source
		? "METADATA NOT PROVIDED"
		: `appId: ${metaData.source.appId}\ninstanceId: ${metaData.source.instanceId}`;

	return (
		<TextField
			disabled
			label={"RECEIVED FROM"}
			sx={classes.textField}
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
				sx: classes.input,
			}}
		/>
	);
});
