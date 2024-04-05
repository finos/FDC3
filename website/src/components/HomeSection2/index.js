import React from 'react';
import styles from './styles.module.css'
import MonoIcon from '../MonoIcon'

export default ({children}) => {
	return (
		<section className={styles.homeSection}>
			<div className={styles.title}>
					{ children[0] }
				</div>
			
			<div className={styles.main}>
					{ children[1] }
			</div>
			
			<div className={styles.callToAction}>
				{ children[2] }
			</div>
			
			<div className={styles.footerImage}>
				<MonoIcon />
			</div>
		</section> )
}


