import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

const HomePage = () => {
	const homeButtons = [];
	const [loading, setLoading] = useState(true);
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
    const highResImage = new Image();
    highResImage.src =  'https://coolwallpapers.me/picsup/5227656-lake-mountain-boat-cloud-landscape-dolomite-wooden-wildsee-water-tyrol-turquoise-trentino-tree-travel-tranquil-tourism-summer-sudtirol-sky-ship-public-domain-images.jpg'; 

    highResImage.onload = () => {
        document.getElementById('backgroundContainer').style.backgroundImage = `url('${highResImage.src}')`;
    
};
}
)
	return (
		<div>
			<Navbar buttons={homeButtons} />
			<div id= "backgroundContainer" className={styles.home}></div>

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
