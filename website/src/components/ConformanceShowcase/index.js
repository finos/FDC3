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

    return <div className={styles.conformanceShowcase}>
        {
            relevant.map((c, key) => {
                return (
                    <div className={styles.conformanceShowcaseItem} key={key}>
                        <div className={styles.conformanceImage}>
                            <img src={c.conf.image} alt={c.conf.title} title={c.conf.title} />
                        </div>
                        <div className={styles.conformanceText}>
                        	{JSON.stringify(c.conf)}
                            <a title={c.conf.title} href={c.conf.infoLink}>{c.conf.title}<div className="showcase-title">{c.conf.title}</div></a>
                            <ul>
                                {
                                    c.badge.items.map((item, key2) => {
                                        return (<li key={key2}>
                                            <p>{item.text} {  (item.link) ? <em><a href={item.link}>More Details</a></em> :"" }</p>
                                        </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>)
            })
        }

    </div>
}