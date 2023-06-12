import community from "../../../data/community.json";
const React = require('react');
import styles from './styles.module.css'

export default ({ badge }) => {

    const relevant = community.flatMap(c => {
        return (c.conformance ?? [])
            .filter(i => i.src == badge)
            .map(i => {
                return {
                    "conf": c,
                    "badge": i
                }
            });
    });
    
	function transformBadge(badge) {
		return (
			<ul>
				{
					badge.items.map((item, key2) => {
						return (<li key={key2}>
							<p>{item.text} {(item.link) ? <em><a href={item.link}>More Details</a></em> : ""}</p>
						</li>)
					})
				}
			</ul>
		)
	}

	function transformItem(conf, badge) {
		return (
			<div className={styles.conformanceShowcaseItem} key={key}>
				{JSON.stringify(conf)}
				<div className={styles.conformanceImage} someTag={conf.title + " " + conf.image}>
					<img src={conf.image} alt={conf.title} title={conf.title} />
				</div>
				<div className={styles.conformanceText}>
					<a title={conf.title} href={conf.infoLink}><div className="showcase-title">{conf.title}</div></a>
					{
						transformBadge(badge)
					}
				</div>
			</div>
		);
	}
	

    return <div className={styles.conformanceShowcase}>
        {
            relevant.map((c, key) => {
            	const conf = c.conf;
            	const badge = c.badge;
                return transformItem(conf, badge)
            })
        }

    </div>
}