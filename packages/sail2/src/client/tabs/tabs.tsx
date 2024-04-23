import { ClientState, TabDetail } from '../state/state'
import * as styles from './styles.module.css'




const Tab = ({ td, active }: { td: TabDetail, active: boolean }) => {
    return (<div className={styles.tab} style={{ backgroundColor: td.background }}>
        <div className={styles.tabDetail}>
            <img src={td.icon} className={styles.tabImage} />
            <p className={styles.tabText}>{td.title}</p>
        </div>
    </div>
    )
}


export const Tabs = ({ cs }: { cs: ClientState }) => {
    return (
        <div className={styles.tabs}>
            {
                cs.getTabs().map((t, i) => <Tab key={t.id} td={t} active={i == cs.getActiveTab()} />)
            }
        </div>
    )
}
