import React, { useState } from "react";
import styles from "./Navbar.module.css";
import {
	AiOutlineMenu,
	AiOutlineClose,
} from "react-icons/ai";
import { Link } from "react-router-dom";

export function Navbar({buttons}) {
	const [nav, setNav] = useState(false);


	return (
		<header className={`${styles.navbar} container`}>
				<p className={styles.logo}>TRAVELSTORY</p>
				<nav>
					<ul
						className={
							nav ? [styles.menu, styles.active].join(" ") : [styles.menu]
						}
					>
					{buttons && buttons.map((button, index) => (
													<li key={index}>
															 <Link to={button.path} className={button.label ? `${styles.textLink}` : ''}>
																	{button.label ? button.label : button.UserComponent}
															</Link>
													</li>
											))}
					</ul>
				</nav>
				<div onClick={() => setNav(!nav)} className={styles.mobile_btn}>
					{nav ? <AiOutlineClose className ={styles.navBtn} size={25} /> : <AiOutlineMenu  className ={styles.navBtn} size={25} />}
				</div>
		</header>
	);
}

export default Navbar;
