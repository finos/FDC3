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
    //{
    //  content: `Learn more using the [documentation on this site.]($///// {docUrl(
    //    'doc1.html',
    //  )})`,
    //  title: 'Browse the FDC3 Wiki',
    //}
    {
      content: `The [FDC3 Wiki](https://finosfoundation.atlassian.net/wiki/spaces/FDC3/overview) has a ton of information about the day-to-day, week-to-week operations of the team building out the FDC3 standard, including meeting schedules, minutes, roadmaps, and release plans.`,
      title: `Browse the FDC3 Wiki`,
    },
    {
      content: 'Email [fdc3+subscribe@finos.org](mailto:fdc3+subscribe@finos.org) to join the program\'s general mailing list to stay up to date with program activities and focus areas. Additional mailing lists for the program\'s working groups can be found on the [FDC3 Wiki](https://finosfoundation.atlassian.net/wiki/spaces/FDC3/overview).',
      title: 'Subcribe to the FDC3 General Mailing List',
    },
    {
      content: `Attending an FDC3 general meeting is a great way to learn about what's going on with the program. Our next meeting is March 5th. [See the meeting call-in information and the full schedule on the FDC3 Wiki.](https://finosfoundation.atlassian.net/wiki/spaces/FDC3/pages/24150019/FDC3+General+Meeting)`,
      title: 'Attend the Next General Meeting',
    },
    {
      content: `E-mail [fdc3@finos.org](mailto:fdc3@finos.org)  to introduce yourself and ask any questions you might have of the program's active participants and contributors.`,
      title: 'Send an Email to the FDC3 Community' ,
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
