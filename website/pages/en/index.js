/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Showcase = require(`${process.cwd()}/core/Showcase.js`);

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl, repoUrl, defaultVersionShown} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const versionPart = `${defaultVersionShown ? `${defaultVersionShown}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${versionPart}${langPart}${doc}`;

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
        {/*siteConfig.title*/}
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
                {/*<Logo img_src={`${baseUrl}img/docusaurus.svg`} />*/}
            <div className="inner">
              <img src="img/fdc3-logo-2019.png"></img>
              
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
    const {docsUrl, baseUrl, defaultVersionShown} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const versionPart = `${defaultVersionShown ? `${defaultVersionShown}/` : ''}`;
    const docUrl = doc => `${docsPart}${versionPart}${langPart}${doc}`;


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

    const Features = () => (
      <Block background="white" layout="fourColumn">
        {[
          {
            content: `Create a consistent developer experience by adhering to the [API](${docUrl('api/api-intro')}) standard`,
            image: `${baseUrl}img/feature-api.svg`,
            imageAlign: 'top',
            title: 'API',
          },
          {
            content: `Use [standardized verbs](${docUrl('intents-intro')}) to instruct other apps to take an action`,
            image: `${baseUrl}img/feature-intents.svg`,
            imageAlign: 'top',
            title: 'Intents',
          },
          {
            content: `Share [context](${docUrl('context-intro')}) between apps to eliminate re-keying and streamline workflow`,
            image: `${baseUrl}img/feature-context.svg`,
            imageAlign: 'top',
            title: 'Context Data',
          },
          {
            content: `Discover trusted apps that can take part in a FDC3 workflow using an [App directory](${docUrl('appd-intro')}).`,
            image: `${baseUrl}img/feature-appd.svg`,
            imageAlign: 'top',
            title: 'App Directory',
            link: `${baseUrl}/appd-intro`
          }
          
        ]}
      </Block>
    );

    const FeatureCallout = () => (
      <div  className="featureShowcaseSection  paddingBottom" style={{textAlign: 'center'}}>
        <h2>Use Cases</h2>
        <MarkdownBlock>{`Document business [use cases](${docUrl('use-cases/overview')}) that drive FDC3 interoperability standards.`}</MarkdownBlock>
      </div>
    );

    const FinosBanner = () => (
      <div className="finos finosBanner">
        <a href="https://www.finos.org">
          <img id="finosicon" src={`${baseUrl}img/finos_wordmark.svg`} height='150px' alt="FINOS" title="FINOS"/>
        </a>
        <h2 id="proud">Proud member of the Fintech Open Source Foundation</h2>
      </div>
    );

    const UserShowcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const pinnedUsers = siteConfig.users.filter(user => user.pinned);

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="userShowcase productShowcaseSection paddingTop paddingBottom">
          <h2>Who is Using FDC3?</h2>
          <p>The Financial Desktop Connectivity and Collaboration Consortium (FDC3) was founded in 2017 by <a href="https://openfin.co">OpenFin</a> and contributed to <a href="https://finos.org">FINOS</a>.  The FDC3 standards are created and used by leading organizations across the financial industry.</p>
          <Showcase users={pinnedUsers} />
          {/* exclude button to users page for now, all users shown on main page */}
          {/* <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              All {siteConfig.title} Users
            </a>
          </div> */}
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          
          <UserShowcase />
          <FinosBanner />
        </div>
      </div>
    );
  }
}

module.exports = Index;
