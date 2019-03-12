/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl, repoUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        {/* <Logo img_src={`${baseUrl}img/docusaurus.svg`} /> */}
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('fdc3-intro')}>Get Started</Button>
            <Button href={repoUrl}>GitHub</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Use Cases</h2>
        <MarkdownBlock>Identify requirements for workflows across the financial desktop.</MarkdownBlock>
      </div>
    );

    const FinosBanner = () => (
      // <Block class="finos" background="light">
      //   {[
      //     {
      //       image: `${baseUrl}img/finos_wordmark.svg`,
      //       imageAlign: 'right',
      //       title: 'Proud Member of the Fintech Open Source Foundation',
      //     },
      //   ]}
      // </Block>
      <div id="member" class="container" background='light' align="center" >
        <h2> Proud member of the <strong>Fintech Open Source Foundation</strong></h2>
        <div>
            <a href="https://www.finos.org">
              <img src={`${baseUrl}img/finos_wordmark.svg`} height='150px' alt="FINOS" title="FINOS"/>
            </a>
        </div>
      </div>
    );

    const Features = () => (
      <Block background="light" layout="fourColumn">
        {[
          {
            content: 'Create a consistent developer experience by adhering to the [API](docs/api/api-intro) standard',
            image: `${baseUrl}img/feature-api.svg`,
            imageAlign: 'top',
            title: 'API',
          },
          {
            content: 'Use [standardized verbs](docs/intents-intro) to instruct other apps to take an action',
            image: `${baseUrl}img/feature-intents.svg`,
            imageAlign: 'top',
            title: 'Intents',
          },
          {
            content: 'Share [context](docs/context-intro) between apps to eliminate re-keying and streamline workflow',
            image: `${baseUrl}img/feature-context.svg`,
            imageAlign: 'top',
            title: 'Context Data',
          },
          {
            content: 'Discover trusted apps that can take part in a FDC3 workflow using an [App directory](docs/appd-intro).',
            image: `${baseUrl}img/feature-appd.svg`,
            imageAlign: 'top',
            title: 'App Directory',
            link: `${baseUrl}/appd-intro`
          }
          
        ]}
      </Block>
    );

    const UserShowcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using FDC3?</h2>
          <p>FDC3 is used by several industry-leading organisations...</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              All {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <FinosBanner />
          <UserShowcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
