/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React from 'react';
import { List, ListItem, ListItemText, Typography, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { AccordionContent } from './AccordionContent';
import DeleteIcon from '@mui/icons-material/Delete';

export interface AccordionListItem {
  id: string;
  textPrimary: string;
  afterEachElement?: React.ReactNode;
}

export interface AccordionListProps {
  title: string;
  icon?: string;
  listItems: AccordionListItem[];
  noItemsText: string;
  onDelete?: (id: string) => void;
}

const classes = {
  list: {
    padding: 0,
    width: '100%',
  },
  listItem: (theme: Theme) => ({
    padding: 0,
    '&.MuiListItem-secondaryAction': {
      paddingRight: theme.spacing(6),
    },
  }),
  listAction: {
    top: '2px',
    transform: 'none',
  },
} as const;

export const AccordionList: React.FC<AccordionListProps> = ({
  title,
  icon,
  listItems,
  noItemsText,
  onDelete,
}: AccordionListProps) => {
  const handleDelete = (id: string) => () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <AccordionContent title={title} icon={icon}>
      {!listItems.length && <Typography variant="body1">{noItemsText}</Typography>}
      {!!listItems.length && (
        <List sx={classes.list}>
          {listItems.map(({ id, textPrimary, afterEachElement }) => (
            <ListItem key={id} sx={classes.listItem} disableGutters>
              <ListItemText disableTypography primary={textPrimary} secondary={afterEachElement} />
              <ListItemSecondaryAction sx={classes.listAction}>
                {onDelete && (
                  <IconButton size="small" edge="end" aria-label="delete" onClick={handleDelete(id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </AccordionContent>
  );
};
