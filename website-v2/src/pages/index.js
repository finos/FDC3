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
  </Layout>)
}

// <FeatureCallout />
// <UserShowcase />
// <ConformanceCallout />