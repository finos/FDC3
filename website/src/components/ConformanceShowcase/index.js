import community from "../../../data/community.json";
import { image1 } from "../UseCases/styles.module.css";
const React = require('react');
import styles from './styles.module.css'

export default () => {

	const titleSort = function(a, b) {
		let x = a.conf.title.toLowerCase();
		let y = b.conf.title.toLowerCase();
		if (x < y) { return -1; }
		if (x > y) { return 1; }
		return 0;
	}

	let relevant = community.filter(c => c.conformance)

	let badges = ["/img/community/certified-1.2.png", "/img/community/certified-2.0.png"]

	let publishers = relevant.map(r => r.publisher).filter((x, i, a) => a.indexOf(x) === i)

	function Publisher({name}) {
		const p = community.find(q => q.publisher == name)
		
		return (<a href={p.infoLink} title={p.publisher}><img className={styles.conformanceImage} src={p.image} /></a>)
	}

	function ConformanceItem({ publisher, badge }) {
		const pub = community.find(q => (q.publisher == publisher))
		const details = pub.conformance.find(c => c.src == badge)
		const items = details?.items ?? []

		return (items.map( i => <div className={styles.conformanceText}><p>{i.text}</p><p><a href={i.link}>Read More</a></p></div>))		
	}

	return <div className={styles.conformanceShowcase}>
		<table>
			<thead>
				<tr>
					<th>Firm</th>
					{
						badges.map(b => <th><img className={styles.badgeImage} src={b} /></th>)
					}
				</tr>
				{
					publishers.map(p =>
						<tr>
							<td><Publisher name={p} /></td>
							<td><ConformanceItem publisher={p} badge={badges[0]} /></td>
							<td><ConformanceItem publisher={p} badge={badges[1]} /></td>
						</tr>
					)
				}
			</thead>
		</table>
	</div>
}


