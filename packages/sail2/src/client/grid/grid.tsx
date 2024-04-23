import { Component, useEffect } from 'react'
import { GridStack } from 'gridstack'
import { AppPanel, ClientState } from '../state/state'
import * as styles from './styles.module.css'
import 'gridstack/dist/gridstack.css'

//const Item = ({ id }) => <div>{id}</div>


export const Grids = ({ cs }: { cs: ClientState }) => {
    return (
        <div className={styles.grids}>
            {
                cs.tabs.map((t, i) => <SimpleGrid key={t.channel} items={t.items} active={i == cs.activeTab} background={t.background} />)
            }
        </div>
    )
}

function SimpleGrid({ items, active, background }: { items: AppPanel[], active: boolean, background: string }) {

    var grid: GridStack | null = null
    var timerId: number | null = null

    useEffect(() => {
        grid = GridStack.init();

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
        <div className="grid-stack" style={{
            visibility: active ? "visible" : "hidden",
            backgroundColor: background
        }}>
            {
                items.map(i =>
                    <div className='grid-stack-item' data-gs-width={i.w} data-gs-height={i.h}>
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
