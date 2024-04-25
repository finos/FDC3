import {ReactNode} from "react"
import * as styles from "./styles.module.css"

// const Start = () => {
//     return (<div className={styles.control}>
//         <img src="/static/icons/control/start.svg" title="Add App" className={styles.controlImage} />
//     </div>
//     )
// }

export const Bin = () => {
  return (
    <div className={styles.control} id="trash">
      <img src="/static/icons/control/bin.svg" title="Remove App" className={styles.controlImage} />
    </div>
  )
}

export const NewPanel = ({onClick}: {onClick: () => void}) => {
  return (
    <div className={styles.control}>
      <img src="/static/icons/control/add.svg" title="Add Tab" className={styles.controlImage} onClick={onClick} />
    </div>
  )
}

export const Controls = ({children}: {children: ReactNode}) => {
  return <div className={styles.controls}>{children}</div>
}
