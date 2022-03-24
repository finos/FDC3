import React from "react";
import { Box } from "@mui/material";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

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
			{value === index &&
				<Box
					sx={{
						p: 2,
					}}
				>
					{children}
				</Box>
			}
		</div>
	);
};
