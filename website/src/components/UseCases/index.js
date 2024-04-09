import React from 'react';
import styles from './styles.module.css'
import Carousel1 from '../Carousel1';
import HomeSection from "../HomeSection";
import Callout from "../Callout";

export default function UseCases() {
	return (
		<HomeSection style={{ "backgroundColor": "white" }}>
			<div className={styles.innerAside}>
				<h2>Use Cases</h2>
				<p>The design of FDC3 is based on a set of foundational interoperability use-cases, validated by firms across the industry.</p><p>
					This ensures the standard meets the real-world needs of the financial industry, not just assumptions.</p>

			</div>
			<div className={styles.right}>
				<img className={styles.image1} src="/img/use-cases/illus.svg" />
				<a className={styles.button} href="/docs/next/use-cases/overview">READ MORE</a>
			</div>
		</HomeSection>
	)
}

