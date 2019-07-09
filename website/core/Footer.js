/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language = '') {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const defaultVersionShown = this.props.config.defaultVersionShown;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const versionPart = `${defaultVersionShown ? `${defaultVersionShown}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${versionPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">     
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('fdc3-intro')}>
              Getting Started
            </a>
            <a href={this.docUrl('why-fdc3')}>
              Why FDC3
            </a>
            <a href={this.docUrl('api/DesktopAgent')}>
              API Reference
            </a>
            <a href={this.pageUrl('appd-spec')}>
              App Directory OpenAPI
            </a>
            <a href={this.docUrl('use-cases/overview.html')}>
              Use Cases
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://www.finos.org/"
              target="_blank"
              rel="noreferrer noopener">
              FINOS
            </a>
            <a
              href="https://finosfoundation.atlassian.net/wiki/spaces/FDC3"
              target="_blank"
              rel="noreferrer noopener">
              FDC3 Wiki
            </a>
            <a
              href="https://groups.google.com/a/finos.org/forum/#!forum/fdc3"
              target="_blank"
              rel="noreferrer noopener">
              Google Groups
            </a>            
            {/* <a href={this.pageUrl('users.html', this.props.language)}>
              User Showcase
            </a>
            <a
              href="http://stackoverflow.com/questions/tagged/"
              target="_blank"
              rel="noreferrer noopener">
              Stack Overflow
            </a>
            <a href="https://discordapp.com/">Project Chat</a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a> */}
          </div>
          <div>
            <h5>More</h5>
            <div className="social">
              <a
                className="github-button" // part of the https://buttons.github.io/buttons.js script in siteConfig.js
                href={this.props.config.repoUrl}
                data-count-href={`${this.props.config.repoUrl}/stargazers`}
                data-show-count="true"
                data-count-aria-label="# stargazers on GitHub"
                aria-label="Star this project on GitHub">
                {this.props.config.projectName}
              </a>
            </div>
            {this.props.config.twitterUsername && (
              <div className="social">
                <a
                  href={`https://twitter.com/${this.props.config.twitterUsername}`}
                  className="twitter-follow-button">
                  Follow @{this.props.config.twitterUsername}
                </a>
              </div>
            )}
          </div>
        </section>
        <section className="finos finosBanner">
          <a href="https://www.finos.org">
            <img id="finosicon" src={`https://fdc3.finos.org/img/finos_wordmark.svg`} height='75px' alt="FINOS" title="FINOS"/>
            <h2 id="proud">Proud member of the Fintech Open Source Foundation</h2>
          </a>

        </section>
        
        <section className="copyright">{this.props.config.copyright}</section>

      </footer>
    );
  }
}



module.exports = Footer;
