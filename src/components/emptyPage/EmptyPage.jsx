import React from "react";
import styles from "./EmptyPage.module.css";
const EmptyPage = ({id}) => {
	return (
		 
    <div className={`
    ${styles.emptyPage} 
    ${id === "markers" ? styles.markers : ""} 
    ${id === "lists" ? styles.lists : ""}
`}>
      {id === "markers" ?
        <>
			  <p>Naciśnij na mapę, by zapisać pierwsze miejsce warte odwiedzenia</p>
        </>
        : id === "lists" ? 
        <>
        <p>Nic jeszcze tu nie ma</p>
        <p>Naciśnij + i stwórz swoje pierwsze listy, by o niczym nie zapomnieć </p>
        </>
        :
      <>
			<p>Ta strona jest pusta... ale nie musi!</p>
			<p>Naciśnij + by ją zapełnić :{")"} </p>
      </>
   

    }
		</div>
	);
};

export default EmptyPage;
