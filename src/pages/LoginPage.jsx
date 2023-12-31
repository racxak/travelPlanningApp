import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect,useContext } from "react";
import { auth } from "../firebase";
import Navbar from "../components/navbar/Navbar";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Pages.module.css";

const LoginPage = () => {
	const [currentForm, setCurrentForm] = useState("login");
	const {dispatch} = useContext(AuthContext)

	useEffect(() => {
		dispatch({type:"LOGOUT",payload: null});
	}, []);

	const toggleForm = (formName) => {
		setCurrentForm(formName);
	};

	const loginButtons = [
		{ label : "Wróć do strony startowej", path: "/" },
	];
	
	return (
	
		<div>
		 <Navbar buttons={loginButtons} />
		 <div className={styles.pageContainer}>
			{currentForm === "login" ? <SignIn onFormSwitch={toggleForm} /> : <SignUp onFormSwitch={toggleForm} />}
		</div>
		</div>
	);
};

export default LoginPage;
