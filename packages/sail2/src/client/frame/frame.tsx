import {Bin, Controls, NewPanel} from "../controls/controls"
import {Logo, Settings} from "../top/top"
import {Tabs} from "../tabs/tabs"
import * as styles from "./styles.module.css"
import {ClientState, getClientState} from "../state/client"
import {Component} from "react"
import {AppDPanel} from "../appd/appd"
import {SettingsPopup} from "../popups/settings"
import {Content, Grids} from "../grid/grid"
import {GridsStateImpl, GridsState} from "../grid/gridstate"

enum Popup {
  NONE,
  APPD,
  SETTINGS,
}

interface FrameProps {
  cs: ClientState
}

interface FrameState {
  popup: Popup
}

const CONTAINER_ID = "container-id"

export class Frame extends Component<FrameProps, FrameState> {
  private gs: GridsState = new GridsStateImpl(CONTAINER_ID, (ap, id) => <Content panel={ap} cs={this.props.cs} id={id} />, getClientState())

  constructor(p: FrameProps) {
    super(p)
    this.state = {
      popup: Popup.NONE,
    }
  }

  render() {
    const activeTab = this.props.cs.getActiveTab()

    return (
      <div className={styles.outer}>
        <div className={styles.top}>
          <Logo />
          <Settings />
        </div>
        <div className={styles.left}>
          <Tabs cs={this.props.cs} />
          <Controls>
            <NewPanel onClick={() => this.setState({popup: Popup.APPD})} />
            <Bin />
          </Controls>
        </div>
        <div className={styles.main} style={{backgroundColor: activeTab!!.background}}>
          <Grids cs={this.props.cs} gs={this.gs} id={CONTAINER_ID} />
        </div>
        {this.state?.popup == Popup.APPD ? (
          <AppDPanel
            key="appd"
            cs={this.props.cs}
            closeAction={() =>
              this.setState({
                popup: Popup.NONE,
              })
            }
          />
        ) : null}
        {this.state?.popup == Popup.SETTINGS ? <SettingsPopup cs={this.props.cs} /> : null}
      </div>
    )
  }
}
