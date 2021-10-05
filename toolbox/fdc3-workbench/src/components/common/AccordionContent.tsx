import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export interface AccordionContentProps {
	title: string;
	children: React.ReactNode;
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
	})
);

export const AccordionContent: React.FC<AccordionContentProps> = ({ title, children }: AccordionContentProps) => {
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
				</Typography>
			</AccordionSummary>

			<AccordionDetails className={classes.accordionDetails}>{children}</AccordionDetails>
		</Accordion>
	);
};
