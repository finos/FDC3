/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { Tabs, Tab } from '@material-ui/core';
import { TabPanel } from '../common/TabPanel.js';
import { ContextListeners } from './ContextListeners.js';
import { IntentListeners } from './IntentListeners.js';
import { AppChannelListeners } from './AppChannelListeners.js';
import { SystemLog } from './SystemLog.js';
import { PrivateChannelListeners } from './PrivateChannelListeners.js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.MuiTab-wrapper': {
        flexDirection: 'row !important',
      },
    },
    root: {
      flexGrow: 1,
    },
    paper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      '&:first-child': {
        marginTop: 0,
      },
    },
    systemLog: {
      maxHeight: '1000px',
      overflowY: 'scroll',
    },
    indicator: {
      backgroundColor: '#00bbe1',
    },
    tabs: {
      borderBottomColor: '#acb2c0',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      minHeight: '28px',
    },
    icon: {
      marginBottom: '3px !important',
      fontSize: '15px',
      marginRight: '3px',
    },
  })
);

const a11yProps = (index: any) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
};

export const Workbench = observer(() => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        classes={{
          indicator: classes.indicator,
        }}
        className={classes.tabs}
      >
        <Tab
          label="Listeners"
          {...a11yProps(0)}
          style={{ display: 'flex', alignItems: 'center' }}
          icon={
            <Tooltip
              title="Context received will be displayed here, but you will not receive your own messages back"
              aria-label="Context received will be displayed here, but you will not receive your own messages back"
            >
              <InfoIcon className={classes.icon} />
            </Tooltip>
          }
        />
        <Tab label="System Log" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <ContextListeners />
        <IntentListeners />
        <AppChannelListeners />
        <PrivateChannelListeners />
      </TabPanel>

      <div className={classes.systemLog}>
        <TabPanel value={tabValue} index={1}>
          <SystemLog />
        </TabPanel>
      </div>
    </div>
  );
});
