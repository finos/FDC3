import * as styles from './styles.module.css'


type TabDetail = {
    title: string,
    channel: string,
    icon: string,
    background: string
}


const DEFAULT_TABS: TabDetail[] = [
    {
        title: "One",
        channel: "one",
        icon: "/static/icons/tabs/noun-airplane-3707662.svg",
        background: '#123456'
    },
    {
        title: "Two",
        channel: "two",
        icon: "/static/icons/tabs/noun-camera-3707659.svg",
        background: '#564312'
    },
    {
        title: "Three",
        channel: "three",
        icon: "/static/icons/tabs/noun-driller-3707669.svg",
        background: '#125634'
    }, {
        title: "Four",
        channel: "four",
        icon: "/static/icons/tabs/noun-radio-3707701.svg",
        background: '#ab1245'
    }
]

const Tab = ({ td }) => {
    return (<div className={styles.tab} style={{ backgroundColor: td.background }}>
        <div className={styles.tabDetail}>
            <img src={td.icon} className={styles.tabImage} />
            <p className={styles.tabText}>{td.title}</p>
        </div>
    </div>
    )
}


export const Tabs = () => {
    return (
        <div className={styles.tabs}>
            {
                DEFAULT_TABS.map(t => <Tab key={t.channel} td={t} />)
            }
        </div>
    )
}
