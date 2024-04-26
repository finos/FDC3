import { DirectoryApp } from "da-server"
import { GridStackPosition } from "gridstack"
import { v4 as uuid } from 'uuid'

export type AppPanel = GridStackPosition & {
    title: string
    url?: string,
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
    open(details: DirectoryApp): AppPanel

    /** Callback */
    addStateChangeCallback(cb: () => void): void
}

abstract class AbstractClientState implements ClientState {

    private tabs: TabDetail[] = []
    private panels: AppPanel[] = []
    private activeTabId: string
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

    open(detail: DirectoryApp): AppPanel {
        const ap = {
            x: 1,
            y: 1,
            w: 3,
            h: 4,
            title: detail.title,
            tabId: this.activeTabId,
            id: uuid(),
            url: 'wxyz' // detail?.details?.url as string
        } as AppPanel

        console.log("opening app")
        this.panels.push(ap)
        this.saveState()
        return ap
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
        const theState = localStorage.getItem('sail-state')
        if (theState) {
            const { tabs, panels, activeTab } = JSON.parse(theState)
            super(tabs, panels, activeTab)
        } else {
            super(DEFAULT_TABS, DEFAULT_PANELS, DEFAULT_TABS[0].id)
        }
    }

    saveState(): void {
        localStorage.setItem('ui-state', JSON.stringify(this))
        this.callbacks.forEach(cb => cb())
        console.log("State saved")
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
    { id: "abc", x: 2, y: 1, h: 2, w: 1, title: "ovme", tabId: 'one' },
    { id: "def", x: 2, y: 4, w: 3, h: 1, title: "Barn Owl", tabId: 'one' },
    { id: "786", x: 4, y: 2, w: 1, h: 1, title: "Routine", tabId: 'one' },
    { id: "322323", x: 3, y: 1, h: 2, w: 1, title: "Maintenance Broncohippy", tabId: 'one' },
    { id: "45", x: 0, y: 6, w: 2, h: 2, title: "Sasquatch", tabId: 'two' }
]

const theState = new LocalStorageClientState()

export function getClientState(): ClientState {
    return theState
}