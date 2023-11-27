import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import styles1 from "../../pages/Pages.module.css";

const SignUp = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [success, setSucces] = useState("");
	const [errors, setErrors] = useState({});

	
	const signUp = (e) => {
		e.preventDefault();

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log(userCredential);
				setSucces(true);
			})
			.catch((error) => {
				console.log(error);
				// todo: obsługa poszczególnych errorów
			});
	};

	const validateForm = () => {
		let newErrors = {};
		if (!email) {
			newErrors.email = "Email jest wymagany";
		}
		if (!password || password.length < 6) {
			newErrors.password = "Hasło jest wymagane (co najmniej 6 znaków)";
		}
		return newErrors;
	};

	return (
		<div className={styles.auth}>
			<form className={styles.registerForm} onSubmit={signUp}>
				{/* todo: nazwa użytkowinka */}
				<h1>Zarejestruj się </h1>
				<label> Email </label>
				<input
					className={errors.email ? styles1.errorInput : ""}
					type="email"
					placeholder="jadewtrpia@gmail.com"
					value={success ? "" : email}
					onChange={(e) => setEmail(e.target.value)}
				></input>
				{errors.email && (
					<span className={styles1.errorMessage}>{errors.email}</span>
				)}
				<label> Hasło </label>
				<input
					className={errors.password ? styles1.errorInput : ""}
					type="password"
					placeholder="********"
					value={success ? "" : password}
					onChange={(e) => setPassword(e.target.value)}
				></input>

				{errors.password && (
					<span className={styles1.errorMessage}>{errors.password}</span>
				)}

				{success && (
					<span className={styles.success}>
						{
							"Cieszymy się, że do nas dołączyłeś! Zaloguj się, by rozpocząć planowanie pierwszej podróży! "
						}
					</span>
				)}

				<div style={{ height: "3rem" }}></div>
			
				<button
					className={`${styles1.btn} ${styles.loginAndRegisterBtnWidth}`}
					type="submit"
				>
					Zarejestruj
				</button>
			</form>
			<button
				className={styles.linkBtn}
				onClick={() => props.onFormSwitch("login")}
			>
				{" "}
				Masz już konto? Zaloguj się
			</button>
		</div>
	);
};

export default SignUp;
