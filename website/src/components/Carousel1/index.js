import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'

const Carousel1 = (props) => {
	const { children } = props

	const [currentIndex, setCurrentIndex] = useState(0)
	const [length, setLength] = useState(children.length)


	const next = () => {
		if (currentIndex < (length - 1)) {
			setCurrentIndex(prevState => prevState + 1)
		}
	}

	const prev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(prevState => prevState - 1)
		}
	}

	const hasNext = () => (currentIndex < (length - 1))

	const hasPrev = () => (currentIndex > 0)

	const prevClass = styles.leftArrow + " " + (hasPrev() ? styles.active : styles.inactive)

	const nextClass = styles.rightArrow + " " + (hasNext() ? styles.active : styles.inactive)

	// Set the length to match current children from props
	useEffect(() => {
		setLength(children.length)
	}, [children])

	return (
		<div className={styles.carouselContainer}>
			<div className={styles.carouselWrapper}>
				<div className={styles.carouselContentWrapper}>
					{
						children.map((v, i) => <div className={currentIndex == i ? styles.show : styles.hide }>{v}</div>)
					}
				</div>
			</div>
			<div className={styles.controls}>
				<button className={prevClass} onClick={prev}>
					&lt; PREVIOUS
				</button>
				<button className={nextClass} onClick={next}>
					NEXT &gt;
				</button>
			</div>
		</div>
	)
}

export default Carousel1