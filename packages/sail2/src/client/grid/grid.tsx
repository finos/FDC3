import {Component} from "react"
import {AppPanel, ClientState} from "../state/client"
import * as styles from "./styles.module.css"
import "gridstack/dist/gridstack.css"
import {GridsState} from "../state/grid"
import {GridStack, GridStackNode} from "gridstack"

export const Grids = ({cs, gs}: {cs: ClientState; gs: GridsState}) => {
  return (
    <div className={styles.grids}>
      {cs.getTabs().map((t) => {
        const panels = cs.getPanels().filter((p) => p.tabId == t.id)
        return <SimpleGrid key={t.id} items={panels} active={t.id == cs.getActiveTab().id} background={t.background} tabId={t.id} cs={cs} gs={gs} />
      })}
    </div>
  )
}

export function gridIdforTab(tabId: string): string {
  return "_gs_" + tabId
}

type SimpleGridProps = {items: AppPanel[]; active: boolean; background: string; tabId: string; cs: ClientState; gs: GridsState}

class SimpleGrid extends Component<SimpleGridProps> {
  private gridId: string = ""

  constructor(props: SimpleGridProps) {
    super(props)
    this.gridId = gridIdforTab(props.tabId)
  }

  getPanel(g: GridStackNode): AppPanel {
    return this.props.items.find((p) => p.id == g.id)!!
  }

  componentDidMount() {
    console.log("CDM")

    this.props.gs.ensureGrid(
      this.gridId,
      (g) => {
        const panel = this.getPanel(g)
        panel.x = g.x
        panel.y = g.y
        panel.w = g.w
        panel.h = g.h
        this.props.cs.updatePanel(this.getPanel(g))
      },
      (g) => this.props.cs.removePanel(this.getPanel(g).id),
      styles.grid
    )
  }

  componentDidUpdate(): void {
    console.log("CDU")
    this.props.gs.ensurePanelsInGrid()
  }

  render() {
    console.log("render")

    return (
      <div
        id={this.gridId}
        className="grid-stack"
        style={{
          display: this.props.active ? "block" : "none",
        }}
      >
        {this.props.cs
          .getPanels()
          .filter((p) => p.tabId == this.props.tabId)
          .map((i) => (
            <div key={i.id} className="grid-stack-item" gs-w={i.w} gs-h={i.h} gs-x={i.x} gs-y={i.y} id={i.id} gs-id={i.id}>
              <Content key={i.id} panel={i} />
            </div>
          ))}
      </div>
    )
  }
}

const LockIcon = () => {
  return <img src="/static/icons/control/lock.svg" className={styles.contentTitleIcon} title="Lock" />
}

const PopOutIcon = () => {
  return <img src="/static/icons/control/pop-out.svg" className={styles.contentTitleIcon} title="Pop Out" />
}

const ChooseApp = () => {
  return (
    <div className={styles.contentChoose}>
      <img src="/static/icons/control/choose-app.svg" className={styles.contentChooseIcon} title="Choose App" />
      <p className={styles.contentChooseText}>Click To Choose App</p>
    </div>
  )
}

const Content = ({panel}: {panel: AppPanel}) => {
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
