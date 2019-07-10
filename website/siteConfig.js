/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.

const users = require('./data/users.json');

const siteConfig = {
  title: 'FDC3', // Title for your website. THIS CHANGES THE TITLE TAGS FOR THE WEBSITE (LOOK IN BROWSER TAB AT TOP)
  tagline: 'Open standards for the financial desktop', //THIS CHANGES THE TITLE TAGS FOR THE WEBSITE (LOOK IN BROWSER TAB AT TOP)
  url: 'https://fdc3.finos.org',
  cname: 'fdc3.finos.org',
  baseUrl: '/',
  // For publishing to GitHub pages
  projectName: 'FDC3',
  organizationName: 'FDC3',
  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'fdc3-intro', label: 'Docs'},    
    {doc: 'use-cases/overview', label: 'Use Cases'},
    {page: 'get-involved', label: 'Get Involved'},
    {doc: 'why-fdc3', label: 'Why FDC3'}
   //, {blog: true, label: 'News'}
  ],

  defaultVersionShown: '1.0',

  twitterUsername: 'FDC3_',

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/fdc3-icon-2019.svg',   /* change to program/project icon logo */
  footerIcon: 'img/fdc3-icon-2019.svg',  /* change to program/project icon + wordmark logo */
  favicon: 'img/favicon/favicon.ico',  /* change to program/project favicon logo .ico */

  /* Colors for website */
  colors: {
    primaryColor: '#0086bf', /* This changes the top FINOS banner & all links - DO NOT CHANGE */
    secondaryColor: '#0033A0' /* This does net change anything - but keep as the project / program main color */
  
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} FDC3`,  /* CHANGE THIS TO PROJECT / PROGRAM NAME */

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  wrapPagesHTML: true,
  docsSideNavCollapsible: true,

  // Open Graph and Twitter card images.
  ogImage: 'assets/fdc3-logo.png', /* change to program/project icon + wordmark logo */
  twitterImage: 'assets/fdc3-logo.png', /* change to program/project icon + wordmark logo */

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/FDC3/FDC3'
};

module.exports = siteConfig;
