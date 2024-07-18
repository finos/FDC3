/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

export interface AccordionContentProps {
	title: string;
	children: React.ReactNode;
	icon?: string;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		accordion: {
			margin: theme.spacing(1, 0, 0, 0),
			boxShadow: "none",
			"&::before": {
				display: "none",
			},
			"&.Mui-expanded": {
				margin: theme.spacing(1, 0, 0, 0),
			},
		},
		accordionSummary: {
			border: "none",
			padding: 0,
			minHeight: "initial",
			"&.Mui-expanded": {
				minHeight: "initial",
			},
			"& .MuiAccordionSummary-content": {
				margin: "0 12px 0 0",
				"&.Mui-expanded": {
					margin: "0 12px 0 0",
				},
			},
			"& .MuiAccordionSummary-expandIcon": {
				padding: "6px",
			},
		},
		accordionDetails: {
			paddingTop: 0,
			paddingLeft: 0,
			flexDirection: "column",
		},
		accordionTitle: {
			color: "#0086bf",
			fontSize: "16px",
		},
		expand_icon: {
			color: "#0086bf",
		},
		icon: {
			marginBottom: "-1px !important",
			fontSize: "15px",
			marginLeft: "5px",
		},
	})
);

export const AccordionContent: React.FC<AccordionContentProps> = ({ icon, title, children }: AccordionContentProps) => {
	const classes = useStyles();

	return (
		<Accordion className={classes.accordion} defaultExpanded>
			<AccordionSummary
				className={classes.accordionSummary}
				expandIcon={<ExpandMoreIcon className={classes.expand_icon} />}
				aria-label="Expand"
				aria-controls="additional-actions1-content"
				id="additional-actions1-header"
			>
				<Typography variant="h5" className={classes.accordionTitle}>
					{title}
					{icon && (
						<Tooltip title={icon} aria-label={icon}>
							<InfoIcon className={classes.icon} />
						</Tooltip>
					)}
				</Typography>
			</AccordionSummary>

			<AccordionDetails className={classes.accordionDetails}>{children}</AccordionDetails>
		</Accordion>
	);
};
