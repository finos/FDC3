import {Component} from "react"
import {Icon} from "../icon/icon"
import {getServerState} from "../state/server"
import * as styles from "./styles.module.css"
import {DirectoryApp} from "da-server"
import {ClientState} from "../state/client"
import {Popup, PopupButton} from "../popups/popup"

const DEFAULT_ICON = "/static/icons/control/choose-app.svg"

function getIcon(a: DirectoryApp) {
  const icons = a.icons ?? []
  if (icons.length > 0) {
    return icons[0].src
  } else {
    return DEFAULT_ICON
  }
}

type AppPanelProps = {closeAction: () => void; cs: ClientState}

type AppPanelState = {
  chosen: DirectoryApp | null
  apps: DirectoryApp[]
}

export class AppDPanel extends Component<AppPanelProps, AppPanelState> {
  constructor(props: AppPanelProps) {
    super(props)
    this.state = {
      chosen: null,
      apps: [],
    }
  }

  componentDidMount = () => {
    getServerState()
      .getApplications()
      .then((apps) => {
        //console.log("loaded - ready to display")
        this.setState({
          chosen: null,
          apps,
        })
      })
  }

  setChosen(app: DirectoryApp) {
    console.log("state changed " + app.appId)
    this.setState({
      apps: this.state.apps,
      chosen: app,
    })
  }

  render() {
    const app = this.state.chosen

    return (
      <Popup
        key="AppDPopup"
        title="Start Application"
        area={
          <div className={styles.appDContent}>
            <div className={styles.appDApps}>
              {this.state.apps.map((a) => (
                <div key={a.appId} className={`${styles.appDApp} ${a == app ? styles.selected : ""}`} onClick={() => this.setChosen(a)}>
                  <Icon image={getIcon(a)} text={a.title} dark={false} />
                </div>
              ))}
            </div>

            <div className={styles.appDDetail}>
              {app ? (
                <div className={styles.appDInfo}>
                  <h2>{app.title}</h2>
                  <p>{app.description}</p>
                  <ul>
                    {app.categories?.map((c) => (
                      <li>{c}</li>
                    ))}
                  </ul>
                  <div className={styles.appDScreenshots}>
                    {app.screenshots?.map((s) => (
                      <img src={s.src} title={s.label} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        }
        button={
          <PopupButton
            text="open"
            disabled={this.state.chosen == null}
            onClick={() => {
              if (this.state.chosen) {
                const ap = this.props.cs.open(this.state.chosen)
                if (ap) {
                  this.props.closeAction()
                } else {
                  alert("Not a web app")
                }
              }
            }}
          />
        }
        closeAction={() => this.props.closeAction()}
      />
    )
  }
}
