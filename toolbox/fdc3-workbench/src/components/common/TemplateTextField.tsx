/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const TemplateTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#0086bf',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#0086bf',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#0086bf',
    },
    '&:hover fieldset': {
      borderColor: '#0086bf',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0086bf',
    },
  },
});
