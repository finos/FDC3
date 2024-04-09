import React from 'react';
import styles from './styles.module.css'
import HomeSection2 from "../HomeSection2";

export default function Training() {
	return (
		<HomeSection2>
			<div>
				<h1 className={styles.innerAside}>FDC3 Training and Certification</h1>
			</div>

			<div className={styles.trainingList}>
				<div className={styles.trainingItem}>
					<h2>Introduction to FDC3 (LFEL1000)</h2>
					<img className={styles.trainingImage} src="/img/training/LFEL1000.png" />
					<p>This <strong>FREE</strong> entry-level course is designed for business technologists who are looking to adopt application interoperability within their technology landscape and for developers who want to build interoperable applications using the FDC3 Standard.</p>
					<a className={styles.button} href="https://training.linuxfoundation.org/express-learning/introduction-to-fdc3-lfel1000/">MORE</a>
				</div>
				<div className={styles.trainingItem}>
					<h2>Developing Solutions with FDC3 (LFD237)</h2>
					<img className={styles.trainingImage} src="/img/training/LFD237.png" />
					<p>This course is designed for developers who are looking to build interoperable applications using the FDC3 standard, as well as community participants who provide FDC3 technology and services.</p><p> LFD237 is priced at $299 but free seats are available to FINOS members.</p>
					<a className={styles.button} href="https://training.linuxfoundation.org/training/developing-solutions-with-fdc3-lfd237/">MORE</a>
				</div>
				<div className={styles.trainingItem}>
					<h2>FDC3 Certified Practitioner (FCFP)</h2>
					<img className={styles.trainingImage} src="/img/training/FCFP.png" />
					<p>The FCFP is a professional certification designed for technical business analysts, software developers and FDC3 implementers in the finance, insurance, banking, and investment industries.</p><p>FCFP is priced at $250 but free seats are available to FINOS members.</p>
					<a className={styles.button} href="https://training.linuxfoundation.org/certification/finos-certified-fdc3-practitioner/">MORE</a>
				</div>
			</div>
			<p>
				<a className={styles.button} href="/training">TRAINING PAGE</a>
			</p>
		</HomeSection2>
	)
}

