import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth } from "../../firebase";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles1 from "../../pages/Pages.module.css";

const SignIn = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const signIn = (e) => {
		e.preventDefault();

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log(userCredential);
				const user = userCredential.user;
				dispatch({ type: "LOGIN", payload: user });
				navigate("/twoje-podroze");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const validateForm = () => {
		let newErrors = {};
		if (!email) newErrors.email = "Email jest wymagany";
		if (!password) newErrors.password = "Hasło jest wymagane";
		return newErrors;
	};

	return (
		<div className={styles.auth}>
			<form className={styles.loginForm} onSubmit={signIn}>
				<h1>Zaloguj się </h1>

				<label> Email </label>
				<input
					className={errors.email ? styles1.errorInput : ""}
					required type="email"
					placeholder="jadewtrpia@gmail.com"
					value={email}
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
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				></input>
				{errors.password && (
					<span className={styles1.errorMessage}>{errors.password}</span>
				)}
				<div style={{ height: "3rem" }}></div>
				<button
					className={`${styles1.btn} ${styles.loginAndRegisterBtnWidth}`}
					type="submit"
				>
					Zaloguj
				</button>
			</form>
			<button
				className={styles.linkBtn}
				onClick={() => props.onFormSwitch("register")}
			>
				Nie masz jeszcze konta? Zarejestruj się
			</button>
		</div>
	);
};

export default SignIn;
