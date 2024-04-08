import React from 'react';
import styles from './styles.module.css'
import HomeSection2 from "../HomeSection2";
import One from '../../../data/get-involved/1.mdx'
import Two from '../../../data/get-involved/2.mdx'
import Three from '../../../data/get-involved/3.mdx'
import Four from '../../../data/get-involved/4.mdx'
import GridBlock from "../GridBlock";


export default function Benefits() {
	return (
		<HomeSection2>
			<div>
				<h1 className={styles.innerAside}>Get <strong>Involved</strong></h1>
			</div>
			<div className={styles.itemList}>
				<div><One /></div> 
				<div><Two /></div> 
				<div><Three /></div> 
				<div><Four /></div> 
			</div>
		</HomeSection2>
	)
}

