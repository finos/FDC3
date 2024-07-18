import * as styles from "./styles.module.css"

export const Icon = ({image, text, dark}: {image: string; text: string; dark: boolean}) => {
  return (
    <div className={styles.icon} data-dark={dark}>
      <img src={image} className={styles.iconImage} />
      <div className={styles.iconName}>
        <span className={styles.iconNameText}>{text}</span>
      </div>
    </div>
  )
}
