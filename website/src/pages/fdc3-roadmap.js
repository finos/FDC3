import Layout from "@theme/Layout";
import Container from "../components/Container"
const React = require('react');


const style = `
table.roadmap img {
  max-width: none;
}

table.roadmap td {
  text-align: center;
}

table.roadmap th {
  text-align: left;
}

div.centered {
  margin: auto;
  padding: 30px;
}
`

export default (props) => {
  return (
    <Layout title="FDC3 Roadmap">
      <Container>
        <style>
          {style}
        </style>

        <div className="centered">

          <h1>FDC3 2.1 Roadmap</h1>
          <p>This roadmap aims to track the standardization streams and
            activities of the FDC3 2.1 effort.</p>

          <table className="roadmap">
            <thead>
              <tr>
                <th colSpan="2"></th>
                <th>Intents and Context Data</th>
                <th>Desktop Agent Bridging</th>
                <th>Identity</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <th colSpan="5"><h3>Initiation</h3></th>
              </tr>
              <tr>
                <th colSpan="2" scope="row">Issue Raised</th>
                <td>✅</td>
                <td>✅</td>
                <td><a href="https://github.com/finos/FDC3/issues/684">Issue
                  Raised</a></td>
              </tr>
              <tr>
                <th colSpan="2" scope="row">Discussed at Standards Working Group</th>
                <td>✅</td>
                <td>✅</td>
                <td></td>
              </tr>
              <tr>
                <th colSpan="2" scope="row">Discussion Group Formed</th>
                <td>✅</td>
                <td>✅</td>
                <td></td>
              </tr>
              <tr>
                <th colSpan="2">Maintainers Responsible</th>
                <td>Vinay Mistry</td>
                <td>Kris West</td>
                <td>tbd (Symphony?)</td>
              </tr>
              <tr>
                <th colSpan="5"><h3>Development</h3></th>
              </tr>
              <tr>
                <th colSpan="2"><a href="https://github.com/finos/FDC3/issues"><img
                  src="https://img.shields.io/github/issues/finos/fdc3"
                  alt="GitHub issues" /></a></th>
                <td><a
                  href="https://github.com/finos/FDC3/issues?q=is%3Aopen+is%3Aissue+label%3Acontext-data"><img
                    src="https://img.shields.io/github/issues/finos/FDC3/context-data.svg"
                    alt="Context Data" /></a></td>
                <td><a
                  href="https://github.com/finos/FDC3/issues?q=is%3Aopen+is%3Aissue+label%3A%22Desktop+Agent+Bridging%22"><img
                    src="https://img.shields.io/github/issues/finos/FDC3/Desktop%20Agent%20Bridging.svg"
                    alt="Desktop Agent Bridging" /></a></td>
                <td></td>
              </tr>

              <tr>
                <th colSpan="2"><a href="https://github.com/finos/FDC3/issues?closed=1"><img
                  src="https://img.shields.io/github/issues-closed/finos/fdc3"
                  alt="GitHub closed issues" /></a><br /></th>
                <td><a
                  href="https://github.com/finos/FDC3/issues?q=is%3Aclosed+is%3Aissue+label%3Acontext-data"><img
                    src="https://img.shields.io/github/issues-closed/finos/FDC3/context-data.svg"
                    alt="Context Data" /></a></td>
                <td><a
                  href="https://github.com/finos/FDC3/issues?q=is%3Aclosed+is%3Aissue+label%3A%22Desktop+Agent+Bridging%22"><img
                    src="https://img.shields.io/github/issues-closed/finos/FDC3/Desktop%20Agent%20Bridging.svg"
                    alt="Desktop Agent Bridging" /></a></td>
                <td></td>
              </tr>

              <tr>
                <th rowSpan="2">2.1 Candidates</th>
                <th>Open</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <th>Closed</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <th rowSpan="2">2.1 Accepted</th>
                <th>Open</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>


              <tr>
                <th>Closed</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <th colSpan="2">Issues Complete</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th colSpan="2">PRs Accepted By Working Group</th>
                <td colSpan="3">tbd</td>
              </tr>
              <tr>
                <th colSpan="2">PRs Merged into Pre-Draft</th>
                <td colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </Layout>
  )
}
