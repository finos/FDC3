import {Bin, Controls, NewPanel} from "../controls/controls"
import {Logo, Settings} from "../top/top"
import {Tabs} from "../tabs/tabs"
import * as styles from "./styles.module.css"
import {ClientState} from "../state/client"
import {Grids} from "../grid/grid"
import {Component} from "react"
import {AppDPanel} from "../appd/appd"
import {SettingsPopup} from "../popups/settings"
import {getGridState} from "../state/grid"

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

export class Frame extends Component<FrameProps, FrameState> {
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
          <Grids cs={this.props.cs} gs={getGridState()} />
        </div>
        {this.state?.popup == Popup.APPD ? (
          <AppDPanel
            key="appd"
            cs={this.props.cs}
            gs={getGridState()}
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
