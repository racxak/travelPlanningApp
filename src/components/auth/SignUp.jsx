import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import styles from "./Auth.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Popup from "../popup/Popup";
import styles1 from "../../pages/Pages.module.css"


const SignUp = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSucces]=useState("");
	const [error1, setError1] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setSucces("Super, że do nas dołączyłeś! Zaloguj się, by rozpocząć planowanie pierwszej podróży! ");
        // todo: po rejestracji automatyczny powrót do logowania props.onFormSwitch('login')
      })
      .catch((error) => {
        // todo: error przechwytujący że konto już istnieje
        setError1("Upsss... coś poszło nie tak, spróbuj jeszcze raz!");
				console.log(error1);
      });
  };


  return (
    <div className={styles.auth}>
      <Popup error={success} setError={setSucces} />
      <Popup error={error1} setError={setError1} />
      <form className={styles.registerForm} onSubmit={signUp}>
        {/* todo: nazwa użytkowinka */}
        <h1>Zarejestruj się </h1>
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
          
				<button className={styles1.btn} type="submit">Zarejestruj</button>
       
      </form>
      <button className={styles.linkBtn} onClick={()=>props.onFormSwitch('login')}> Masz już konto? Zaloguj się</button>
    </div>
  );
};

export default SignUp;