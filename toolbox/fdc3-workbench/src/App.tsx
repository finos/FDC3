/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState } from 'react';
import { Theme, ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Grid, Paper, Tabs, Tab, Typography, Link, Snackbar, Alert, SnackbarCloseReason } from '@mui/material';
import { observer } from 'mobx-react';
import 'normalize.css';
import '@fontsource/roboto';
import '@fontsource/source-code-pro';
import { TabPanel } from './components/common/TabPanel';
import { Header } from './components/Header';
import { Channels } from './components/Channels';
import { Workbench } from './components/Workbench/Workbench';
import { ContextCreate } from './components/ContextCreate';
import { Intents } from './components/Intents';
import { AppChannels } from './components/AppChannels';
import snackbarStore from './store/SnackbarStore';
import './App.css';
import { getWorkbenchAgent } from './utility/Fdc3Api';

const mainTheme = createTheme({
  palette: {
    primary: {
      light: '#005d85',
      main: '#0086bf',
      dark: '#339ecb',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiTableCell: {
      defaultProps: {
        padding: 'normal',
      },
      styleOverrides: {
        root: {
          padding: '1px',
        },
      },
    },
  },
});

mainTheme.typography.h4 = {
  fontFamily: 'Source Code Pro',
  fontSize: '20px',
  color: '#0086bf',
  paddingLeft: '4px',
  paddingBottom: '11px',
};

mainTheme.typography.h5 = {
  fontSize: '16px',
};

mainTheme.typography.body1 = {
  fontSize: '1rem',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: '0.00938em',
  marginBlockStart: '10px',
  marginBlockEnd: '10px',
};

const classes = {
  root: {
    flexGrow: 1,
  },
  header: {
    mb: 2,
  },
  body: {
    height: '100%',
  },
  paper: {
    mt: 2,
    p: 2,
    height: '100%',
    '&:first-of-type': {
      mt: 0,
    },
  },
  tabs: {
    borderBottomColor: '#acb2c0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    minHeight: '28px',
    "& [aria-selected='true']": {
      backgroundColor: 'rgba(0, 134, 191, 0.21)',
    },
  },
  indicator: {
    backgroundColor: '#00bbe1',
  },
  footer: {
    fontSize: '10px',
    fontStyle: 'italic',
    color: '#5b606f',
    flexDirection: 'row',
    justifyContent: 'center',
    m: 2,
    '& *:first-of-type': {
      paddingTop: '27px',
    },
  },
  link: {
    color: '#5b606f',
    fontWeight: 'bold',
    '&:hover': {
      color: '#5b606f',
    },
  },
  workbench: {
    mt: { xs: '30px', md: 0 },
  },
} as const;

const openAPIDocs = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  window.open('https://fdc3.finos.org/docs/api/overview', 'FDC3APIDocs');
  return false;
};

const openSpecAccessDocs = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  window.open('https://fdc3.finos.org/docs/api/spec#api-access', 'FDC3APIDocs');
  return false;
};

const openSupportedPlatformsDocs = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  window.open('https://fdc3.finos.org/docs/supported-platforms', 'FDC3APIDocs');
  return false;
};

export const App = observer(() => {
  const [fdc3Available, setFdc3Available] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [contextName, setContextName] = useState('');

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number, name: string = '') => {
    setContextName(name);
    setTabIndex(newIndex);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
    setTimeout(() => snackbarStore.clearSnackbarData(), 500);
  };

  //check if the FDC3 API is available so we know whether to render
  useEffect(() => {
    (async () => {
      try {
        await getWorkbenchAgent();
        setFdc3Available(true);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    setOpenSnackbar(!!snackbarStore.snackbarData);
  }, [snackbarStore.snackbarData]);

  return (
    <ThemeProvider theme={mainTheme}>
      <Grid sx={classes.root} container>
        <Grid sx={classes.header} container item xs={12}>
          <Header fdc3Available={fdc3Available} />
        </Grid>
        {fdc3Available ? (
          <Grid sx={classes.body} container spacing={2} item xs={12} style={{ marginLeft: '0px' }}>
            <Grid item xs={12} md={8} style={{ flex: 1 }}>
              <Paper sx={classes.paper}>
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    ...classes.tabs,
                    '& .MuiTabs-indicator': classes.indicator,
                  }}
                >
                  <Tab label="Contexts" />
                  <Tab label="Intents" />
                  <Tab label="User Channels" />
                  <Tab label="App Channels" />
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                  <ContextCreate contextName={contextName} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Intents handleTabChange={handleTabChange} />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                  <Channels handleTabChange={handleTabChange} />
                </TabPanel>
                <TabPanel value={tabIndex} index={3}>
                  <AppChannels handleTabChange={handleTabChange} />
                </TabPanel>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} sx={classes.workbench}>
              <Paper sx={classes.paper}>
                <Workbench />
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Grid sx={classes.body} container spacing={2} item xs={12} style={{ marginLeft: '0px' }}>
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} item xs={12}>
              <Paper sx={classes.paper}>
                <Typography variant="h4">FDC3 API not detected!</Typography>
                <Typography variant="body1">An FDC3 desktop agent implementation was not found.</Typography>
                <Typography variant="body1">
                  For web applications to be FDC3-enabled, they need to run in the context of an agent that makes the
                  FDC3 API available to the application. This desktop agent is also responsible for launching and
                  coordinating applications. It could be a browser extension, web app, or full-fledged desktop container
                  framework.
                </Typography>
                <Typography variant="body1">
                  See the FDC3 standard documentation for details on{' '}
                  <Link
                    sx={classes.link}
                    href="https://fdc3.finos.org/docs/supported-platforms"
                    onClick={openSupportedPlatformsDocs}
                  >
                    supported platforms
                  </Link>{' '}
                  and{' '}
                  <Link
                    sx={classes.link}
                    href="https://fdc3.finos.org/docs/api/spec#api-access"
                    onClick={openSpecAccessDocs}
                  >
                    accessing the FDC3 API
                  </Link>
                  .
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Grid container item xs={12} sx={classes.footer}>
          <Typography variant="body1">
            Learn more about the{' '}
            <Link sx={classes.link} href="https://fdc3.finos.org/docs/api/overview" onClick={openAPIDocs}>
              FDC3 Standard and APIs
            </Link>{' '}
            | Proud member of the{' '}
            <Link sx={classes.link} href="https://www.finos.org/">
              Fintech Open Source Foundation
            </Link>{' '}
            | Copyright © 2021-2023 Finsemble, inc. &amp; Contributors to the FDC3 standards project
          </Typography>
        </Grid>
      </Grid>

      <Snackbar key={snackbarStore.snackbarData?.id} open={openSnackbar} autoHideDuration={4000} onClose={handleClose}>
        <Alert elevation={6} variant="filled" onClose={() => handleClose()} severity={snackbarStore.snackbarData?.type}>
          {snackbarStore.snackbarData?.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
});

export default App;
