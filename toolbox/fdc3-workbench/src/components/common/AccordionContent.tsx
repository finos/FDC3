/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { Theme } from '@mui/material/styles';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

export interface AccordionContentProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

const classes = {
  accordion: (theme: Theme) => ({
    margin: theme.spacing(1, 0, 0, 0),
    boxShadow: 'none',
    '&::before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: theme.spacing(1, 0, 0, 0),
    },
  }),
  accordionSummary: {
    border: 'none',
    padding: 0,
    minHeight: 'initial',
    '&.Mui-expanded': {
      minHeight: 'initial',
    },
    '& .MuiAccordionSummary-content': {
      margin: '0 12px 0 0',
      '&.Mui-expanded': {
        margin: '0 12px 0 0',
      },
    },
    '& .MuiAccordionSummary-expandIcon': {
      padding: '6px',
    },
  },
  accordionDetails: {
    paddingTop: 0,
    paddingLeft: 0,
    flexDirection: 'column',
  },
  accordionTitle: {
    color: '#0086bf',
    fontSize: '16px',
  },
  expand_icon: {
    color: '#0086bf',
  },
  icon: {
    marginBottom: '-1px !important',
    fontSize: '15px',
    marginLeft: '5px',
  },
} as const;

export const AccordionContent: React.FC<AccordionContentProps> = ({ icon, title, children }: AccordionContentProps) => {
  return (
    <Accordion sx={classes.accordion} defaultExpanded>
      <AccordionSummary
        sx={classes.accordionSummary}
        expandIcon={<ExpandMoreIcon sx={classes.expand_icon} />}
        aria-label="Expand"
        aria-controls="additional-actions1-content"
        id="additional-actions1-header"
      >
        <Typography variant="h5" sx={classes.accordionTitle}>
          {title}
          {icon && (
            <Tooltip title={icon} aria-label={icon}>
              <InfoIcon sx={classes.icon} />
            </Tooltip>
          )}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={classes.accordionDetails}>{children}</AccordionDetails>
    </Accordion>
  );
};
