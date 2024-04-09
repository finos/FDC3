import React from 'react';
import styles from './styles.module.css'
import MonoIcon from '../MonoIcon'

// left, right panels, a call to action adn a footer icon
export default ({children, alt, reverse}) => {
	const classes = (alt ? styles.homeSectionAlt : styles.homeSection) + " " + (reverse ? "reverse" : "")
	return (
		<section className={classes}>
			<div className={styles.innerFlex}>
				<div className={styles.item}>
					{ children[0] }
				</div>
				<div className={styles.item}>
					{ children[1] }
				</div>
			</div>
			
			<div className={styles.callToAction}>
				{ children[2] }
			</div>
			
			<div className={styles.footerImage}>
				<MonoIcon />
			</div>
		</section> )
}


