/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `Most FDC3 collaboration take place on the [FDC3 GitHub repository](https://github.com/finos/fdc3]), where you can raise [issues](https://github.com/finos/FDC3/issues), submit [pull requests](https://github.com/finos/FDC3/pulls) and view [meeting minutes](https://github.com/finos/FDC3/issues?q=label%3Ameeting+).`,
      title: `Collaborate on GitHub`,
    },
    {
      title: 'Subcribe to the Mailing List',
      content: `Email [fdc3+subscribe@finos.org](mailto:fdc3+subscribe@finos.org) to join the project's mailing list, and stay up to date with project activities and focus areas. The mailing list archive can be found [here](https://groups.google.com/a/finos.org/g/fdc3).`,
    },
    {
      title: 'Attend a General Meeting',
      content: `The FDC3 general meeting takes place once a quarter, and is a great way to learn about what's going on with the project. Joining the mailing list should get you an invite, or email [help@finos.org](mailto:help@finos.org).`,
    },
    {
      title: 'Join the Standards Working Group' ,
      content: `The standards working group meets once a month for an hour, and it is where we shape the next version of the FDC3 standards. Joining the mailing list should get you an invite, or email [help@finos.org](mailto:help@finos.org).`,
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Get Involved in FDC3</h1>
          </header>
          <p>The FDC3 standards are the result of the work of a dedicated group of contributors from both <a href="http://www.finos.org/members" target="_blank">FINOS members</a> and non-member contributing organizations alike. Ready to get involved in our community? Here are some ways to get started:
          </p>
          <GridBlock contents={supportLinks} layout="fourColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
