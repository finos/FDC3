import React from 'react';
import styles from './styles.module.css'
import Carousel1 from '../Carousel1';
import HomeSection from "../HomeSection";
import Callout from "../Callout";

export default function Parts() {
	return (
		<HomeSection alt="true" reverse="true">
			<div className={styles.innerAside}> 
				<h2 >The Standard</h2>
				<p className={styles.strap}>The FDC3 standard consists of five main parts...</p>
			</div>
			<div>
				<Carousel1>
					<aside className={styles.part}>
						<h1>1</h1>
						<h2 className={styles.title}>The API</h2>
						<div className={styles.image}><img alt="" src="/img/feature-api.svg" /></div>
						<p>
							Create a consistent developer experience by adhering to the <a href="/docs/api/spec">API standard</a>
						</p>
					</aside>
					<aside className={styles.part}>
						<h1>2</h1>
						<h2 className={styles.title}>Intents</h2>
						<div className={styles.image}><img alt="" src="/img/feature-intents.svg" /></div>
						<p>
							Use <a href="/docs/intents/spec">standardized verbs</a> to instruct other apps to take an action
						</p>	
					</aside>
					<aside className={styles.part}>
						<h1>3</h1>
						<h2 className={styles.title}>Context Data</h2>
						<div className={styles.image}><img alt="" src="/img/feature-context.svg" /></div>
						<p>
							Share <a href="/docs/context/spec">context</a> between apps to eliminate re-keying and streamline workflow
						</p>
					</aside>
					<aside className={styles.part}>
						<h1>4</h1>
						<h2 className={styles.title}>App Directory</h2>
						<div className={styles.image}><img alt="" src="/img/feature-appd.svg" /></div>
						<p>
							Discover trusted apps that can take part in a FDC3 workflow using an <a href="/docs/app-directory/overview">App directory</a>
						</p>
					</aside>
					<aside className={styles.part}>
						<h1>5</h1>
						<h2 className={styles.title}>Agent Bridging</h2>
						<div className={styles.image}><img alt="" src="/img/feature-bridging.svg" /></div>
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

