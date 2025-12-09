/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
import { observer } from "mobx-react";
import { List } from "@mui/material";
import systemLogStore from "../../store/SystemLogStore";
import { SystemLogItem } from "./SystemLogItem";

const classes = {
	root: {
		width: "100%",
	},
} as const;

export const SystemLog = observer(() => {
	return (
		<List component="nav" sx={classes.root} aria-label="mailbox folders">
			{systemLogStore.logList.map((logItem) => (
				<SystemLogItem key={logItem.id} logItem={logItem} />
			))}
		</List>
	);
});
