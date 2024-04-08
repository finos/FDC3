import React from 'react';
import styles from './styles.module.css'
import HomeSection2 from "../HomeSection2";
import Showcase from "../../../core/Showcase";

import users from './../../../data/users.json';

export default function UserShowcase() {

	const pinnedUsers = users.filter(user => user.pinned);
	pinnedUsers.sort((a, b) => a.caption.localeCompare(b.caption))

	return (
		<HomeSection2>
			<div>
				<h2 className={styles.innerAside}>Who is Using FDC3?</h2>
				<p className={styles.explanation}>The FDC3 standards are created and used by <a href="/users">leading organizations across the financial industry</a>. For more detail on who's using FDC3, developer tools, training and examples see the <a href="/community">community page</a>.</p>
			</div>
			<div className={styles.showcaseOuter}>
				{

					pinnedUsers.map(pu =>

						<a href={pu.infoLink}><img className={styles.showcaseImage} src={pu.image} alt={pu.caption} title={pu.caption} /></a>

					)
				}
			</div>
			<p>
				<a className={styles.button} href="/community">COMMUNITY PAGE</a>
			</p>
		</HomeSection2>
	);
};