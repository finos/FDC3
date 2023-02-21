/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

import Layout from "@theme/Layout";
import Container from "../components/Container"
import One from '../../data/get-involved/1.mdx'
import Two from '../../data/get-involved/2.mdx'
import Three from '../../data/get-involved/3.mdx'
import Four from '../../data/get-involved/4.mdx'

const GridBlock = ({items}) => {

  return (
    <div class="gridBlock">
      {
        items.map(sl =>
          <div class="blockElement fourByGridBlock">
            <div class="blockContent">
              {sl}
            </div>
          </div>
        )
      }
    </div>
  )
}

export default () => {

  return (
    <Layout>
      <Container>
        <header className="postHeader">
          <h1>Get Involved in FDC3</h1>
        </header>
        <GridBlock items={[<One/>,<Two/>,<Three/>,<Four/>]}/>
      </Container>
    </Layout>)
};
