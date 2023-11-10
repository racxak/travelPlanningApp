import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth } from "../../firebase";
import styles from "./Auth.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Popup from "../popup/Popup";
import { AuthContext } from "../../context/AuthContext";
import styles1 from "../../pages/Pages.module.css"

const SignIn = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error1, setError1] = useState("");
  const navigate = useNavigate();
	const {dispatch} = useContext(AuthContext)

	const signIn = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log(userCredential);
				const user =userCredential.user
				dispatch({type:"LOGIN",payload: user})
        navigate("/twoje-podroze");
			})
			.catch((error) => {
				setError1("Błędny login lub hasło");
				console.log(error1);
			});
			// todo: poprawić errors na takie jak w addSthNew
	};


	return (
		<div className={styles.auth}>
			<Popup error={error1} setError={setError1} />
			<form className={styles.loginForm}  onSubmit={signIn}>
				<h1>Zaloguj się </h1>
				
				<label> Email </label>
				<input
					type="email"
					placeholder="jadewtrpia@gmail.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				></input>
				<label> Hasło </label>
				<input
					className={styles.password}
					type="password"
					placeholder="********"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				></input>
  
				<button className={styles1.btn} type="submit">Zaloguj</button>
       
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
