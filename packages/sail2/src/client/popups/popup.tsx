import {ReactNode} from "react"
import * as styles from "./styles.module.css"
import {Logo} from "../top/top"

type PopupProps = {
  button: ReactNode
  area: ReactNode
  closeAction: () => void
  title: string
  loaded: boolean
}

export const Popup = (p: PopupProps) => {
  return (
    <div key="back" className={`${styles.popup} ${p.loaded ? styles.ready : styles.loading}`}>
      <div key="popup" className={styles.popupInner}>
        <div className={styles.popupTitle}>
          <p className={styles.popupTitleText}>{p.title}</p>
          <Logo />
        </div>
        <div className={styles.popupArea}>{p.area}</div>
        <div className={styles.popupButtons}>
          <PopupButton onClick={() => p.closeAction()} text="Cancel" disabled={false} />
          {p.button}
        </div>
      </div>
    </div>
  )
}

export const PopupButton = ({text, onClick, disabled}: {text: string; onClick: () => void; disabled: boolean}) => {
  return (
    <button id="cancel" className={styles.popupButton} onClick={() => onClick()} disabled={disabled}>
      {text}
    </button>
  )
}
