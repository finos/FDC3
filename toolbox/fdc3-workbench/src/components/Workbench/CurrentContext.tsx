/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
import { observer } from "mobx-react";
import { TextField } from "@mui/material";
import { AccordionContent } from "../common/AccordionContent";
import contextStore from "../../store/ContextStore";

const classes = {
	textField: {
		mt: 2,
		width: "100%",
	},
	input: (theme: any) => ({
		fontSize: "14px",
		color: theme.palette.text.primary,
	}),
} as const;

export const CurrentContext = observer(() => {
	const context = JSON.stringify(contextStore.currentContext, undefined, 4);

	return (
		<AccordionContent title="Context">
			<TextField
				disabled
				sx={classes.textField}
				id="context-id"
				contentEditable={false}
				fullWidth
				multiline
				variant="outlined"
				size="small"
				value={context}
				InputProps={{
					sx: classes.input,
				}}
			/>
		</AccordionContent>
	);
});
