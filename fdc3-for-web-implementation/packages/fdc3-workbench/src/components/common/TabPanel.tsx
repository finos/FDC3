/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		tabPanel: {
			padding: theme.spacing(2),
		},
	})
);

export const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
	const classes = useStyles();

	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && <div className={classes.tabPanel}>{children}</div>}
		</div>
	);
};
