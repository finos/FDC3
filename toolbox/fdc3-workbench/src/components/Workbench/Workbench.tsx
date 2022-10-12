import React, { useState } from "react";
import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import { TabPanel } from "../common/TabPanel";
import { CurrentContext } from "./CurrentContext";
import { ContextListeners } from "./ContextListeners";
import { IntentListeners } from "./IntentListeners";
import { SystemLog } from "./SystemLog";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		paper: {
			marginTop: theme.spacing(2),
			padding: theme.spacing(2),
			"&:first-child": {
				marginTop: 0,
			},
		},
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
	})
);

const a11yProps = (index: any) => {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
};

export const Workbench = observer(() => {
	const classes = useStyles();
	const [tabValue, setTabValue] = useState<number>(0);

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<div>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				classes={{
					indicator: classes.indicator,
				}}
				className={classes.tabs}
			>
				<Tab label="Current State" {...a11yProps(0)} />
				<Tab label="System Log" {...a11yProps(1)} />
			</Tabs>

			<TabPanel value={tabValue} index={0}>
				<CurrentContext />
				<ContextListeners />
				<IntentListeners />
			</TabPanel>

			<div className={classes.systemLog}>
				<TabPanel value={tabValue} index={1}>
					<SystemLog />
				</TabPanel>
			</div>
		</div>
	);
});
