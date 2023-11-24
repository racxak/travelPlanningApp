import React, { useState } from "react";
import styles from "./MoreWindow.module.css";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const MoreWindow = ({isOpen, setIsOpen, id, notes, setNotes,collectionPath,  setIsEditing}) => {
 
const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, collectionPath, id));
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsOpen(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.moreWindow}>
      <>
          <button onClick={handleEdit} className={styles.styleBtn}>
            Edytuj
          </button>
          <button onClick={handleDelete} className={`${styles.styleBtn} ${styles.delete}`}>
            Usuń
          </button>
        </>
      
    </div>
  );
};

export default MoreWindow;
