import React from 'react';
import styles from './styles.module.css'
import HomeSection from "../HomeSection";
import One from '../../../data/get-involved/1.mdx'
import Two from '../../../data/get-involved/2.mdx'
import Three from '../../../data/get-involved/3.mdx'
import Four from '../../../data/get-involved/4.mdx'
import Five from '../../../data/get-involved/5.mdx'
import GridBlock from "../GridBlock";
import Carousel1 from '../Carousel1';


export default function Benefits() {
	return (
		<HomeSection>
			<div className={styles.innerAside}>
				<h2>Get Involved</h2>
				<p>
				<a href="mailto:fdc3+subscribe@finos.org">Join the General List</a> to stay up to date with the project.
				 </p>

			</div>
			<Carousel1>
				<div className={styles.item}><h1>1</h1><One /></div> 
				<div className={styles.item}><h1>2</h1><Two /></div> 
				<div className={styles.item}><h1>3</h1><Three /></div> 
				<div className={styles.item}><h1>4</h1><Four /></div> 
				<div className={styles.item}><h1>5</h1><Five /></div> 
			</Carousel1>
		</HomeSection>
	)
}

