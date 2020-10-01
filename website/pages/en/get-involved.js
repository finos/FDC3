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
      content: `Most FDC3 collaboration takes place in the [FDC3 GitHub repository](https://github.com/finos/fdc3]), where you can raise [issues](https://github.com/finos/FDC3/issues), submit [pull requests](https://github.com/finos/FDC3/pulls) and view [meeting minutes](https://github.com/finos/FDC3/issues?q=label%3Ameeting+).`,
      title: `Collaborate with the Community`,
    },
    {
      title: `Learn more about the standard`,
      content: `[Join the FDC3 list](mailto:fdc3+subscribe@finos.org) and check out the [archives](https://groups.google.com/a/finos.org/forum/#!forum/fdc3) to stay up to date with project. You can also join the quarterly [FDC3 general meeting](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22): you can find meeting details in the [FINOS Project calendar](https://calendar.google.com/calendar/u/0/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com)`,
    },
    {
      title: `Participate in the standard ideation` ,
      content: `The [Standards working group](https://github.com/finos/FDC3/issues?q=label%3A%22Standard+WG+Meeting%22) meets once a month to shape the next version of the FDC3 standard: you can find meeting details in the [FINOS Project calendar](https://calendar.google.com/calendar/u/0/embed?src=finos.org_fac8mo1rfc6ehscg0d80fi8jig@group.calendar.google.com). If you'd like to formally enroll as a voting Standard participant, see please follow [these instructions](https://github.com/finos/fdc3#participate-in-the-standard-process).`,
    },
    {
      title: `Are you using FDC3?`,
      content: `If you an existing individual or corporate user of the FDC3 standard, we would love to hear from you: just email the [FDC3 General List](fdc3@finos.org) with details about how you are using the standard. If you'd like to be listed as a standard user in our [homepage](fdc3.finos.org), you can directly [send a pull request to update our website](https://github.com/finos/fdc3/website/data/users.json) or, if listing your logo publicly requires legal evaluation, you can reach out privately to the [FDC3 Product Management Committee](fdc3-private@finos.org).`,
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
