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

	// Set the length to match current children from props
	useEffect(() => {
		setLength(children.length)
	}, [children])

	return (
		<div className={styles.carouselContainer}>
			<div className={styles.carouselWrapper}>
				<div className={styles.carouselContentWrapper}>
					<div className={styles.carouselContent} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
						{children}
					</div>
				</div>
			</div>
			<div className={styles.controls}>
				{
					currentIndex > 0 &&
					<button className={styles.leftArrow} onClick={prev}>
						&lt;
					</button>
				}				{
					currentIndex < (length - 1) &&
					<button className={styles.rightArrow} onClick={next}>
						&gt;
					</button>
				}
				</div>
		</div>
	)
}

export default Carousel1