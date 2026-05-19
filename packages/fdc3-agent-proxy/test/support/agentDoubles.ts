/*
 * Copyright 2026 FINOS, The Fintech Open Source Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AppIntent, Channel, IntentResult } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { IntentResolver, IntentResolutionChoice, ChannelSelector } from '@finos/fdc3-standard';
import type { PropsWorldLike } from '@robmoffat/standard-cucumber-steps';

export const CHANNEL_STATE = 'CHANNEL_STATE';

export class SimpleIntentResolver implements IntentResolver {
  cw: PropsWorldLike;

  constructor(cw: PropsWorldLike) {
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

export class SimpleChannelSelector implements ChannelSelector {
  cw: PropsWorldLike;

  constructor(cw: PropsWorldLike) {
    this.cw = cw;
  }

  async updateChannel(channelId: string | null, availableChannels: Channel[]): Promise<void> {
    this.cw.props['channelId'] = channelId;
    this.cw.props['channels'] = availableChannels;
  }

  setChannelChangeCallback(_callback: (channelId: string | null) => void): void {}

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}
}
