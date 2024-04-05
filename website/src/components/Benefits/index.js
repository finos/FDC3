import React from 'react';
import styles from './styles.module.css'
import Carousel1 from '../Carousel1';
import HomeSection from "../HomeSection";
import Callout from "../Callout";

export default function Benefits() {
	return (
		<HomeSection>
			<div>
				<Carousel1>
					<aside>
						<h1 className={styles.title}>📇 Manage The Information Overload </h1>
						<p>
							Finance is an information-dense environment.
							Typically, traders will use serveral different displays so that they can keep track of multiple information sources at once. FDC3 helps with this by sharing the "context" between multiple applications, so that they collectively track the topic the user is focused on.
						</p>
					</aside>
					<aside>
						<h1 className={styles.title}>🏃‍♂️ Work Faster</h1>
						<p>
							FDC3 standardizes a way to call actions between applications (called "intents"). Applications can raise intents for other apps to resolve, extending each other's functionality. Instead of the user copy-and-pasting bits of data from one application to another, FDC3 makes sure the intents have the data they need to seamlessly transition activity between applications.
						</p>
					</aside>
					<aside>
						<h1 className={styles.title}> 🖥️ Platform Agnostic</h1>
						<p>
							As an open standard, FDC3 can be implemented on any platform and in any language. All that is required is a "Desktop Agent" that implements the FDC3 standard, which is responsible for co-ordinating application interactions. (For a list of open source and proprietary desktop agents, see "Platform providers" here.) FDC3 is successfully running on Web and Native platforms in financial institutions around the world.
						</p>
					</aside>
					<aside>
						<h1 className={styles.title}>🔌 End the Integration Nightmare</h1>
						<p>
							By providing support for FDC3, vendors and financial organizations alike can avoid the bilateral or trilateral integration projects that plague desktop app roll-out, cause vendor lock-in and result in a slow pace of change on the Financial Services desktop.
						</p>
					</aside>
					<aside>
						<h1 className={styles.title}>👐 Open Standards Innovation</h1>
						<p>
							FDC3 is developed collaboratively by a consortium of industry participants including banks, agent vendors, app developers and FinTech firms. By design, FDC3 is open to extension. We have an active community working on growing and improving the standard with new data and intents.
						</p>
					</aside>
				</Carousel1>
			</div>
			<div>
				<h1 className={styles.innerAside}>What are the Benefits?</h1>
			</div>
		</HomeSection>


	)
}

