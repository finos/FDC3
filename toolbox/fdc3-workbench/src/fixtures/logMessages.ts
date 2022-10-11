import { logMessagesName, logMessagesType } from "../store/SystemLogStore";

type LogMessages = {
	[name in logMessagesName]: {
		[type in logMessagesType]?: string;
	};
};

export const getLogMessage = (name: logMessagesName, type: logMessagesType, value: string = ""): string => {
	const logMessages: LogMessages = {
		getFdc3: {
			error: `The FDC3 API is not ready${value ? ` (${value})` : ""}`,
		},
		getChannels: {
			success: `Successfully retrieved System channels`,
			error: `Failed to retrieve System channels`,
		},
		getCurrentChannel: {
			success: `Successfully retrieved current channel [${value}]`,
			error: `Failed to retrieve current channel`,
		},
		joinChannel: {
			success: `Successfully joined the [${value}] channel`,
			error: `Failed to join the [${value}] channel`,
		},
		leaveChannel: {
			success: `Successfully left the [${value}] channel`,
			error: `Failed to leave the [${value}] channel`,
			warning: `Not currently joined to a channel`,
		},
		broadcast: {
			success: "Successfully broadcasted context",
			error: "Failed to broadcast context:",
		},
		raiseIntent: {
			success: `Successfully raised intent [${value}]`,
			error: `Failed to raise intent [${value}]`,
		},
		raiseIntentForContext: {
			success: `Successfully raised intent for context`,
			error: `Failed to raise intent for context`,
		},
		addContextListener: {
			success: `A context listener for '[${value}]' has been added`,
			error: `Failed to add a context listener for '[${value}]'`,
		},
		removeContextListener: {
			success: `A context listener for '[${value}]' has been removed`,
			error: `Failed to remove a context listener for '[${value}]'`,
		},
		addIntentListener: {
			success: `An intent listener for '[${value}]' has been added`,
			error: `Failed to add an intent listener for '[${value}]'`,
		},
		removeIntentListener: {
			success: `An intent listener for '[${value}]' has been removed`,
			error: `Failed to remove an intent listener for '[${value}]'`,
		},
		receivedContextListener: {
			info: `Received context via '[${value}]' listener`,
			error: `Failed to receive context from '[${value}]' listener`,
		},
		receivedIntentListener: {
			info: `Received context via '[${value}]' listener.`,
			error: `Failed to receive context from '[${value}]' listener.`,
		},
		saveTemplate: {
			success: `Saved context template for '[${value}]'.`,
			error: `Failed to save context template.`,
		},
		deleteTemplate: {
			success: `Deleted context template for '[${value}]'.`,
			error: `Failed to delete context template.`,
		},
		copyToClipboard: {
			info: `${value} code snippet copied to clipboard`,
			error: `Failed to copy code ${value} snippet to clipboard.`,
		},
	};

	return logMessages[name][type] ?? (value != "" ? `${value}` : `Undefined log message ${name}.${type}`);
};
