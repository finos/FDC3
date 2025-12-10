/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
import { Theme } from "@mui/material/styles";
import { Box } from "@mui/material";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

const classes = {
	tabPanel: (theme: Theme) => ({
		padding: theme.spacing(2),
	}),
} as const;

export const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={classes.tabPanel}>{children}</Box>}
		</div>
	);
};
