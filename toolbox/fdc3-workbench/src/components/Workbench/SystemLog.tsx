import React from "react";
import { observer } from "mobx-react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core";
import systemLogStore from "../../store/SystemLogStore";
import { SystemLogItem } from "./SystemLogItem";

const useStyles = makeStyles(() =>
	createStyles({
		root: {
			width: "100%",
		},
	})
);

export const SystemLog = observer(() => {
	const classes = useStyles();

	return (
		<List component="nav" className={classes.root} aria-label="mailbox folders">
			{systemLogStore.logList.map((logItem) => (
				<SystemLogItem key={logItem.id} logItem={logItem} />
			))}
		</List>
	);
});
