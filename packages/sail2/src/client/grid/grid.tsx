import { useEffect } from 'react'
import { GridStack } from 'gridstack'
import { AppPanel, ClientState } from '../state/state'
import * as styles from './styles.module.css'
import 'gridstack/dist/gridstack.css'

export const Grids = ({ cs }: { cs: ClientState }) => {
    return (
        <div className={styles.grids}>
            {
                cs.getTabs().map((t, i) => {
                    const panels = cs.getPanels().filter(p => p.tab == t.id)
                    return (
                        <SimpleGrid key={t.id} items={panels} active={i == cs.getActiveTab()} background={t.background} id={'_gs_' + t.id} />
                    )
                })
            }
        </div>
    )
}

function SimpleGrid({ items, active, background, id }: { items: AppPanel[], active: boolean, background: string, id: string }) {

    var grid: GridStack | null = null
    var timerId: number | null = null

    useEffect(() => {
        const el = document.getElementById(id)!!
        grid = GridStack.addGrid(el);

        grid.on("dragstop", (_event, element) => {
            const node = element.gridstackNode;
            console.log(`you just dragged node #${node!!.id} to ${node!!.x},${node!!.y} – good job!`)

            // Clear the info text after a two second timeout.
            // Clears previous timeout first.
            if (timerId) {
                window.clearTimeout(timerId);
            }
            timerId = window.setTimeout(() => {
                console.log(`two seconds elapsed`)
            }, 2000);
        });

    });


    return (
        <div id={id} className="grid-stack" style={{
            display: active ? "block" : "none",
            backgroundColor: background
        }}>
            {
                items.map(i =>
                    <div key={i.id} className='grid-stack-item' gs-w={i.w} gs-h={i.h} gs-x={i.x} gs-y={i.y}>
                        <Content key={i.id} panel={i} />
                    </div>
                )
            }
        </div>
    )
}

const LockIcon = () => {
    return (<img src="/static/icons/control/lock.svg" className={styles.contentTitleIcon} title="Lock" />)
}

const PopOutIcon = () => {
    return (<img src="/static/icons/control/pop-out.svg" className={styles.contentTitleIcon} title="Pop Out" />)
}

const ChooseApp = () => {
    return (<div className={styles.contentChoose}>
        <img src="/static/icons/control/choose-app.svg" className={styles.contentChooseIcon} title="Choose App" />
        <p className={styles.contentChooseText}>Click To Choose App</p>
    </div >)
}

const Content = ({ panel }: { panel: AppPanel }) => {
    return (
        <div className={styles.content}>
            <div className={styles.contentInner}>
                <div className={styles.contentTitle}>
                    <p className={styles.contentTitleText}>
                        <span className={styles.contentTitleTextSpan}>{panel.title}</span>
                    </p>
                    <LockIcon />
                    <PopOutIcon />
                </div>
                <div className={styles.contentBody}>
                    <ChooseApp />
                </div>
            </div>
        </div>
    )
}
