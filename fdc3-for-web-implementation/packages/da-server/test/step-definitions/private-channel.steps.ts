// import { When } from '@cucumber/cucumber'
// import { CustomWorld } from '../world';
// import { contextMap, createMeta } from './generic.steps';


// When('{string} adds a context listener on private channel {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       contextType
//     },
//     type: 'PrivateChannel.onAddContextListener'
//   } as PrivateChannelOnAddContextListenerAgentRequest

//   this.server.receive(message, meta.source)
// })

// When('{string} removes a context listener on private channel {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       contextType
//     },
//     type: 'PrivateChannel.onUnsubscribe'
//   } as PrivateChannelOnUnsubscribeAgentRequest

//   this.server.receive(message, meta.source)
// })


// When('{string} removes an {string} on private channel {string}', function (this: CustomWorld, app: string, listenerType: string, channelId: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       listenerType
//     },
//     type: 'PrivateChannel.eventListenerRemoved'
//   } as PrivateChannelEventListenerRemovedAgentRequest

//   this.server.receive(message, meta.source)
// })

// When('{string} adds an {string} on private channel {string}', function (this: CustomWorld, app: string, listenerType: string, channelId: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       listenerType
//     },
//     type: 'PrivateChannel.eventListenerAdded'
//   } as PrivateChannelEventListenerAddedAgentRequest

//   this.server.receive(message, meta.source)
// })

// When('{string} broadcasts {string} on private channel {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       context: contextMap[contextType]
//     },
//     type: 'PrivateChannel.broadcast'
//   } as PrivateChannelBroadcastAgentRequest

//   this.server.receive(message, meta.source)
// })

// When('{string} disconnects from private channel {string}', function (this: CustomWorld, app: string, channelId: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId
//     },
//     type: 'PrivateChannel.onDisconnect'
//   } as PrivateChannelOnDisconnectAgentRequest

//   this.server.receive(message, meta.source)
// })