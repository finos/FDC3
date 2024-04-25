import {Icon} from "../icon/icon"
import {ClientState, TabDetail} from "../state/client"
import * as styles from "./styles.module.css"

const Tab = ({td, active, onClick}: {td: TabDetail; active: boolean; onClick: () => void}) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.tab} ${active ? styles.activeTab : styles.inactiveTab}`}
      style={{
        backgroundColor: td.background,
        zIndex: active ? 100 : "none",
      }}
    >
      <Icon text={td.title} image={td.icon} dark={true} />
    </div>
  )
}

export const Tabs = ({cs}: {cs: ClientState}) => {
  return (
    <div className={styles.tabs}>
      {cs.getTabs().map((t, i) => (
        <Tab key={t.id} td={t} active={i == cs.getActiveTab()} onClick={() => cs.setActiveTab(i)} />
      ))}
    </div>
  )
}
