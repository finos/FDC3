import React from 'react';
import styles from './styles.module.css'


export default function TypeText({children}) {
	return (<div className={styles.animTypewriter}>{children}</div> )
}