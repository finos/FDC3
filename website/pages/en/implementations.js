/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

const ImplementationsShowcase = require(`${process.cwd()}/core/ImplementationsShowcase.js`);

class Implementations extends React.Component {
	render() {
		const { config: siteConfig } = this.props;
		const { repoUrl } = siteConfig;
		const editUrl = `${repoUrl}/edit/master/website/data/implementations.json`;

		return (
			<div className="mainContainer">
				<Container>
					<h1>FDC3 Implementations</h1>
					<div className="prose">
						<p>
							The Financial Desktop Connectivity and Collaboration Consortium (FDC3) standard is maintained and used by leading organizations across the financial industry through a variety of different implementations.
						</p>
						<p>
							For more detail on who's implementing the Desktop Agent (a "Platform Provider"), using FDC3 to enable interop with their apps (an "Application Provider") or details on where to find tools, examples apps and training materials see below.
						</p>
						<p>
							<i>
								Are you using FDC3?
								<a href={editUrl} className="button">
									Add your Implementation
								</a>
							</i>
						</p>
					</div>
					<ImplementationsShowcase />
				</Container>
			</div>
		);
	}
}

module.exports = Implementations;
