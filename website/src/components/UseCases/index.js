import React from 'react';
import styles from './styles.module.css'
import Carousel1 from '../Carousel1';
import HomeSection2 from "../HomeSection2";
import Callout from "../Callout";

export default function UseCases() {
	return (
		<HomeSection2>
			<h1 className={styles.innerAside}>Use Cases</h1>
			<div>
				Some stuff here
			</div>
			<div>
				<a className={styles.button} href="/docs/use-cases/overview">READ MORE</a>
			</div>
		</HomeSection2>


	)
}

