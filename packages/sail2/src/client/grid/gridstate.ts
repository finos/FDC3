import { GridStack, GridStackWidget } from "gridstack"
import { ReactElement } from "react"
import { Root, createRoot } from "react-dom/client"
import { AppPanel, ClientState } from "../state/client"

export interface GridsState {

    updatePanels(): void

}

export function gridIdforTab(tabId: string): string {
    return "_gs_" + tabId
}

export function contentIdforTab(tabId: string): string {
    return "_content_" + tabId
}

export class GridsStateImpl implements GridsState {

    private readonly gridstacks: { [id: string]: GridStack } = {}
    private readonly reactRoots: { [id: string]: Root } = {}
    private readonly cs: ClientState
    private readonly panelsInGrid: AppPanel[] = []
    private readonly containerId: string
    private readonly render: (ap: AppPanel) => ReactElement

    constructor(containerId: string, render: (ap: AppPanel) => ReactElement, cs: ClientState) {
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
        const root = this.reactRoots[contentIdforTab(ap.id)]
        if (root) {
            root.unmount()
            delete this.reactRoots[contentIdforTab(ap.id)]
        }
        const grid = this.gridstacks[ap.tabId]
        const el = document.getElementById(ap.id)
        if (el) {
            grid.removeWidget(el!!)
        }
    }

    createGridstack(gridId: string): GridStack {
        const grid = GridStack.init(
            {
                removable: "#trash",
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

        grid.on("removed", (_event, items) => {
            items.forEach((i) => this.cs.removePanel(i.id!!))
        })

        // // allow dragging onto new tabs
        // const tab = document.getElementById(tabId)!!
        // GridStack.getDD().droppable(tab, {
        //     accept: (el: GridItemHTMLElement) => {
        //         console.log("yeah boi")
        //         return true;
        //     }
        // })
        //     .on(tab, 'dropover', (_event, _el) => { newTabState = tab })
        //     .on(tab, 'dropout', (_event, _el) => { newTabState = null });

        // allow dragging on the grid, and also consider new tabs.
        // grid.on("dragstop", (_event, element) => {
        //     console.log("dragstop ");
        //     const node = element.gridstackNode
        //     if (node) {
        //         console.log(`you just dragged node #${node!!.id} to ${node!!.x},${node!!.y} – good job!`)
        //         if (newTabState) {
        //             const newTabId = newTabState.getAttribute("id")!!
        //             const newHome = this.gridstacks[gridIdforTab(newTabId)]
        //             const existingContent = this.reactRoots[]
        //             grid.removeWidget(node, false)
        //             update(node, newTabId)
        //             newHome.addWidget(element)
        //             newTabState = null
        //         } else {
        //             update(node, tabId)
        //         }
        //     }
        // })
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

            gs = this.createGridstack(gridIdforTab(tabId))
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

    createWidget(grid: GridStack, p: AppPanel, content?: Element): string {
        this.findEmptyArea(p, grid)
        // add to the grid
        const contentId = contentIdforTab(p.id)
        const opts: GridStackWidget = {
            h: p.h,
            w: p.w,
            x: p.x,
            y: p.y,
            id: p.id,
            content: (content ? "" : `<div id = "${contentId}" /> `)
        }

        // create the widget
        const widget = grid.addWidget(opts)
        widget.setAttribute("id", p.id)

        if (content) {
            widget.appendChild(content)
        }

        return contentId
    }

    ensurePanel(grid: GridStack, p: AppPanel) {
        const el = document.getElementById(p.id)
        if (!el) {
            const contentId = this.createWidget(grid, p)

            // add content to it
            const div = document.getElementById(contentId)!!
            const content = this.render(p)
            const root = createRoot(div)
            this.reactRoots[contentId] = root
            root.render(content)
        } else if (!grid.el.contains(el)) {
            // element exists but in a different grid
            // const root = this.reactRoots[contentIdforTab(p.id)]
            // const content = root.
            // const contentId = this.createWidget(grid, p, existingContent)
        }
    }


    updatePanels(): void {
        const container = document.getElementById(this.containerId)!

        // remove old panels
        const panelIds = this.cs.getPanels().map(p => p.id)
        const removedPanels = this.panelsInGrid.filter(p => !panelIds.includes(p.id))
        removedPanels.forEach(p => this.removePanel(p))

        // ensure all the other panels are displayed and on the right grid
        this.panelsInGrid.length = 0
        this.cs.getPanels().forEach(ap => {
            const gs = this.ensureGrid(container, ap.tabId)
            this.ensurePanel(gs, ap)
            this.panelsInGrid.push(ap)
        })
    }

}

