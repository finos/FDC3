import React from 'react';
import styles from './styles.module.css'
import HomeSection2 from "../HomeSection2";
import ConformanceShowcase from "../ConformanceShowcase";

export default function Conformance() {
	return (
		<HomeSection2 alt="true">
			<div className={styles.innerAside}>
				<a id="conformance"></a>
				<h2 >FDC3 Conformance</h2>
				<p className={styles.explanation}>FDC3 has a <a href="https://github.com/finos/FDC3-Conformance-Framework">conformance framework</a> that works to ensure compatibility with the standard. </p>
			</div>
			<ConformanceShowcase />
			<div>
				<a className={styles.cta} href="https://github.com/finos/FDC3-Conformance-Framework">CONFORMANCE FRAMEWORK</a>
			</div>
		</HomeSection2>
	)
}
