/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'FDC3', // Title for your website.
  tagline: 'Open standards for the financial desktop',
  url: 'https://fdc3.finos.org',
  cname: 'fdc3.finos.org',
  baseUrl: '/',
  // For publishing to GitHub pages
  projectName: 'FDC3',
  organizationName: 'FDC3',
  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'fdc3-intro', label: 'Docs'},    
    {doc: 'use-cases/use-cases-intro', label: 'Use Cases'},
    {page: 'help', label: 'FDC3 Community'},
    {doc: 'why-fdc3', label: 'Why FDC3'}
   //, {blog: true, label: 'News'}
  ],

  twitterUsername: 'fdc3_',

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/finos-white.png',
  footerIcon: 'img/finos.png',
  favicon: 'img/favicon/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#00b5e2',
    secondaryColor: '#205C3B',
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
  copyright: `Copyright © ${new Date().getFullYear()} FDC3`,

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
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/FDC3/FDC3'
};

module.exports = siteConfig;
