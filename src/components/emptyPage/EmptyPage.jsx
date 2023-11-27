import React from "react";
import styles from "./EmptyPage.module.css"
const EmptyPage = () => {
  return <div className={styles.emptyPage}><p>Ta strona jest pusta... ale nie musi!</p>
  <p>Naciśnij + by ją zapełnić :{")"} </p></div>;
};

export default EmptyPage;