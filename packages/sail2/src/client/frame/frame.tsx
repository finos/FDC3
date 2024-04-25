import {Bin, Controls, NewPanel} from "../controls/controls"
import {Empty, Logo, Settings} from "../top/top"
import {Tabs} from "../tabs/tabs"
import * as styles from "./styles.module.css"
import {ClientState} from "../state/client"
import {Grids} from "../grid/grid"
import {Component} from "react"
import {AppDPanel} from "../appd/appd"
import {SettingsPopup} from "../popups/settings"

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
    return (
      <div className={styles.outer}>
        <div className={styles.top}>
          <Logo />
          <Empty />
          <Settings />
        </div>
        <div className={styles.middle}>
          <div className={styles.left}>
            <Tabs cs={this.props.cs} />
            <Controls>
              <NewPanel onClick={() => this.setState({popup: Popup.APPD})} />
              <Bin />
            </Controls>
          </div>
          <div className={styles.main} style={{backgroundColor: this.props.cs.getTabs()[this.props.cs.getActiveTab()].background}}>
            <Grids cs={this.props.cs} />
          </div>
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
