const React = require('react');

import versions from '../../versions.json'
import Layout from "@theme/Layout";
import Container from "../components/Container"
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';


export default (props) => {
  const context = useDocusaurusContext();
  const siteConfig = context.siteConfig;
  const latestVersion = versions[0];
  const repoUrl = siteConfig.customFields.repoUrl

  return (
    <Layout title="Versions">
      <Container>
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
                  <a href="/docs/fdc3-intro">Documentation</a>
                </td>
                <td>
                  <a href={`${repoUrl}/releases/tag/v${latestVersion}`}>Release Notes</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="rc">Latest version (Unreleased)</h3>
          <table className="versions">
            <tbody>
              <tr key="latest">
                <th>master</th>
                <td>
                  <a href={"/docs/next/fdc3-intro"}>Documentation</a>
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
              {versions
                .filter(version => version !== latestVersion)
                .map(version => (
                    <tr key="{version}">
                      <th>{version}</th>
                      <td>
                        <a href={"/docs/"+version+"/fdc3-intro"}>Documentation</a>
                      </td>
                      <td>
                        <a href={`${repoUrl}/releases/tag/v${version}`}>Release Notes</a>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
          <p>
            You can find past versions of this project on{' '}
            <a href={repoUrl}>GitHub</a>.
          </p>
        </div>
    </Container>
    </Layout>
  );
}
