import { GridItemHTMLElement, GridStack, GridStackWidget } from "gridstack"
import { ReactElement } from "react"
import ReactDOM from 'react-dom';
import { AppPanel, ClientState } from "../state/client"

const TRASH_DROP = "trash";

export interface GridsState {

    updatePanels(): void

}

type MountedPanel = AppPanel & {
    mountedTab: string
}

export function gridIdforTab(tabId: string): string {
    return "_gs_" + tabId
}

export function contentIdforTab(tabId: string): string {
    return "_content_" + tabId
}

export class GridsStateImpl implements GridsState {

    private readonly gridstacks: { [id: string]: GridStack } = {}
    private readonly cs: ClientState
    private readonly containerId: string
    private readonly render: (ap: AppPanel, id: string) => ReactElement

    // tracks state of grids
    private panelsInGrid: MountedPanel[] = []
    // keeps track of drop locations
    private newTabState: HTMLElement | null = null

    constructor(containerId: string, render: (ap: AppPanel, id: string) => ReactElement, cs: ClientState) {
        this.containerId = containerId
        this.render = render
        this.cs = cs
    }

    findEmptyArea(ap: AppPanel, grid: GridStack) {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x <= grid.getColumn() - (ap.w ?? 1); x++) {
                if (grid.isAreaEmpty(x, y, ap.w ?? 1, ap.h ?? 1)) {
                    ap.x = x;
                    ap.y = y;
                    return;
                }
            }
        }
        ap.x = 0;
        ap.y = 0;
        return
    }

    getPanel(id: string): AppPanel | undefined {
        return this.cs.getPanels().find(p => p.id == id);
    }

    removePanel(ap: AppPanel) {
        const grid = this.gridstacks[ap.tabId]
        const el = document.getElementById(ap.id)
        if (el) {
            grid.removeWidget(el!!)
        }
    }

    setupTabDropping() {
        Array.from(document.querySelectorAll(".drop-tab")).forEach(t => {
            const tab = t as HTMLElement
            GridStack.getDD().droppable(tab, {
                accept: (el: GridItemHTMLElement) => {
                    console.log("yeah boi")
                    return true;
                }
            })
                .on(tab, 'dropover', (_event, _el) => { this.newTabState = tab })
                .on(tab, 'dropout', (_event, _el) => { this.newTabState = null });
        })
    }

    createGridstack(tabId: string): GridStack {
        const gridId = gridIdforTab(tabId)
        const grid = GridStack.init(
            {
                removable: "#" + TRASH_DROP,
                acceptWidgets: true,
                margin: '1'
            },
            gridId
        )

        grid.on("resizestop", (_event, element) => {
            const node = element.gridstackNode
            if (node) {
                const panel = this.getPanel(node.id!!)
                if (panel) {
                    panel.w = node.w
                    panel.h = node.h
                    this.cs.updatePanel(panel)
                }
            }
        })

        grid.on("removed", (event, items) => {
            const targetId = (event.target as HTMLElement).getAttribute("id");
            if (targetId == TRASH_DROP) {
                items.forEach((i) => this.cs.removePanel(i.id!!))
            }
        })

        this.setupTabDropping()

        //allow dragging on the grid, and also consider new tabs.
        grid.on("dragstop", (_event, element) => {
            console.log("dragstop ");
            const node = element.gridstackNode
            if (node) {
                const panel = this.getPanel(node.id!!)
                if (panel) {
                    if (this.newTabState) {
                        const newTabId = this.newTabState.getAttribute("id")!!
                        const newGrid = this.gridstacks[newTabId]
                        this.findEmptyArea(panel, newGrid)
                        panel.tabId = newTabId
                    } else {
                        panel.x = node.x
                        panel.y = node.y
                    }
                    this.cs.updatePanel(panel)
                }
            }
        })

        return grid
    }


    ensureGrid(container: Element, tabId: string): GridStack {
        var gridEl = null
        const td = this.cs.getTabs().find(t => t.id == tabId)
        var gs = this.gridstacks[tabId]
        if (!gs) {
            gridEl = document.createElement("div")
            gridEl.setAttribute("id", gridIdforTab(tabId))
            gridEl.setAttribute("class", "grid-stack")
            container.appendChild(gridEl)

            gs = this.createGridstack(tabId)
            this.gridstacks[tabId] = gs
            gridEl.classList.add()
            container.appendChild(gridEl);
        } else {
            gridEl = document.getElementById(gridIdforTab(tabId))
        }

        if (gridEl) {
            const active = this.cs.getActiveTab().id == td?.id
            gridEl.setAttribute("style", `display: ${active ? "block" : "none"}; background-color: ${td?.background}; `)
        }

        return gs;
    }

    createWidget(grid: GridStack, p: AppPanel, content: boolean): GridItemHTMLElement {
        // add to the grid
        const opts: GridStackWidget = {
            h: p.h,
            w: p.w,
            x: p.x,
            y: p.y,
            id: p.id,
            content: content ? `<div id = "${contentIdforTab(p.id)}" /> ` : ""
        }

        // create the widget
        const widget = grid.addWidget(opts)
        widget.setAttribute("id", p.id)
        return widget
    }

    addPanel(grid: GridStack, p: AppPanel) {
        const el = document.getElementById(p.id)
        // new panel
        const widget = this.createWidget(grid, p, true)

        // add content to it
        const div = widget.children[0]
        const content = this.render(p, contentIdforTab(p.id))
        ReactDOM.render(content, div)
    }

    changeTab(p: MountedPanel) {
        console.log("changing tab")
        const oldWidget = document.getElementById(p.id) as GridItemHTMLElement

        if (oldWidget) {
            const content = document.getElementById(contentIdforTab(p.id))
            const newGrid = this.gridstacks[p.tabId]
            // new location
            const newWidget = this.createWidget(newGrid, p, false)
            const holder = newWidget.children[0]
            holder.appendChild(content!!)

            // rmemove old
            const oldGridEl = oldWidget.parentElement
            const gridId = oldGridEl?.getAttribute("id")?.substring(4)
            if (gridId) {
                const oldGrid = this.gridstacks[gridId]
                oldGrid.removeWidget(oldWidget, false)
            }
        }
    }


    updatePanels(): void {
        const container = document.getElementById(this.containerId)!

        // remove old panels
        const panelIds = this.cs.getPanels().map(p => p.id)
        const mountedIds = this.panelsInGrid.map(p => p.id)
        const removedPanels = this.panelsInGrid.filter(p => !panelIds.includes(p.id))
        const changedTabPanels = this.panelsInGrid.filter(p => p.mountedTab != this.cs.getPanels().find(q => q.id == p.id)?.tabId)
        const addedPanels = this.cs.getPanels().filter(p => !mountedIds.includes(p.id))

        // ensure all grids exist
        this.cs.getTabs().forEach(t => this.ensureGrid(container, t.id))

        // unchanged panels
        this.panelsInGrid = this.panelsInGrid.filter(cp => {
            const removing = removedPanels.find(k => k.id == cp.id)
            const moving = changedTabPanels.find(k => k.id == cp.id)

            if (removing || moving) {
                return false;
            } else {
                return true
            }
        })

        console.log(`Moved Tab: ${changedTabPanels.length} Removed: ${removedPanels.length} Added: ${addedPanels.length} Unchanged: ${this.panelsInGrid.length}`)


        removedPanels.forEach(p => this.removePanel(p))

        changedTabPanels.forEach(mp => {
            const cp = this.cs.getPanels().find(p => p.id == mp.id)
            if (cp) {
                mp.tabId = cp.tabId
                this.changeTab(mp)
                this.panelsInGrid.push({
                    ...mp,
                    mountedTab: mp.tabId
                })
            }
        })

        addedPanels.forEach(ap => {
            const gs = this.ensureGrid(container, ap.tabId)
            this.addPanel(gs, ap)
            this.panelsInGrid.push({
                ...ap,
                mountedTab: ap.tabId
            })
        })

        console.log("Panels in grid " + JSON.stringify(this.panelsInGrid))
    }

}

