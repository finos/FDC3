import { ClientState, TabDetail } from '../state/state'
import * as styles from './styles.module.css'




const Tab = ({ td, active, onClick }: { td: TabDetail, active: boolean, onClick: () => void }) => {
    return (<div className={`${styles.tab} ${active ? styles.activeTab : styles.inactiveTab}`} style={{
        backgroundColor: td.background,
        zIndex: active ? 100 : "none"
    }}>
        <div className={styles.tabDetail} onClick={onClick} >
            <img src={td.icon} className={styles.tabImage} />
            <p className={styles.tabText}>{td.title}</p>
        </div>
    </div >
    )
}


export const Tabs = ({ cs }: { cs: ClientState }) => {
    return (
        <div className={styles.tabs}>
            {
                cs.getTabs().map((t, i) => <Tab key={t.id} td={t} active={i == cs.getActiveTab()} onClick={() => cs.setActiveTab(i)} />)
            }
        </div>
    )
}
