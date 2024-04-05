import React from 'react';
import styles from './styles.module.css'
import Carousel1 from '../Carousel1';
import HomeSection from "../HomeSection";
import Callout from "../Callout";

export default function Parts() {
	return (
		<HomeSection>
			<div>
				<h1 className={styles.innerAside}>The Standard</h1>
				<p>The FDC3 standard consists of five main parts...</p>
			</div>
			<div>
				<Carousel1>
					<aside className={styles.part}>
						<img alt="" src="/img/feature-api.svg" />
						<h1 className={styles.title}>The API</h1>
						<p>
							Create a consistent developer experience by adhering to the <a href="/docs/api/spec">API standard</a>
						</p>
					</aside>
					<aside className={styles.part}>
						<img alt="" src="/img/feature-intents.svg" />
						<h1 className={styles.title}>Intents</h1>
						<p>
							Use <a href="/docs/intents/spec">standardized verbs</a> to instruct other apps to take an action
						</p>	
					</aside>
					<aside className={styles.part}>
						<img alt="" src="/img/feature-context.svg" />
						<h1 className={styles.title}>Context Data</h1>
						<p>
							Share <a href="/docs/context/spec">context</a> between apps to eliminate re-keying and streamline workflow
						</p>
					</aside>
					<aside className={styles.part}>
						<img alt="" src="/img/feature-appd.svg" />
						<h1 className={styles.title}>App Directory</h1>
						<p>
							Discover trusted apps that can take part in a FDC3 workflow using an <a href="/docs/app-directory/overview">App directory</a>
						</p>
					</aside>
					<aside className={styles.part}>
						<img alt="" src="/img/feature-bridging.svg" />
						<h1 className={styles.title}>Agent Bridging</h1>
						<p>
							Link 2 or more Desktop Agent APIs together via a <a href="/docs/agent-bridging/spec">bridge</a> to extend interop across them.
						</p>
						<p>
<a href="https://fdc3.finos.org/docs/fdc3-compliance#experimental-features">@experimental</a>
						</p>
					</aside>
				</Carousel1>
			</div>
			<p>
				<a className={styles.button} href="/docs/fdc3-intro">READ THE STANDARD</a>
			</p>
		</HomeSection>


	)
}

