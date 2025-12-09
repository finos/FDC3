/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useState } from "react";
import { observer } from "mobx-react";
import { GlobalStyles, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Tabs, Tab } from "@mui/material";
import { TabPanel } from "../common/TabPanel";
import { ContextListeners } from "./ContextListeners";
import { IntentListeners } from "./IntentListeners";
import { AppChannelListeners } from "./AppChannelListeners";
import { SystemLog } from "./SystemLog";
import { PrivateChannelListeners } from "./PrivateChannelListeners";

const classes = {
	root: {
		flexGrow: 1,
	},
	paper: (theme: any) => ({
		mt: 2,
		p: 2,
		"&:first-of-type": {
			mt: 0,
		},
	}),
	systemLog: {
		maxHeight: "1000px",
		overflowY: "scroll",
	},
	indicator: {
		backgroundColor: "#00bbe1",
	},
	tabs: {
		borderBottomColor: "#acb2c0",
		borderBottomStyle: "solid",
		borderBottomWidth: "1px",
		minHeight: "28px",
	},
	icon: {
		mb: "3px",
		fontSize: "15px",
		mr: "3px",
	},
} as const;

const globalStyles = {
	".MuiTab-wrapper": {
		flexDirection: "row !important",
	},
};

const a11yProps = (index: any) => {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
};

export const Workbench = observer(() => {
	const [tabValue, setTabValue] = useState<number>(0);

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<div>
			<GlobalStyles styles={globalStyles} />
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				sx={{
					"& .MuiTabs-indicator": classes.indicator,
					...classes.tabs,
				}}
			>
				<Tab
					label="Listeners"
					{...a11yProps(0)}
					style={{ display: "flex", alignItems: "center" }}
					icon={
						<Tooltip
							title="Context received will be displayed here, but you will not receive your own messages back"
							aria-label="Context received will be displayed here, but you will not receive your own messages back"
						>
							<InfoIcon sx={classes.icon} />
						</Tooltip>
					}
				/>
				<Tab label="System Log" {...a11yProps(1)} />
			</Tabs>

			<TabPanel value={tabValue} index={0}>
				<ContextListeners />
				<IntentListeners />
				<AppChannelListeners />
				<PrivateChannelListeners />
			</TabPanel>

			<div style={{ maxHeight: "1000px", overflowY: "scroll" }}>
				<TabPanel value={tabValue} index={1}>
					<SystemLog />
				</TabPanel>
			</div>
		</div>
	);
});
