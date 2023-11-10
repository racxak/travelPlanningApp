import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight} from "react-icons/ai";
import styles from "../navbar/Navbar.module.css"


const AuthUser = () => {
	const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

	useEffect(() => {
		const listen = onAuthStateChanged(auth, (user) => {
			if (user) {
				setAuthUser(user);
			} else {
				setAuthUser(null);
			}
		});

		return () => {
			listen();
		};
	}, []);

	const userSignOut = () => {
		signOut(auth)
			.then(() => {
				console.log("sign out successfull");
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className={styles.logOut}>
			{authUser ? ( 
				 <React.Fragment>
					<p className={styles.user}>{authUser.email}</p>
					<button className={styles.logOutBtn} onClick={userSignOut}>Wyloguj <AiOutlineArrowRight></AiOutlineArrowRight></button>
				</React.Fragment>
			) : (
        navigate("/logowanie")
			)}
		</div>
	);
};

export default AuthUser;
