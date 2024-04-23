import { GridStackWidget } from "gridstack"

export type AppPanel = GridStackWidget & {
    title: string
    url?: string,
    tab: string
}

export type TabDetail = {
    title: string,
    id: string,
    icon: string,
    background: string,
}

export interface ClientState {

    /** Tabs */
    getActiveTab(): number
    setActiveTab(n: number): void
    getTabs(): TabDetail[]
    addTab(td: TabDetail): void
    removeTab(id: string): void

    /** Panels */
    updatePanel(ap: AppPanel): void
    removePanel(id: string): void
    addPanel(ap: AppPanel): void
    getPanels(): AppPanel[]

    /** Callback */
    addStateChangeCallback(cb: () => void): void
}

abstract class AbstractClientState implements ClientState {

    private tabs: TabDetail[] = []
    private panels: AppPanel[] = []
    private activeTab: number = 0
    callbacks: (() => void)[] = []

    constructor(tabs: TabDetail[], panels: AppPanel[], activeTab: number) {
        this.tabs = tabs
        this.panels = panels
        this.activeTab = activeTab
        this.saveState()
    }

    abstract saveState(): void

    /** Tabs */
    getActiveTab(): number {
        return this.activeTab
    }

    setActiveTab(n: number) {
        this.activeTab = n
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
        const idx = this.panels.findIndex(p => p.id == ap.id)
        if (idx != -1) {
            this.panels[idx] = ap
        }
        this.saveState()
    }

    removePanel(id: string): void {
        this.panels = this.panels.filter(p => p.id != id)
        this.saveState()
    }

    addPanel(ap: AppPanel): void {
        this.panels.push(ap)
        this.saveState()
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
        const theState = localStorage.getItem('ui-state')
        if (theState) {
            const { tabs, panels, activeTab } = JSON.parse(theState)
            super(tabs, panels, activeTab)
        } else {
            super(DEFAULT_TABS, DEFAULT_PANELS, 0)
        }
    }

    saveState(): void {
        localStorage.setItem('ui-state', JSON.stringify(this))
        this.callbacks.forEach(cb => cb())
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
    { id: "abc", x: 2, y: 1, h: 2, w: 1, title: "ovme", tab: 'one' },
    { id: "def", x: 2, y: 4, w: 3, h: 1, title: "Barn Owl", tab: 'one' },
    { id: "786", x: 4, y: 2, w: 1, h: 1, title: "Routine", tab: 'one' },
    { id: "322323", x: 3, y: 1, h: 2, w: 1, title: "Maintenance Broncohippy", tab: 'one' },
    { id: "45", x: 0, y: 6, w: 2, h: 2, title: "Sasquatch", tab: 'two' }
]

const theState = new LocalStorageClientState()

export function getClientState(): ClientState {
    return theState
}