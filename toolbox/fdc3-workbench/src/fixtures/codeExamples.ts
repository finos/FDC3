export const codeExamples = {
	userChannels:
		"// get all user channels\n" +
		"const channels = await fdc3.getUserChannels();\n" +
		"\n" +
		"// create UI to pick from the user channels\n" +
		"\n" +
		"// join the channel on selection\n" +
		"fdc3.joinUserChannel(selectedChannel.id);",
	getCurrentUserChannel:
		"// get the current channel membership\n" +
		"let current = await fdc3.getCurrentChannel();\n" +
		"\n" +
		"//leave the current channel\n" +
		"await fdc3.leaveCurrentChannel();\n" +
		"//the fdc3Listener will now cease receiving context",
	broadcast:
		"const instrument = {\n" +
		"    type: 'fdc3.instrument',\n" +
		"    id: {\n" +
		"        ticker: 'AAPL'\n" +
		"    }\n" +
		"};\n" +
		"\n" +
		"fdc3.broadcast(instrument);",
	appChannelBroadcast:
		"const instrument = {\n" +
		"    type: 'fdc3.instrument',\n" +
		"    id: {\n" +
		"        ticker: 'AAPL'\n" +
		"    }\n" +
		"};\n" +
		"\n" +
		"appChannelID.broadcast(instrument);",
	raiseIntent: (context: string, intent: string) =>
		"//Raise an intent with a specified context\n" +
		`let context = ${
			context !== "null" ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
		}; \n` +
		`fdc3.raiseIntent("${intent !== "null" ? intent : "ViewChart"}", context);`,
	raiseIntentTarget: (context: string, intent: string) =>
		"//Raise an intent with a specified context\n" +
		`let context = ${
			context !== "null" ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
		}; \n` +
		"//Find appId in promise result\n" +
		"let intent = await fdc3.findIntentsByContext(context); \n" +
		"let appId = intent[0].apps[0].appId; \n" +
		`fdc3.raiseIntent("${intent !== "null" ? intent : "ViewChart"}", context, {appId});`,
	raiseIntentInstance: (context: string, intent: string) =>
		"//Raise an intent with a specified context\n" +
		`let context = ${
			context !== "null" ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
		}; \n` +
		"//Find appId in promise result\n" +
		"let intent = await fdc3.findIntentsByContext(context); \n" +
		"let appId = intent[0].apps[0].appId; \n" +
		"//Find instanceId is promise result" +
		"let intances = await fdc3.findInstances({appId}); \n" +
		"let instanceId = instances[0].instanceId; \n" +
		`fdc3.raiseIntent("${intent !== "null" ? intent : "ViewChart"}", context, {appId, instanceId});`,
	contextListener:
		"// any context\n" +
		"const listener = fdc3.addContextListener(null, context => {\n" +
		"    //add context handling code here\n" +
		"});\n" +
		"\n" +
		"// listener for a specific type\n" +
		"const contactListener = fdc3.addContextListener('fdc3.contact', contact => {\n" +
		"    //add context handling code here\n" +
		"});",
	appChannelContextListener:
		"// any context\n" +
		"const listener = appChannelID.addContextListener(null, context => {\n" +
		"    //add context handling code here\n" +
		"});\n" +
		"\n" +
		"// listener for a specific type\n" +
		"const contactListener = appChannelID.addContextListener('fdc3.contact', contact => {\n" +
		"    //add context handling code here\n" +
		"});",
	intentListener:
		"const listener = fdc3.addIntentListener('StartChat', context => {\n" +
		"  // start chat has been requested by another application\n" +
		"});",
	intentListenerWithContextResult:
		"const instrument = {\n" +
		"    type: 'fdc3.instrument',\n" +
		"    id: {\n" +
		"        ticker: 'AAPL'\n" +
		"    }\n" +
		"};\n" +
		"\n" +
		"const listener = fdc3.addIntentListener('StartChat', context => {\n" +
		"  // start chat has been requested by another application\n" +
		" return instrument\n" +
		"});",
	intentListenerWithAppChannel:
		"const listener = fdc3.addIntentListener('StartChat', context => {\n" +
		"  // start chat has been requested by another application\n" +
		" const channel = await appChannelStore.getOrCreateChannel(channelName);\n" +
		" return channel;\n" +
		"});",
	intentListenerWithPrivateChannel:
		"const listener = fdc3.addIntentListener('StartChat', context => {\n" +
		"  // start chat has been requested by another application\n" +
		" const channel = await fdc3.createPrivateChannel();\n" +
		" return channel;\n" +
		"});",
	raiseIntentForContext: (context: string) =>
		`let context = ${
			context !== "null" ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
		}; \n` + "const intentResolution = await fdc3.raiseIntentForContext(context);",
	raiseIntentForContextTarget: (context: string) =>
		`let context = ${
			context !== "null" ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
		}; \n` +
		"//Find appId in promise result\n" +
		"let intent = await fdc3.findIntentsByContext(context); \n" +
		"let appId = intent[0].apps[0].appId; \n" +
		'const intentResolution = await fdc3.raiseIntentForContext(context, {appId});"',
	raiseIntentForContextInstance: (context: string) =>
		`let context = ${
			context !== "null" ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
		}; \n` +
		"//Find appId in promise result\n" +
		"let intent = await fdc3.findIntentsByContext(context); \n" +
		"let appId = intent[0].apps[0].appId; \n" +
		"//Find instanceId is promise result" +
		"let intances = await fdc3.findInstances({appId}); \n" +
		"let instanceId = instances[0].instanceId; \n" +
		"const intentResolution = await fdc3.raiseIntentForContext(context, {appId, instanceId});",
};
