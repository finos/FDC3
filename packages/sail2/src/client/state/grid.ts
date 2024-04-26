import { GridStack, GridStackNode } from "gridstack"
import { AppPanel } from "./client"
import { gridIdforTab } from "../grid/grid"

export interface GridsState {

    enqueuePanel(ap: AppPanel): void

    ensurePanelsInGrid(): void

    ensureGrid(id: string, update: (ap: GridStackNode) => void, remove: (ap: GridStackNode) => void, cssClass: string): void

}



class GridstackGridsState implements GridsState {

    private readonly gridstacks: { [id: string]: GridStack } = {}

    private panelToAdd: AppPanel | null = null

    enqueuePanel(ap: AppPanel) {
        this.panelToAdd = ap
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