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
    "users": [
      {
        "caption": "Adaptive Financial Consulting",
        "image": "/img/users/adaptive.png",
        "infoLink": "https://weareadaptive.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "ChartIQ",
        "image": "/img/users/ChartIQ.png",
        "infoLink": "https://cosaic.io/chartiq/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Citi",
        "image": "/img/users/citi.png",
        "infoLink": "https://www.citigroup.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Finsemble",
        "image": "/img/users/Finsemble.png",
        "infoLink": "https://www.finsemble.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "FactSet",
        "image": "/img/users/FactSet.png",
        "infoLink": "https://www.factset.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Genesis Global",
        "image": "/img/users/Genesis.png",
        "infoLink": "https://genesis.global/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Glue42",
        "image": "/img/users/GLUE42.png",
        "infoLink": "https://glue42.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "GreenKey",
        "image": "/img/users/GreenKey.png",
        "infoLink": "https://greenkeytech.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "S&P Global",
        "image": "/img/users/spglobal.png",
        "infoLink": "https://spglobal.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "JP Morgan",
        "image": "/img/users/JPMorgan.png",
        "infoLink": "https://www.jpmorgan.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "OpenFin",
        "image": "/img/users/Openfin.png",
        "infoLink": "https://openfin.co/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "RBC Capital Markets",
        "image": "/img/users/RBCCMlogo.png",
        "infoLink": "https://www.rbccm.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Refinitv",
        "image": "/img/users/Refinitiv.png",
        "infoLink": "https://www.refinitiv.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Scott Logic",
        "image": "/img/users/scottlogic.png",
        "infoLink": "https://www.scottlogic.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Singletrack",
        "image": "/img/users/singletrack.png",
        "infoLink": "https://www.singletrack.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Norman & Sons",
        "image": "/img/users/norman-and-sons.png",
        "infoLink": "https://www.normanandsons.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "iPushPull",
        "image": "/img/users/ipp-logo.png",
        "infoLink": "https://www.ipushpull.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Symphony",
        "image": "/img/users/Symphony.png",
        "infoLink": "https://www.symphony.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Pictet",
        "image": "/img/users/pictet.png",
        "infoLink": "https://www.pictet.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "UBS",
        "image": "/img/users/ubs.png",
        "infoLink": "https://www.ubs.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Connectifi",
        "image": "/img/users/connectifi.png",
        "infoLink": "https://www.connectifi.co/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "FlexTrade",
        "image": "/img/users/flextrade.jpg",
        "infoLink": "https://www.flextrade.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "NexJ",
        "image": "/img/users/nexj-systems-logo.png",
        "infoLink": "https://www.nexj.com/",
        "pinned": true,
        "isMember": true
      },
      {
        "caption": "Adaptable Tools",
        "image": "/img/users/adaptabletools.svg",
        "infoLink": "https://www.adaptabletools.com/",
        "pinned": true,
        "isMember": true
      }
    ],
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
    "image": "assets/fdc3-logo.png",
    "footer": {
      "links": [
        {
          "title": "Community",
          "items": [
            {
              "label": "Twitter",
              "to": "https://twitter.com/FDC3_"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2023 FDC3",
      "logo": {
        "src": "img/fdc3-icon-2019.svg"
      }
    }
  }
}