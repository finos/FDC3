import React, { useState } from "react";
import { observer } from "mobx-react";
import { TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ChannelField } from "./ChannelField";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		textField: {
			marginTop: theme.spacing(2),
			width: "100%",
		},
		input: {
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		"& .Mui-disabled": {
			borderColor: theme.palette.text.primary,
		},
	})
);

export const IntentResolutionField = observer(({ data, handleTabChange }: { data: any; handleTabChange: any }) => {
	const classes = useStyles();
	const [resolutionResult, setResolutionResult] = useState<any>("pending...");
	const [channel, setChannel] = useState(false);
	const [privateChannel, setPrivateChannel] = useState(false);
	const [channelsList, setChannelsList] = useState([]);

	let results = `Resolved by:
	appId: ${data.source.appId}
	instanceId: ${data.source.instanceId}\n\nResults: ${resolutionResult}`;

	const displayIntentResults = async () => {
		console.log(data);
		try {
			if (data.hasOwnProperty("getResult")) {
				const result = await data.getResult();
				console.log(result);
				//detect whether the result is Context or a Channel
				if (!!result?.channel?.broadcast) {
					setResolutionResult("");

					//App Channel
					if (result.type === "app") {
						setChannel(true);
						setChannelsList(result.channel);
					}

					// Private Channel
					if (result.type === "private") {
						setChannel(true);
						setPrivateChannel(true);
					}
				} else if (result) {
					setResolutionResult(JSON.stringify(result.context, null, 2));
				} else {
					setResolutionResult("No result returned");
				}
			}
		} catch (error) {
			setResolutionResult("No result returned");
			console.error(`${data.source.appId} returned a result error: ${error}`);
		}
	};

	displayIntentResults();

	return (
		<div>
			<TextField
				disabled
				label={"RESULT CONTEXT"}
				InputLabelProps={{
					shrink: true,
				}}
				contentEditable={false}
				fullWidth
				multiline
				variant="outlined"
				size="small"
				value={results}
				InputProps={{
					classes: {
						input: classes.input,
					},
				}}
			/>
			{channel && (
				<ChannelField handleTabChange={handleTabChange} channelsList={channelsList} privateChannel={privateChannel} />
			)}
		</div>
	);
});
