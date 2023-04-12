
const React = require('react');
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default (props) => {

    const context = useDocusaurusContext();
    const siteConfig = context.siteConfig;
    const repoUrl = siteConfig.customFields.repoUrl;
  
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
          <div className="inner">
                <img src="/img/fdc3-logo-2019.png" alt="FDC3"></img>
                <ProjectTitle siteConfig={siteConfig} />
                <PromoSection>
                  <Button href="/docs/fdc3-intro">Get Started</Button>
                  <Button href={repoUrl}>GitHub</Button>
                </PromoSection>
              </div>
      </SplashContainer>
    );
  }
  