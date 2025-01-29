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
          "path": "./docs",
          "sidebarPath": "./sidebars.json",
        },
        "theme": {
          "customCss": "./src/css/customTheme.css"
        },
        "gtag": {
          "trackingID": "G-EY9BQJ55YQ",
          "anonymizeIP": true,
        }
      }
    ]
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  "plugins": [],
  "themeConfig": {
    "prism": {
      "additionalLanguages": ["typescript","javascript","json","csharp"],
      "theme": require('prism-react-renderer').themes.vsDark
    },
    "algolia": {
      "appId": "YW91L9TW76",
      "apiKey": "ab431bb4107069ef51780d8947cd8e0a",
      "indexName": "fdc3-finos",
      "contextualSearch": true,
			"searchParameters": {}
    },
    "navbar": {
      "title": "FDC3",
      "logo": {
		    "src": "img/fdc3-icon-light-2019.svg",
        "srcDark": "img/fdc3-icon-2019.svg"
      },
      "items": [
        {
          "to": "docs/fdc3-intro",
          "label": "Getting Started",
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
          "label": "FINOS AppD",
          "position": "left"
        },
        {
          "href": "/training",
          "label": "Training",
          "position": "left"
        },
        {
          "label": "Version",
          "to": "/versions",
          "position": "right",
          "items": [
            {
              "label": "2.1",
              "to": "/docs/fdc3-intro",
              "activeBaseRegex": "docs/(?!1.0|1.1|1.2|2.0|next)"
            },
            {
              "label": "2.0",
              "to": "/docs/2.0/fdc3-intro",
            },
            {
              "label": "1.2",
              "to": "/docs/1.2/fdc3-intro"
            },
            {
              "label": "1.1",
              "to": "/docs/1.1/fdc3-intro"
            },
            {
              "label": "1.0",
              "to": "/docs/1.0/fdc3-intro"
            },
            {
              "label": "Main/Unreleased",
              "to": "/docs/next/fdc3-intro",
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
              "to": "/docs/next/api/supported-platforms"
            },
            {
              "label": "API Reference",
              "to": "/docs/api/ref/DesktopAgent"
            },
            {
              "label": "Use Cases",
              "to": "/docs/next/use-cases/overview"
            },
            {
              "label": "Training",
              "to": "https://fdc3.finos.org/training"
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
              "html": "<a href=\"https://github.com/finos/FDC3\"><img alt=\"Github\" src=\"https://img.shields.io/github/stars/finos/FDC3?label=FDC3&style=social\" /></a>"
            },
            {
              "label": "Users",
              "to": "/users"
            },
            {
              "label": "Versions",
              "to": "/versions"
            }
          ]
        }
      ],
      "copyright": "<span class=\"footer-strap\">Proud member of the Fintech Open Source Foundation</span><br/><br/><span class=\"footer-copyright\">Copyright © 2023 FDC3 - FINOS</span>",
      "logo": {
        "src": "img/finos_wordmark.svg",
        "alt": "FINOS Logo",
        "width": 50,
        "href": "https://finos.org"
      }
    },
    "mermaid": {
      "options": {
        "htmlLabels": true,
        "markdownAutoWrap": true,
        "wrap": true,
          "wrappingWidth": 50,
        "flowchart": {
          "titleTopMargin": 30,
          "subGraphTitleMargin":  {
            "top": 30,
            "bottom": 30
          },
          "nodeSpacing": 30,
          "rankSpacing": 50,
          "diagramPadding": 5,
          "useMaxWidth": true,
          "htmlLabels": true,
          "wrappingWidth": 50
        }
      }
    }
  }
}
