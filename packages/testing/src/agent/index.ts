import { AppIntent, Channel, IntentResult } from '@kite9/fdc3-standard';
import { Context } from '@kite9/fdc3-context';
import { IntentResolver, IntentResolutionChoice, ChannelSelector } from '@kite9/fdc3-standard';
import { PropsWorld } from '../world';

/**
 * This super-simple intent resolver just resolves to the first
 * intent / app in the list, unless the context is fdc3.cancel-me  and then it just cancels.
 */
export class SimpleIntentResolver implements IntentResolver {
  cw: PropsWorld;

  constructor(cw: PropsWorld) {
    this.cw = cw;
  }

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}

  async intentChosen(ir: IntentResult): Promise<IntentResult> {
    this.cw.props['intent-result'] = ir;
    return ir;
  }

  async chooseIntent(appIntents: AppIntent[], ctx: Context): Promise<IntentResolutionChoice | void> {
    if (ctx.type == 'fdc3.cancel-me') {
      return;
    }

    const out = {
      intent: appIntents[0].intent,
      chosenApp: appIntents[0].apps[0],
    };

    this.cw.props['intent-resolution'] = out;
    return {
      appId: appIntents[0].apps[0],
      intent: appIntents[0].intent.name,
    };
  }
}

export const CHANNEL_STATE = 'CHANNEL_STATE';

export class SimpleChannelSelector implements ChannelSelector {
  cw: PropsWorld;

  constructor(cw: PropsWorld) {
    this.cw = cw;
  }

  updateChannel(channelId: string | null, availableChannels: Channel[]): void {
    this.cw.props['channelId'] = channelId;
    this.cw.props['channels'] = availableChannels;
  }

  setChannelChangeCallback(_callback: (channelId: string | null) => void): void {}

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}
}
