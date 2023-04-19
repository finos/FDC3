/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
import Layout from "@theme/Layout";
import HomeSplash from '../components/HomeSplash';
import Api from '../../data/features/api.mdx'
import Intents from '../../data/features/intents.mdx'
import Directory from '../../data/features/app-directory.mdx'
import ContextData from '../../data/features/context-data.mdx'
import GridBlock from "../components/GridBlock";
import Container from '../components/Container';
import UseCases from '../../data/front/use-cases.mdx'
import Conformance from '../../data/front/conformance.mdx'
import Feature from '../components/Feature'
import Showcase from "../../core/Showcase";

import users from './../../data/users.json';


const UserShowcase = () => {

  const pinnedUsers = users.filter(user => user.pinned);
  pinnedUsers.sort((a, b) => a.caption.localeCompare(b.caption))

  return (
    <div className="userShowcase productShowcaseSection padding-top--lg padding-bottom--lg" style={{textAlign: 'center'}}>
      <h2>Who is Using FDC3?</h2>
      <p style={{margin: 'auto'}}>The Financial Desktop Connectivity and Collaboration Consortium (FDC3) standards are created and used by <a href="/users">leading organizations across the financial industry</a>. For more detail on who's using FDC3, developer tools, training and examples see the <a href="/community">community page</a>.</p>
      <Showcase users={pinnedUsers} />
    </div>
  );
};



export default () => {
  return (<Layout>
    <HomeSplash />
    <Container>
      <GridBlock items={[
        <Api />,
        <Intents />,
        <ContextData />,
        <Directory />
      ]} />
    </Container>
      <Feature>
        <UseCases />
      </Feature>
      <UserShowcase />
      <Feature>
        <Conformance />
      </Feature>
  </Layout>)
}
