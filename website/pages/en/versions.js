/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
  const {config: siteConfig} = props;
  const latestVersion = versions[0];
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${
    siteConfig.projectName
  }`;
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <h3 id="latest">Current version (Stable)</h3>
          <table className="versions">
            <tbody>
              <tr key="headers">
                <th>{latestVersion}</th>
                <td>
                  <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/fdc3-intro`}>Documentation</a>
                </td>
                <td>
                  <a href={`${repoUrl}/releases/tag/v${latestVersion}`}>Release Notes</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="rc">Latest version</h3>
          <table className="versions">
            <tbody>
              <tr key="latest">
                <th>master</th>
                <td>
                  <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/next/fdc3-intro`}>Documentation</a>
                </td>
                <td>
                  <a href={repoUrl}>Source Code</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Here you can find the latest documentation and unreleased code.</p>
          <h3 id="archive">Past Versions</h3>
          <table className="versions">
            <tbody>
              {versions.map(
                version =>
                  version !== latestVersion && (
                    <tr key="{version}">
                      <th>{version}</th>
                      <td>
                        <a href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${version}/fdc3-intro`}>Documentation</a>
                      </td>
                      <td>
                        <a href={`${repoUrl}/releases/tag/v${version}`}>Release Notes</a>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on{' '}
            <a href={repoUrl}>GitHub</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Versions;
