import { DirectoryApp } from "da-server"
import { WebAppDetails } from "da-server/src/directory/DirectoryInterface"
import { GridStackPosition } from "gridstack"
import { v4 as uuid } from 'uuid'

const STORAGE_KEY = "sail-client-state"

export type AppPanel = GridStackPosition & {
    title: string
    url: string,
    tabId: string
    id: string
}

export type TabDetail = {
    title: string,
    id: string,
    icon: string,
    background: string,
}

export interface ClientState {

    /** Tabs */
    getActiveTab(): TabDetail
    setActiveTabId(n: string): void
    getTabs(): TabDetail[]
    addTab(td: TabDetail): void
    removeTab(id: string): void

    /** Panels */
    updatePanel(ap: AppPanel): void
    removePanel(id: string): void
    getPanels(): AppPanel[]

    /** Apps */
    open(details: DirectoryApp): AppPanel | null

    /** Callback */
    addStateChangeCallback(cb: () => void): void
}

abstract class AbstractClientState implements ClientState {

    protected tabs: TabDetail[] = []
    protected panels: AppPanel[] = []
    protected activeTabId: string
    callbacks: (() => void)[] = []

    constructor(tabs: TabDetail[], panels: AppPanel[], activeTabId: string) {
        this.tabs = tabs
        this.panels = panels
        this.activeTabId = activeTabId
        this.saveState()
    }

    abstract saveState(): void

    /** Tabs */
    getActiveTab(): TabDetail {
        return this.tabs.find(t => t.id == this.activeTabId)!!
    }

    setActiveTabId(id: string) {
        this.activeTabId = id
        this.saveState()
    }

    getTabs(): TabDetail[] {
        return this.tabs
    }

    addTab(td: TabDetail) {
        this.tabs.push(td)
        this.saveState()
    }

    removeTab(id: string) {
        this.tabs = this.tabs.filter(t => t.id != id)
        this.saveState()
    }

    /** Panels */
    updatePanel(ap: AppPanel): void {
        console.log("Panels " + JSON.stringify(this.panels))
        const idx = this.panels.findIndex(p => p.id == ap.id)
        if (idx != -1) {
            this.panels[idx] = ap
        } else {
            this.panels.push(ap)
        }

        console.log("Total Panels: " + this.panels.length)

        this.saveState()
    }

    removePanel(id: string): void {
        this.panels = this.panels.filter(p => p.id != id)
        this.saveState()
    }

    open(detail: DirectoryApp): AppPanel | null {
        if (detail.type == 'web') {
            const url = (detail.details as WebAppDetails).url
            const ap = {
                x: 1,
                y: 1,
                w: 3,
                h: 4,
                title: detail.title,
                tabId: this.activeTabId,
                id: uuid(),
                url
            } as AppPanel

            console.log("opening app")
            this.panels.push(ap)
            this.saveState()
            return ap
        } else {
            return null;
        }
    }

    getPanels(): AppPanel[] {
        return this.panels
    }

    addStateChangeCallback(cb: () => void) {
        this.callbacks.push(cb)
    }
}

class LocalStorageClientState extends AbstractClientState {

    constructor() {
        const theState = localStorage.getItem(STORAGE_KEY)
        if (theState) {
            const { tabs, panels, activeTabId } = JSON.parse(theState)
            super(tabs, panels, activeTabId)
        } else {
            super(DEFAULT_TABS, DEFAULT_PANELS, DEFAULT_TABS[0].id)
        }
    }

    saveState(): void {
        const data = JSON.stringify({ tabs: this.tabs, panels: this.panels, activeTabId: this.activeTabId })
        localStorage.setItem(STORAGE_KEY, data)
        this.callbacks.forEach(cb => cb())
        console.log("State saved" + data)
    }

}

const DEFAULT_TABS: TabDetail[] = [
    {
        title: "One",
        id: "one",
        icon: "/static/icons/tabs/noun-airplane-3707662.svg",
        background: '#123456',
    },
    {
        title: "Two",
        id: "two",
        icon: "/static/icons/tabs/noun-camera-3707659.svg",
        background: '#564312',
    },
    {
        title: "Three",
        id: "three",
        icon: "/static/icons/tabs/noun-driller-3707669.svg",
        background: '#125634',
    }
]

const DEFAULT_PANELS: AppPanel[] = [
]

const theState = new LocalStorageClientState()

export function getClientState(): ClientState {
    return theState
}