import React from "react";
import { observer } from "mobx-react";
import appChannelStore from "../../store/AppChannelStore";
import { AccordionList, AccordionListItem } from "../common/AccordionList";
import { TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		textField: {
			marginTop: theme.spacing(2),
			width: "100%",
		},
		input: {
			fontSize: "14px",
		},
	})
);

export const AppChannelListeners = observer(() => {
	const classes = useStyles();

	let contextListeners: AccordionListItem[] = [];

	appChannelStore.appChannelListeners.forEach(({ id, channelId, type, lastReceivedContext }) => {
		const receivedContextListenerValue = lastReceivedContext ? JSON.stringify(lastReceivedContext, undefined, 4) : "";
		const contextField = (
			<TextField
				disabled
				label={"LAST RECEIVED CONTEXT"}
				className={classes.textField}
				InputLabelProps={{
					shrink: true,
				}}
				contentEditable={false}
				fullWidth
				multiline
				variant="outlined"
				size="small"
				value={receivedContextListenerValue}
				InputProps={{
					classes: {
						input: classes.input,
					},
				}}
			/>
		);

		contextListeners.push({ id, textPrimary: `${channelId}: ${type}`, afterEachElement: contextField });
	});

	const handleDeleteListener = (id: string) => {
		appChannelStore.removeContextListener(id);
	};

	return (
		<AccordionList
			title="App Channels"
			icon="Any context already in the channel will NOT be received automatically"
			noItemsText="No App Channel Listeners"
			listItems={contextListeners}
			onDelete={handleDeleteListener}
		/>
	);
});
