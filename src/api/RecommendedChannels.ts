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
    id: 'A',
    type: 'user',
    displayMetadata: {
      name: 'Channel A',
      color: 'red',
      glyph: 'A',
    },
  },
  {
    id: 'B',
    type: 'user',
    displayMetadata: {
      name: 'Channel B',
      color: 'orange',
      glyph: 'B',
    },
  },
  {
    id: 'C',
    type: 'user',
    displayMetadata: {
      name: 'Channel C',
      color: 'yellow',
      glyph: 'C',
    },
  },
  {
    id: 'D',
    type: 'user',
    displayMetadata: {
      name: 'Channel D',
      color: 'green',
      glyph: 'D',
    },
  },
  {
    id: 'E',
    type: 'user',
    displayMetadata: {
      name: 'Channel E',
      color: 'lightblue',
      glyph: 'E',
    },
  },
  {
    id: 'F',
    type: 'user',
    displayMetadata: {
      name: 'Channel F',
      color: 'blue',
      glyph: 'F',
    },
  },
  {
    id: 'G',
    type: 'user',
    displayMetadata: {
      name: 'Channel G',
      color: 'purple',
      glyph: 'G',
    },
  },
  {
    id: 'H',
    type: 'user',
    displayMetadata: {
      name: 'Channel H',
      color: 'brown',
      glyph: 'H',
    },
  },
];

export default recommendedChannels;
