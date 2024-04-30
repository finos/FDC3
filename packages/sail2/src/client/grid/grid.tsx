import {Component} from "react"
import {AppPanel, ClientState} from "../state/client"
import * as styles from "./styles.module.css"
import "gridstack/dist/gridstack.css"
import {GridsState} from "../state/grid"
import {GridStackNode} from "gridstack"

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

  removePanel(g: GridStackNode) {
    const p = this.getPanel(g)
    this.props.gs.removePanel(p)
    this.props.cs.removePanel(p.id)
  }

  updatePosition(g: GridStackNode) {
    const panel = this.getPanel(g)
    panel.x = g.x
    panel.y = g.y
    panel.w = g.w
    panel.h = g.h
    this.props.cs.updatePanel(panel)
  }

  componentDidMount() {
    console.log("CDM")

    this.props.gs.ensureGrid(
      this.gridId,
      (w) => this.updatePosition(w),
      (ap) => <Content panel={ap} close={() => this.removePanel(ap)} />,
      (w) => this.removePanel(w),
      styles.grid
    )

    this.props.gs.ensurePanelsInGrid(this.gridId, this.props.items)
  }

  componentDidUpdate(): void {
    console.log("CDU")
    this.props.gs.ensurePanelsInGrid(this.gridId, this.props.items)
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
      ></div>
    )
  }
}

const LockIcon = () => {
  return <img src="/static/icons/control/lock.svg" className={styles.contentTitleIcon} title="Lock" />
}

const PopOutIcon = () => {
  return <img src="/static/icons/control/pop-out.svg" className={styles.contentTitleIcon} title="Pop Out" />
}

const CloseIcon = ({action}: {action: () => void}) => {
  return <img src="/static/icons/control/close.svg" className={styles.contentTitleIcon} title="Pop Out" onClick={() => action()} />
}

const AppFrame = ({panel}: {panel: AppPanel}) => {
  return <iframe src={panel.url} className={styles.iframe} id={"iframe_" + panel.id} />
}

const Content = ({panel, close}: {panel: AppPanel; close: () => void}) => {
  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <div className={styles.contentTitle}>
          <CloseIcon action={close} />
          <p className={styles.contentTitleText}>
            <span className={styles.contentTitleTextSpan}>{panel.title}</span>
          </p>
          <LockIcon />
          <PopOutIcon />
        </div>
        <div className={styles.contentBody}>{panel.url ? <AppFrame panel={panel} /> : <div />}</div>
      </div>
    </div>
  )
}
