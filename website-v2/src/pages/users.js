/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

import users from './../../data/users.json';
import Layout from "@theme/Layout";
import Container from "../components/Container"
import Showcase from "../../core/Showcase"
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default (props) => {
  const context = useDocusaurusContext();
  const siteConfig = context.siteConfig;

  const editUrl = `${siteConfig.repoUrl}/edit/master/website/data/users.json`;

  const membersToShowcase = users.filter(
    user => user.isMember,
  );

  membersToShowcase.sort((a, b) => a.caption.localeCompare(b.caption))

  const othersToShowcase = users.filter(user => !user.isMember);

  return (
    <Layout>
      <Container>
        <div className="showcaseSection">
          <div className="prose">
            <h1>Who is Using FDC3?</h1>
            <p>FDC3 has several industry-leading <a href="https://www.finos.org/become-a-member">member participants.</a></p>
          </div>
          <Showcase users={membersToShowcase} />
          {/* <div className="logos">{showcase}</div> */}
          {othersToShowcase.length > 0 ?
            <div>
              <div className="prose paddingTop">
                <p>FDC3 is also used by financial organizations of all sizes.</p>
              </div>
              <Showcase users={othersToShowcase} />
            </div> : null}
          <p>Are you using FDC3?</p>
          <a href={editUrl} className="button">
            Add your company
          </a>
        </div>
      </Container>
    </Layout>
  );
}
