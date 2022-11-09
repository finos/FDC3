import React, { useState } from "react";
import { observer } from "mobx-react";
import {
	Typography,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	IconButton,
	Tooltip,
	Grid,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import channelStore from "../store/ChannelStore";
import { codeExamples } from "../fixtures/codeExamples";
import { copyToClipboard } from "./common/CopyToClipboard";
import { ContextLinking } from "./ContextLinking";
import contextStore, { ContextType } from "../store/ContextStore";
import { ContextTemplates } from "./ContextTemplates";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		form: {
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center",
			marginTop: theme.spacing(1),
			"& > *": {
				margin: theme.spacing(1),
			},
			"& > *:first-child": {
				marginLeft: 0,
				paddingLeft: 0,
			},
			"& > * > *:first-child": {
				marginLeft: 0,
				paddingLeft: 0,
			},
		},
		channelsSelect: {
			width: "100%",
			marginRight: theme.spacing(1),
		},
		controls: {
			"& .MuiIconButton-sizeSmall": {
				padding: "6px",
			},
		},
		border: {
			height: "1px",
			width: "100%",
			backgroundColor: "#acb2c0",
			marginTop: "24px",
			marginBottom: "16px",
		},
		centerChildren: {
			display: "flex",
			alignItems: "center",
		},
	})
);

export const Channels = observer(({handleTabChange} : {handleTabChange:any}) => {
	const classes = useStyles();
	const [channelId, setChannelId] = useState<string>("");
	const [isError, setIsError] = useState<boolean>(false);
	const [broadcastContext, setBroadcastContext] = useState<ContextType | null>(null)

	const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setChannelId(event.target.value as string);
		setIsError(false);
	};

	const handleJoinChannel = () => {
		if (channelId) {
			channelStore.joinChannel(channelId);
			setChannelId("");
		} else {
			setIsError(true);
		}
	};

	const handleLeaveChannel = () => {
		channelStore.leaveChannel();
	};

	const handleRefreshChannel = () => {
		channelStore.getCurrentChannel();
	};

	const handleBroadcast = () => {
		if(broadcastContext) contextStore.broadcast(broadcastContext);
	};

	return (
		<div className={classes.root}>
			<Grid item xs={12}>
				<Typography variant="h5">Current Channel</Typography>
			</Grid>

			<form className={classes.form} noValidate autoComplete="off">
				<Grid container direction="row" spacing={1}>
					<Grid item xs={12} sm={5}>
						<Typography variant="body1">{channelStore.currentChannel?.id ?? "None"}</Typography>
					</Grid>
					<Grid item xs={12} sm={7}>
						<Grid container direction="row" justifyContent="flex-end" spacing={1}>
							<Grid item className={classes.controls}>
								<Button variant="contained" color="primary" onClick={handleRefreshChannel}>
									Refresh
								</Button>
							</Grid>
							<Grid item className={classes.controls}>
								<Button variant="contained" color="primary" onClick={handleLeaveChannel}>
									Leave
								</Button>
							</Grid>
							<Grid item className={classes.controls}>
								<Tooltip title="Copy code example" aria-label="Copy code example">
									<IconButton
										size="small"
										aria-label="Copy code example"
										color="primary"
										onClick={copyToClipboard(codeExamples.getCurrentChannel, "getCurrentChannel")}
									>
										<FileCopyIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>

			<div className={classes.border}></div>

			<Grid item xs={12}>
				<Typography variant="h5">Join System Channels</Typography>
			</Grid>

			<form className={classes.form} noValidate autoComplete="off">
				<Grid container spacing={1}>
					<Grid item xs={12} sm={9}>
						<FormControl variant="outlined" className={classes.channelsSelect} size="small" error={isError}>
							<InputLabel id="channel">Channel</InputLabel>
							<Select
								labelId="channel"
								id="channel-select"
								value={channelId ?? ""}
								onChange={handleSelectChange}
								label="Channel"
								MenuProps={{
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left",
									},
									getContentAnchorEl: null,
								}}
							>
								{!channelStore.systemChannels.length && (
									<MenuItem value="" disabled>
										No channels received
									</MenuItem>
								)}
								{channelStore.systemChannels.length && <MenuItem value="" style={{ height: "0", padding: "0" }} />}
								{channelStore.systemChannels.length &&
									channelStore.systemChannels.map(({ id }) => (
										<MenuItem key={id} value={id}>
											{id}
										</MenuItem>
									))}
							</Select>
							{isError && <FormHelperText>Select channel from list</FormHelperText>}
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={3} className={classes.centerChildren}>
						<Grid container direction="row" justifyContent="flex-end" spacing={1}>
							<Grid item className={classes.controls}>
								<Button variant="contained" color="primary" onClick={handleJoinChannel}>
									Join
								</Button>
							</Grid>
							<Grid item className={classes.controls}>
								<Tooltip title="Copy code example" aria-label="Copy code example">
									<IconButton
										size="small"
										aria-label="Copy code example"
										color="primary"
										onClick={copyToClipboard(codeExamples.channels, "joinChannel")}
									>
										<FileCopyIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>

			<div className={classes.border}></div>

			<Grid item xs={12}>
				<Typography variant="h5">Broadcast context</Typography>
			</Grid>

			<Grid container direction="row" spacing={1}>
					<Grid item sm={9}>
						<ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setBroadcastContext} />
					</Grid>
					<Grid item container className={classes.controls} sm={3} justifyContent="flex-end">
						<Button
							disabled={!broadcastContext}
							variant="contained"
							color="primary"
							onClick={handleBroadcast}
						>
							Broadcast Context
						</Button>

						<Tooltip title="Copy code example" aria-label="Copy code example">
							<IconButton
								size="small"
								aria-label="Copy code example"
								color="primary"
								onClick={copyToClipboard(codeExamples.broadcast, "broadcast")}
							>
								<FileCopyIcon />
							</IconButton>
						</Tooltip>
					</Grid>

					<div className={classes.border}></div>

					<ContextLinking />
				</Grid>
		</div>
	);
});
