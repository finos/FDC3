import { GridStack, GridStackNode, GridStackWidget } from "gridstack"
import { AppPanel } from "./client"
import { ReactElement } from "react"
import { gridIdforTab } from "../grid/grid"
import { Root, createRoot } from "react-dom/client"

export interface GridsState {

    removePanel(ap: AppPanel): void

    ensurePanelsInGrid(id: string, items: AppPanel[]): void

    ensureGrid(
        id: string,
        update: (gn: GridStackNode) => void,
        render: (ap: AppPanel) => ReactElement,
        remove: (gn: GridStackNode) => void,
        cssClass: string): void
}

class GridstackGridsState implements GridsState {

    private readonly gridstacks: { [id: string]: GridStack } = {}
    private readonly renderers: { [id: string]: (ap: AppPanel) => ReactElement } = {}
    private readonly reactRoots: { [id: string]: Root } = {}

    findEmptyArea(ap: AppPanel, grid: GridStack) {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 12 - (ap.w ?? 1); x++) {
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
        const el = document.getElementById(ap.id)
        const root = this.reactRoots['content_' + ap.id]
        root.unmount()
        grid.removeWidget(el!!)
    }

    ensurePanelsInGrid(gridId: string, items: AppPanel[]): void {
        const grid = this.gridstacks[gridId]
        items.forEach(p => {
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

    ensureGrid(id: string, update: (ap: GridStackNode) => void, render: (ap: AppPanel) => ReactElement, remove: (gn: GridStackNode) => void, cssClass: string): void {
        if (!this.gridstacks[id]) {
            const grid = GridStack.init(
                {
                    removable: "#trash",
                    acceptWidgets: true,
                },
                id
            )
            this.gridstacks[id] = grid
            this.renderers[id] = render

            const gridEl = document.getElementById(id)!!

            gridEl.classList.add(cssClass)

            grid.on("dragstop", (_event, element) => {
                const node = element.gridstackNode
                if (node) {
                    console.log(`you just dragged node #${node!!.id} to ${node!!.x},${node!!.y} – good job!`)
                    update(node)
                }
            })

            grid.on("resizestop", (_event, element) => {
                const node = element.gridstackNode
                if (node) {
                    console.log(`you just resized node #${node!!.id} to ${node!!.w},${node!!.h} – good job!`)
                    update(node)
                }
            })

            grid.on("removed", (_event, items) => {
                items.forEach((i) => remove(i))
            })
        }
    }



}


const theState = new GridstackGridsState()

export function getGridState(): GridsState {
    return theState
}