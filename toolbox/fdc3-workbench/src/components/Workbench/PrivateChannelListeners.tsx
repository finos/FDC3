import React from "react";
import { observer } from "mobx-react";
import privateChannelStore from "../../store/PrivateChannelStore";
import { AccordionList, AccordionListItem } from "../common/AccordionList";
import { TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ReceivedField } from "./ReceivedField";

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

export const PrivateChannelListeners = observer(() => {
	const classes = useStyles();

	let contextListeners: AccordionListItem[] = [];

	privateChannelStore.channelListeners.forEach(({ id, channelId, type, lastReceivedContext, metaData }) => {
		const receivedContextListenerValue = lastReceivedContext ? JSON.stringify(lastReceivedContext, undefined, 4) : "";
		const contextField = (
			<div>
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
				{window.fdc3Version === "2.0" && <ReceivedField metaData={metaData} />}
			</div>
		);

		contextListeners.push({ id, textPrimary: `Channel Id: ${channelId}: ${type}`, afterEachElement: contextField });
	});

	const handleDeleteListener = (id: string) => {
		privateChannelStore.removeContextListener(id);
	};

	return (
		<AccordionList
			title="Private Channels"
			icon="Any context already in the channel will NOT be received automatically"
			noItemsText="No Private Channel Listeners"
			listItems={contextListeners}
			onDelete={handleDeleteListener}
		/>
	);
});
