/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
export const codeExamples = {
  userChannels: `// get all user channels
const channels = await fdc3.getUserChannels();

// create UI to pick from the user channels

// join the channel on selection
fdc3.joinUserChannel(selectedChannel.id);`,

  getCurrentUserChannel: `// get the current channel membership
let current = await fdc3.getCurrentChannel();

//leave the current channel\nawait fdc3.leaveCurrentChannel();
//the fdc3Listener will now cease receiving context`,

  broadcast: `const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

fdc3.broadcast(instrument);`,

  appChannelBroadcast: `const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

appChannel.broadcast(instrument);`,

  raiseIntent: (context: string, intent: string) =>
    `//Raise an intent with a specified context
let context = ${context !== 'null' ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'}; 
fdc3.raiseIntent("${intent !== 'null' ? intent : 'ViewChart'}", context);`,

  raiseIntentTarget: (context: string, intent: string) =>
    `//Raise an intent with a specified context
let context = ${context !== 'null' ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'};
//Find appId in promise result
let intent = await fdc3.findIntentsByContext(context);
let appId = intent[0].apps[0].appId;
fdc3.raiseIntent("${intent !== 'null' ? intent : 'ViewChart'}", context, {appId});`,

  raiseIntentInstance: (context: string, intent: string) =>
    `//Raise an intent with a specified context
let context = ${context !== 'null' ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'};
//Find appId in promise result
let intent = await fdc3.findIntentsByContext(context);
let appId = intent[0].apps[0].appId;
//Find instanceId is promise resultlet intances = await fdc3.findInstances({appId});
let instanceId = instances[0].instanceId;
fdc3.raiseIntent("${intent !== 'null' ? intent : 'ViewChart'}", context, {appId, instanceId});`,

  contextListener: `// any context
const listener = fdc3.addContextListener(null, context => {
    //add context handling code here
});

// listener for a specific type
const contactListener = fdc3.addContextListener('fdc3.contact', contact => {
    //add context handling code here
});`,

  appChannelContextListener: `// any context
const listener = appChannel.addContextListener(null, context => {
    //add context handling code here
});

// listener for a specific type
const contactListener = appChannel.addContextListener('fdc3.contact', contact => {
    //add context handling code here
});`,

  intentListener: `const listener = fdc3.addIntentListener('StartChat', context => {
  // start chat has been requested by another application
});`,

  intentListenerWithContextResult: `const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

const listener = fdc3.addIntentListener('StartChat', context => {
    // start chat has been requested by another application
    return instrument;
});`,

  intentListenerWithAppChannel: `const listener = fdc3.addIntentListener('StartChat', context => {
    // start chat has been requested by another application
	const channel = await appChannelStore.getOrCreateChannel(channelName);
	return channel;
});`,

  intentListenerWithPrivateChannel: `const listener = fdc3.addIntentListener('StartChat', context => {
	// start chat has been requested by another application
	const channel = await fdc3.createPrivateChannel();
	return channel;
});`,

  intentListenerWithContext: `const listener = fdc3.addIntentListenerWithContext('StartChat', 'fdc3.contact', context => {
  // start chat has been requested by another application
});`,

  raiseIntentForContext: (context: string) =>
    `let context = ${
      context !== 'null' ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'
    };

const intentResolution = await fdc3.raiseIntentForContext(context);`,

  raiseIntentForContextTarget: (context: string) =>
    `let context = ${context !== 'null' ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'};

//Find appId in promise result
let intent = await fdc3.findIntentsByContext(context);
let appId = intent[0].apps[0].appId;
const intentResolution = await fdc3.raiseIntentForContext(context, {appId});`,

  raiseIntentForContextInstance: (context: string) =>
    `let context = ${context !== 'null' ? context : '{type: "fdc3.instrument", name: "Tesla, inc.", id: {ticker: "TSLA"}}'};

//Find appId in promise result
let intent = await fdc3.findIntentsByContext(context);
let appId = intent[0].apps[0].appId;

//Find instanceId is promise result
let intances = await fdc3.findInstances({appId});
let instanceId = instances[0].instanceId;
const intentResolution = await fdc3.raiseIntentForContext(context, {appId, instanceId});`,
};
