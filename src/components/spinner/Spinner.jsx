import React from 'react';
import styles from './Spinner.module.css'; 
import plane from "../../images/plane.png"
const Spinner = ({id}) => {
    return (
        <div  className={`${styles.spinner} ${id === "markers" ? styles.markers : id === "lists" ? styles.lists : ""}`}><img className={styles.img} src={plane} alt="ikona samolotu" /></div>
    );
};

export default Spinner;