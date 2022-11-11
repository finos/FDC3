import React from "react";
import { observer } from "mobx-react";
import contextStore from "../../store/ContextStore";
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

export const ContextListeners = observer(() => {
	const classes = useStyles();
	const contextListeners: AccordionListItem[] = contextStore.contextListeners.map(
		({ id, type, lastReceivedContext }) => {
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

			return { id, textPrimary: `${type}`, afterEachElement: contextField };
		}
	);

	const handleDeleteListener = (id: string) => {
		contextStore.removeContextListener(id);
	};

	return (
		<AccordionList
			title="System Channels"
			icon="Any context already in the channel will be received automatically"
			noItemsText="No System Channels Listeners"
			listItems={contextListeners}
			onDelete={handleDeleteListener}
		/>
	);
});
