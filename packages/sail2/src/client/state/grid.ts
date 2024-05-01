import { GridItemHTMLElement, GridStack, GridStackNode, GridStackWidget } from "gridstack"
import { AppPanel } from "./client"
import { ReactElement } from "react"
import { Root, createRoot } from "react-dom/client"

export interface GridsState {

    removePanel(ap: AppPanel): void

    ensurePanelsInGrid(tabId: string, items: AppPanel[]): void

    ensureGrid(
        update: (gn: GridStackNode, tab: string) => void,
        render: (ap: AppPanel) => ReactElement,
        remove: (gn: GridStackNode) => void,
        cssClass: string,
        tabId: string): void
}

// keep track of dropping into other tabs
var newTabState: HTMLElement | null = null;


export function gridIdforTab(tabId: string): string {
    return "_gs_" + tabId
}

class GridstackGridsState implements GridsState {

    private readonly gridstacks: { [id: string]: GridStack } = {}
    private readonly renderers: { [id: string]: (ap: AppPanel) => ReactElement } = {}
    private readonly reactRoots: { [id: string]: Root } = {}

    findEmptyArea(ap: AppPanel, grid: GridStack) {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x <= 12 - (ap.w ?? 1); x++) {
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

    removePanel(ap: AppPanel) {
        const gridId = gridIdforTab(ap.tabId)
        const grid = this.gridstacks[gridId]
        const root = this.reactRoots['content_' + ap.id]
        if (root) {
            root.unmount()
            delete this.reactRoots['content_' + ap.id]
        }
        const el = document.getElementById(ap.id)
        if (el) {
            grid.removeWidget(el!!)
        }
    }

    ensurePanelsInGrid(tabid: string, items: AppPanel[]): void {
        const gridId = gridIdforTab(tabid)
        const grid = this.gridstacks[gridId]
        items.forEach(p => {
            this.findEmptyArea(p, grid)
            const el = document.getElementById(p.id)
            if (!el) {
                const contentId = 'content_' + p.id
                const opts: GridStackWidget = {
                    h: p.h,
                    w: p.w,
                    x: p.x,
                    y: p.y,
                    id: p.id,
                    content: `<div id="${contentId}" />`
                }
                // create the widget
                const widget = grid.addWidget(opts)
                widget.setAttribute("id", p.id)

                // add content to it
                const div = document.getElementById(contentId)!!
                const renderer = this.renderers[gridId]
                const content = renderer(p)
                const root = createRoot(div)
                this.reactRoots[contentId] = root
                root.render(content)
            }
        })
    }

    ensureGrid(update: (ap: GridStackNode, tab: string) => void, render: (ap: AppPanel) => ReactElement, remove: (gn: GridStackNode) => void, cssClass: string, tabId: string): void {
        const id = gridIdforTab(tabId)
        if (!this.gridstacks[id]) {
            const grid = GridStack.init(
                {
                    removable: "#trash",
                    acceptWidgets: true,
                    margin: '1'
                },
                id
            )
            this.gridstacks[id] = grid
            this.renderers[id] = render

            const gridEl = document.getElementById(id)!!

            gridEl.classList.add(cssClass)

            // allow resizing
            grid.on("resizestop", (_event, element) => {
                const node = element.gridstackNode
                if (node) {
                    update(node, tabId)
                }
            })

            // allow removal
            grid.on("removed", (_event, items) => {
                items.forEach((i) => remove(i))
            })

            // allow dragging onto new tabs
            const tab = document.getElementById(tabId)!!
            GridStack.getDD().droppable(tab, {
                accept: (el: GridItemHTMLElement) => {
                    console.log("yeah boi")
                    return true;
                }
            })
                .on(tab, 'dropover', (_event, _el) => { newTabState = tab })
                .on(tab, 'dropout', (_event, _el) => { newTabState = null });

            // allow dragging on the grid, and also consider new tabs.
            grid.on("dragstop", (_event, element) => {
                console.log("dragstop ");
                const node = element.gridstackNode
                if (node) {
                    console.log(`you just dragged node #${node!!.id} to ${node!!.x},${node!!.y} – good job!`)
                    if (newTabState) {
                        const newTabId = newTabState.getAttribute("id")!!
                        const newHome = this.gridstacks[gridIdforTab(newTabId)]
                        const existingContent = this.reactRoots[]
                        grid.removeWidget(node, false)
                        update(node, newTabId)
                        newHome.addWidget(element)
                        newTabState = null
                    } else {
                        update(node, tabId)
                    }
                }
            })
        }
    }
}

const theState = new GridstackGridsState()

export function getGridState(): GridsState {
    return theState
}