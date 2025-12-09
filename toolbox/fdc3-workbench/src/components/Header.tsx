/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Tooltip, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { getWorkbenchAgent, ImplementationMetadata } from '../utility/Fdc3Api';

declare global {
  interface Window {
    fdc3Version: string;
  }
}

const classes = {
  root: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundColor: 'transparent',
    p: 2,
    px: 4,
    pb: '0px',
  },
  link: {
    color: 'common.white',
    textDecoration: 'underline',
    '&:hover': {
      color: 'common.white',
    },
  },
  info: {
    marginLeft: 'auto',
    minWidth: '200px',
    fontSize: '12px',
  },
  fdc3: {},
  headerCube: {
    width: '325px',
    height: '40px',
  },
  backgroundHeader: {
    background: 'linear-gradient(to bottom, #0086bf, #00bbe1)',
    height: '200px',
    width: '100%',
    left: '0px',
    top: '0px',
    position: 'absolute',
    zIndex: -10,
  },
  warning: {
    color: 'yellow',
    fontSize: '10px',
    transform: 'scale(1.5)',
    marginLeft: '5px',
  },
  warningText: {
    color: 'red',
  },
  appid: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    overflowWrap: 'anywhere',
    maxWidth: '150px',
  },
};

export const Header = (props: { fdc3Available: boolean }) => {
  const [appInfo, setAppInfo] = useState<any>();
  const params = new URLSearchParams(window.location.search);
  const paramVersion = params.get('fdc3Version')?.replace(/\/$/, '') || '';
  const [chosenVersion, setChosenVersion] = useState<string>('2.0');
  let warningText = `Your FDC3 version (${appInfo?.fdc3Version}) doesn't match the version of the FDC3 Workbench you are using (${chosenVersion})`;
  const supportedVersion = ['2.0', '1.2'];

  useEffect(() => {
    if (props.fdc3Available) {
      const updateInfo = async () => {
        let implInfo: ImplementationMetadata | null = null;

        try {
          const implInfoPromise = getWorkbenchAgent().then(agent => agent.getInfo());
          if (paramVersion == '1.2' && (implInfoPromise as unknown as ImplementationMetadata).fdc3Version) {
            implInfo = implInfoPromise as unknown as ImplementationMetadata;
          } else {
            implInfo = await implInfoPromise;
          }

          let displayInfo = {
            fdc3Version: 'not specified',
            provider: 'not specified',
            providerVersion: 'not specified',
            appMetadata: {
              appId: 'not specified',
              version: 'not specified',
            },
          };

          let mergedAppMetaData = Object.assign({}, displayInfo.appMetadata, implInfo.appMetadata);
          displayInfo = Object.assign(displayInfo, implInfo, { appMetadata: mergedAppMetaData });

          setAppInfo(displayInfo);
        } catch (e) {
          console.error('Failed to retrieve FDC3 implementation info', e);
        }

        if (paramVersion) {
          setChosenVersion(paramVersion);
        } else if (implInfo?.fdc3Version && implInfo.fdc3Version == '2.1') {
          setChosenVersion('2.0');
        } else if (implInfo?.fdc3Version && supportedVersion.includes(implInfo.fdc3Version)) {
          setChosenVersion(implInfo.fdc3Version);
        } else {
          setChosenVersion('2.0');
        }

        window.fdc3Version = chosenVersion;
      };

      updateInfo();
    }
  }, [props.fdc3Available, chosenVersion]);

  return (
    <Box sx={classes.root}>
      <Box sx={classes.backgroundHeader}></Box>
      <AppBar position="static" elevation={0} style={{ backgroundColor: 'transparent' }}>
        <Toolbar sx={classes.toolbar}>
          <div>
            <Typography variant="h3" color="inherit" sx={classes.fdc3}>
              <Box component="img" src="./fdc3-logo.png" sx={classes.headerCube} />
            </Typography>
            <Typography color="inherit">
              version:&nbsp;
              {supportedVersion.map((ver, index) => (
                <span key={index}>
                  {ver === chosenVersion ? (
                    <span>
                      <b>{ver == '2.0' ? '2.0+' : ver}</b>
                    </span>
                  ) : (
                    <Box
                      component="a"
                      sx={{
                        color: 'common.white',
                        textDecoration: 'underline',
                        '&:hover': {
                          color: 'common.white',
                        },
                      }}
                      href={`?fdc3Version=${ver}`}
                    >
                      {ver == '2.0' ? '2.0+' : ver}
                    </Box>
                  )}
                  {supportedVersion.length - 1 !== index && <span> | </span>}
                </span>
              ))}
            </Typography>
          </div>

          <Box sx={classes.info}>
            <table id="providerInfo">
              <tbody>
                <tr>
                  <th scope="row">FDC3 Version</th>
                  {appInfo?.fdc3Version ? (
                    chosenVersion === appInfo.fdc3Version ||
                    (chosenVersion === '2.0' && appInfo.fdc3Version === '2.1') ? (
                      <td>{appInfo.fdc3Version}</td>
                    ) : (
                      <Box component="td" sx={classes.warningText}>
                        {appInfo.fdc3Version}
                        <Tooltip title={warningText} aria-label={warningText}>
                          <WarningIcon sx={classes.warning} />
                        </Tooltip>
                      </Box>
                    )
                  ) : (
                    <td>unknown</td>
                  )}
                </tr>
                <tr>
                  <th scope="row">Provider</th>
                  <td>{appInfo?.provider ? appInfo.provider : 'unknown'}</td>
                </tr>
                <tr>
                  <th scope="row">Provider version</th>
                  <td>{appInfo?.providerVersion ? appInfo.providerVersion : 'unknown'}</td>
                </tr>
                {chosenVersion != '1.2' ? (
                  <tr>
                    <th scope="row">My AppId</th>
                    <Box component="td" sx={classes.appid}>
                      {appInfo?.appMetadata?.appId ? appInfo.appMetadata.appId : 'unknown'}
                    </Box>
                  </tr>
                ) : (
                  ''
                )}
              </tbody>
            </table>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
