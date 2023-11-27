import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Link, useActionData } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import styles1 from "../Pages.module.css";


const HomePage = () => {
	const homeButtons = [];
	const texts = [
		"Proste planowanie podróży",
		"Prowadzenie dziennika podróży",
		"Wszystkie listy w jednym miesjcu",
		"Proste wprowadzanie zmian do stworzonych planów",
	];

	const [activeIndex, setActiveIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	const prevText = () => {
    setActiveIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : texts.length - 1);
};

const nextText = () => {
    setActiveIndex(prevIndex => prevIndex < texts.length - 1 ? prevIndex + 1 : 0);
};


useEffect(() => {
   
	setTimeout(() => { nextText() }, 6000);
}
)


	return (
		<div>
			<Navbar buttons={homeButtons} />
			<div className={styles.home}></div>

			<div className={styles.wrapper}>
				<div className={styles.typing}>Gotowy by rozpocząć podróż? </div>

				<div className={styles.slider}>
					<button onClick={prevText} id="left">
						←
					</button>
					
					<p className={ styles.visible}>{texts[activeIndex]}</p>

					<button onClick={nextText} id="right">
						→
					</button>
				</div>		
				
					<Link className={`${styles.link} ${styles.btnNextPage}`} to="/logowanie">
						Rozpocznij
				</Link>
			</div>
		</div>
	);
};

export default HomePage;
