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
      title: `Collaborate with the Community`,
      content: 
        `Most FDC3 collaboration takes place in the [FDC3 GitHub repository](https://github.com/finos/FDC3), 
        where you can raise [issues](https://github.com/finos/FDC3/issues), 
        submit [pull requests](https://github.com/finos/FDC3/pulls) 
        and view [meeting minutes](https://github.com/finos/FDC3/issues?q=label%3Ameeting+).`,
    },
    {
      title: `Learn more about the Standard`,
      content: 
      `[Join the General List](mailto:fdc3+subscribe@finos.org) (and check out the 
      [archives](https://groups.google.com/a/finos.org/forum/#!forum/fdc3)) to stay up to date with the project. 
      You can also attend the quarterly 
      [FDC3 General Meeting](https://github.com/finos/FDC3/issues?q=label%3A%22General+Meeting%22): 
      you can find meeting details in the 
      [FINOS Project Calendar](https://calendar.google.com/calendar/u/0/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com).
      \n Take the free FDC3 <a href="https://www.edx.org/course/fdc3-interoperability-for-the-financial-desktop" target="_blank">Training</a>.`,
    },
    {
      title: `Participate in the Standard's ideation` ,
      content: 
      `The [Standard Working Group](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) 
      meets once a month to shape the next version of the Standard: you can find meeting details in the 
      [FINOS Project Calendar](https://calendar.google.com/calendar/u/0/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com). 
      If you'd like to formally enroll as a voting Standard participant, 
      please follow [these instructions](https://github.com/finos/fdc3#participate-in-the-standard-process).`,
    },
    {
      title: `Are you using FDC3?`,
      content: 
      `If you are an existing user of the FDC3 Standard, we would love to hear from you: 
      just email the [FDC3 General List](fdc3@finos.org) with details about how you are using it. 
      If you'd like to be listed as a user on our [homepage](https://fdc3.finos.org), 
      you can directly [send a pull request](https://github.com/finos/FDC3/edit/master/website/data/users.json) or, 
      [contact us](fdc3-private@finos.org) if you need help with legal evaluation of your logo.`,
    },
  
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Get Involved in FDC3</h1>
          </header>
          <p>The FDC3 Standard is the result of the work of a dedicated group of contributors from both <a href="http://www.finos.org/members" target="_blank">FINOS members</a> and non-member contributing organizations alike. Ready to get involved in our community? Here are some ways to get started:
          </p>
          <GridBlock contents={supportLinks} layout="fourColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
