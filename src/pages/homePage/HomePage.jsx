import React from "react";
import styles from "./Home.module.css";
import styles1 from "../Pages.module.css"
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
const HomePage = () => {
  const homeButtons = [];

	return (
  <div className={styles.blur}>
        <Navbar buttons={homeButtons} />
        <div className={styles.home}>
        <Link className={styles.fillAll} to="/logowanie" >
             <p className={styles.textFocusIn}>Rozpocznijmy przygodę</p>
         
        </Link>
        </div>
  </div>
  )
};

export default HomePage;
