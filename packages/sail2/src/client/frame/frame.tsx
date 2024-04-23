import { Controls } from '../controls/controls'
import { Empty, Logo, Settings } from '../top/top'
import { Tabs } from '../tabs/tabs'
import * as styles from './styles.module.css'
import { ClientState } from '../state/state'
import { Grids } from '../grid/grid'


export const Frame = ({ cs }: { cs: ClientState }) => {

    return (
        <div className={styles.outer}>
            <div className={styles.top}>
                <Logo />
                <Empty />
                <Settings />
            </div>
            <div className={styles.middle}>
                <div className={styles.left}>
                    <Tabs cs={cs} />
                    <Controls />
                </div>
                <div className={styles.main}>
                    <Grids cs={cs} />
                </div>
            </div>
        </div>
    )

}


