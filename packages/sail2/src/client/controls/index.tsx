import * as styles from './styles.module.css'




const Start = () => {
    return (<div className={styles.control}>
        <img src="/static/icons/control/start.svg" title="Add App" className={styles.controlImage} />
    </div>
    )
}


const Bin = () => {
    return (<div className={styles.control}>
        <img src="/static/icons/control/bin.svg" title="Remove App" className={styles.controlImage} />
    </div>
    )
}

const NewTab = () => {
    return (<div className={styles.control}>
        <img src="/static/icons/control/add.svg" title="Add Tab" className={styles.controlImage} />
    </div>
    )
}

export const Controls = () => {
    return (
        <div className={styles.controls}>
            <Start />
            <NewTab />
            <Bin />
        </div>
    )
}
