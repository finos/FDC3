/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { DisplayMetadata } from './DisplayMetadata';

/** Interface representing the data fields of a user channel, without the functions. */
interface UserChannelTemplate {
  readonly id: string;
  readonly type: 'user';
  readonly displayMetadata?: DisplayMetadata;
}

const recommendedChannels: Array<UserChannelTemplate> = [
  {
    id: 'Channel 1',
    type: 'user',
    displayMetadata: {
      name: 'Channel 1',
      color: 'red',
      glyph: '1',
    },
  },
  {
    id: 'Channel 2',
    type: 'user',
    displayMetadata: {
      name: 'Channel 2',
      color: 'orange',
      glyph: '2',
    },
  },
  {
    id: 'Channel 3',
    type: 'user',
    displayMetadata: {
      name: 'Channel 3',
      color: 'yellow',
      glyph: '3',
    },
  },
  {
    id: 'Channel 4',
    type: 'user',
    displayMetadata: {
      name: 'Channel 4',
      color: 'green',
      glyph: '4',
    },
  },
  {
    id: 'Channel 5',
    type: 'user',
    displayMetadata: {
      name: 'Channel 5',
      color: 'cyan',
      glyph: '5',
    },
  },
  {
    id: 'Channel 6',
    type: 'user',
    displayMetadata: {
      name: 'Channel 6',
      color: 'blue',
      glyph: '6',
    },
  },
  {
    id: 'Channel 7',
    type: 'user',
    displayMetadata: {
      name: 'Channel 7',
      color: 'magenta',
      glyph: '7',
    },
  },
  {
    id: 'Channel 8',
    type: 'user',
    displayMetadata: {
      name: 'Channel 8',
      color: 'purple',
      glyph: '8',
    },
  },
];

export default recommendedChannels;
