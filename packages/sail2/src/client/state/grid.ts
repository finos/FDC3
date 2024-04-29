import { GridStack, GridStackNode, GridStackPosition } from "gridstack"
import { AppPanel } from "./client"
import { gridIdforTab } from "../grid/grid"
import { grids } from "../grid/styles.module.css"

export interface GridsState {

    enqueuePanel(ap: AppPanel): void

    ensurePanelsInGrid(): void

    ensureGrid(id: string, update: (ap: GridStackNode) => void, remove: (ap: GridStackNode) => void, cssClass: string): void

}



class GridstackGridsState implements GridsState {

    private readonly gridstacks: { [id: string]: GridStack } = {}

    private panelToAdd: AppPanel | null = null

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

    enqueuePanel(ap: AppPanel) {
        this.panelToAdd = ap
        const gridId = gridIdforTab(ap.tabId)
        const grid = this.gridstacks[gridId]
        this.findEmptyArea(ap, grid)
    }

    ensurePanelsInGrid(): void {
        if (this.panelToAdd) {
            const p = this.panelToAdd
            const gridId = gridIdforTab(p.tabId)
            const grid = this.gridstacks[gridId]
            const el = document.getElementById(p.id)
            const widget = grid.makeWidget(el!!)
            grid.addWidget(widget)
            this.panelToAdd = null
        }

        // Object.keys(this.gridstacks).forEach(id => {
        //     const gridId = gridIdforTab(id)
        //     const el = document.getElementById()
        //     const state = gs.getGridItems()
        //     gs.update()
        // })
    }

    ensureGrid(id: string, update: (ap: GridStackNode) => void, remove: (ap: GridStackNode) => void, cssClass: string): void {
        if (!this.gridstacks[id]) {
            const grid = GridStack.init(
                {
                    removable: "#trash",
                    acceptWidgets: true,
                },
                id
            )
            this.gridstacks[id] = grid

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