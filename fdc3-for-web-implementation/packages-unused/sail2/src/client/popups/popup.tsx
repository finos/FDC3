import {Component, ReactNode} from "react"
import * as styles from "./styles.module.css"
import {Logo} from "../top/top"

type PopupProps = {
  button: ReactNode
  area: ReactNode
  closeAction: () => void
  title: string
}

export class Popup extends Component<PopupProps> {
  componentDidMount(): void {
    setTimeout(() => {
      document.getElementById("backdrop")?.setAttribute("data-loaded", "true")
    }, 10)
  }

  render() {
    return (
      <div>
        <div id="backdrop" className={styles.popup}>
          <div id="popup" className={styles.popupInner}>
            <div className={styles.popupTitle}>
              <p className={styles.popupTitleText}>{this.props.title}</p>
              <Logo />
            </div>
            <div className={styles.popupArea}>{this.props.area}</div>
            <div className={styles.popupButtons}>
              <PopupButton onClick={() => this.props.closeAction()} text="Cancel" disabled={false} />
              {this.props.button}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const PopupButton = ({text, onClick, disabled}: {text: string; onClick: () => void; disabled: boolean}) => {
  return (
    <button id="cancel" className={styles.popupButton} onClick={() => onClick()} disabled={disabled}>
      {text}
    </button>
  )
}
