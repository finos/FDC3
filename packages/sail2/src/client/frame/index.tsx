import { Controls } from '../controls'
import { Empty, Logo } from '../logo'
import { Tabs } from '../tabs'
import * as styles from './styles.module.css'


export const Frame = () => {

    return (
        <div className={styles.outer}>
            <div className={styles.top}>
                <Empty />
                <Logo />
            </div>
            <div className={styles.middle}>
                <div className={styles.left}>
                    <Tabs />
                    <Controls />
                </div>
                <div className={styles.main}>
                    Main area
                </div>
            </div>
        </div>
    )

}


