module.exports={
  "title": "FDC3",
  "tagline": "Open standards for the financial desktop",
  "url": "https://fdc3.finos.org",
  "baseUrl": "/",
  "organizationName": "finos",
  "projectName": "FDC3",
  "scripts": [
    "https://buttons.github.io/buttons.js"
  ],
  "favicon": "img/favicon/favicon.ico",
  "customFields": {
    "separateCss": [
      "static/toolbox/fdc3-workbench/static/css",
      "static/toolbox/fdc3-explained/1.0",
      "static/toolbox/fdc3-explained/1.1",
      "static/toolbox/fdc3-explained/1.2"
    ],
    "wrapPagesHTML": true,
    "repoUrl": "https://github.com/finos/FDC3"
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "path": "../docs",
          "sidebarPath": "./sidebars.json",
        },
        "blog": {
          "path": "blog"
        },
        "theme": {
          "customCss": "./src/css/customTheme.css"
        },
        "googleAnalytics": {
          "trackingID": "UA-89349362-8"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "FDC3",
      "logo": {
        "src": "img/fdc3-icon-2019.svg"
      },
      "items": [
        {
          "to": "docs/fdc3-intro",
          "label": "Getting Started",
          "position": "left"
        },
        {
          "to": "/fdc3-roadmap",
          "label": "Roadmap",
          "position": "left"
        },
        {
          "to": "docs/use-cases/overview",
          "label": "Use Cases",
          "position": "left"
        },
        {
          "to": "/community",
          "label": "Community",
          "position": "left"
        },
        {
          "to": "docs/fdc3-standard",
          "label": "The Standard",
          "position": "left"
        },
        {
          "to": "/get-involved",
          "label": "Get Involved",
          "position": "left"
        },
        {
          "href": "https://directory.fdc3.finos.org",
          "label": "FINOS App Directory",
          "position": "left"
        },
        {
          "href": "https://www.edx.org/course/fdc3-interoperability-for-the-financial-desktop",
          "label": "Training",
          "position": "left"
        },
        {
          "label": "Version",
          "to": "docs",
          "position": "right",
          "items": [
            {
              "label": "2.0",
              "to": "docs/",
              "activeBaseRegex": "docs/(?!1.0|1.1|1.2|2.0|next)"
            },
            {
              "label": "1.2",
              "to": "docs/1.2/"
            },
            {
              "label": "1.1",
              "to": "docs/1.1/"
            },
            {
              "label": "1.0",
              "to": "docs/1.0/"
            },
            {
              "label": "Main/Unreleased",
              "to": "docs/next/",
              "activeBaseRegex": "docs/next/(?!support|team|resources)"
            }
          ]
        }
      ]
    },
    "image": "/assets/fdc3-logo.png",
    "footer": {
      "links": [
        {
          "title": "Learn",
          "items": [
            {
              "label": "Getting Started",
              "to": "/docs/fdc3-intro"
            },
            {
              "label": "Supported Platforms",
              "to": "docs/supported-platforms"
            },
            {
              "label": "API Reference",
              "to": "/docs/api/ref/DesktopAgent"
            },
            {
              "label": "Use Cases",
              "to": "/docs/use-cases/overview"
            },
            {
              "label": "Training",
              "to": "https://www.edx.org/course/fdc3-interoperability-for-the-financial-desktop"
            }
          ]
        },
        {
          "title": "Community",
          "items": [
            {
              "label": "FINOS",
              "to": "https://www.finos.org/"
            },
            {
              "label": "Slack",
              "to": "https://finos-lf.slack.com/messages/fdc3/"
            },
            {
              "label": "Stack Overflow",
              "to": "https://stackoverflow.com/questions/tagged/fdc3"
            },
            {
              "label": "Google Groups",
              "to": "https://groups.google.com/a/finos.org/forum/#!forum/fdc3"
            },
            {
              "label": "Trademarks",
              "to": "/docs/next/trademarks"
            }
          ]
        },
        {
          "title": "More",
          "items": [
            {
              "html": "<a href=\"https://github.com/finos/FDC3\"><img src=\"https://img.shields.io/github/stars/finos/FDC3?label=FDC3&style=social\" /></a>"
            },
            {
              "html": "<a href=\"https://twitter.com/FDC3_\"><img src=\"https://img.shields.io/twitter/follow/FDC3_?style=social\" ></a>"
            }
          ]
        }
      ],
      "copyright": "<span class=\"footer-strap\">Proud member of the Fintech Open Source Foundation</span><br/><br/><span class=\"footer-copyright\">Copyright © 2023 FDC3 - FINOS</span>",
      "logo": {
        "src": "img/finos_wordmark.svg",
        "alt": "FINOS Logo",
        "width": 50
      }
    }
  }
}