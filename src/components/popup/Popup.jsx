import styles from "./Popup.module.css";

const Popup = ({ error, setError }) => {
	const closePopup = () => {
		 setError(""); // reset error message to close popup
	};

	if (!error) return null;

	return (
		<div className={styles.popup}>
			<div className={styles.popupContent}>
				<p className={styles.popupText}>{error}</p>
				<button onClick={closePopup}>Zamknij</button>
			</div>
		</div>
	);
};

export default Popup;
