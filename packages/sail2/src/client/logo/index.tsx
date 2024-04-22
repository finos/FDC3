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
            <img src="/static/icons/control/dots.svg" className={styles.logoControl} />
        </div >
    )
}