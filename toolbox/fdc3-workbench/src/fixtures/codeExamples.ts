/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
export const codeExamples = {
	channels:
		"// get all system channels\n" +
		"const channels = await fdc3.getSystemChannels();\n" +
		"\n" +
		"// create UI to pick from the system channels\n" +
		"\n" +
		"// join the channel on selection\n" +
		"fdc3.joinChannel(selectedChannel.id);",
	getCurrentChannel:
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
	raiseIntent:
		"//Raise an intent with a specified context\n" +
		'let context = {type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}; \n' +
		'fdc3.raiseIntent("ViewChart", context);',
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
	intentListener:
		"const listener = fdc3.addIntentListener('StartChat', context => {\n" +
		"  // start chat has been requested by another application\n" +
		"});",
	raiseIntentForContext: "const intentResolution = await fdc3.raiseIntentForContext(context);",
};
