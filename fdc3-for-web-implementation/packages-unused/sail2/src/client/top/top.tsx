import * as styles from './styles.module.css'


export const Empty = () => {
    return (
        <div className={styles.empty} />
    )
}

export const Logo = () => {
    return (
        <div className={styles.logo}>
            <img src="/static/icons/logo/logo.png" className={styles.logoImage} />
            <p className={styles.logoTextThin}>FDC3</p>
            <p className={styles.logoTextBold}>Sail</p>
        </div >
    )
}

export const Settings = () => {
    return (
        <div className={styles.settings}>
            <img src="/static/icons/control/dots.svg" className={styles.settingsControl} />
        </div >
    )
}