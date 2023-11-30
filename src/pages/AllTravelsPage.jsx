import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import AuthUser from "../components/auth/AuthUser";
import {
	collection,
	addDoc,
	doc,
	updateDoc,
	query,
	where,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import styles from "./Pages.module.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddNote from "../components/AddNote";
import {AiOutlineMore } from "react-icons/ai";
import MoreWindow from "../components/MoreWindow";
import { useNavigate } from "react-router-dom";
import EmptyPage from "../components/emptyPage/EmptyPage";
import Spinner from "../components/spinner/Spinner";


const AllTravelsPage = ({ inputs }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [notes, setNotes] = useState([]);

	const [formData, setFormData] = useState({
		title: "",
		date: "",
	});

	const [editingNoteId, setEditingNoteId] = useState(null);
	const [editedNoteTitle, setEditedNoteTitle] = useState("");
	const [editedNoteDate, setEditedNoteDate] = useState("");
	const [inputErrors, setInputErrors] = useState({});
	const { currentUser } = useContext(AuthContext);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [openMoreId, setOpenMoreId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	const allTravelsButtons = [
		{ label: "Podróże", path: "/twoje-podroze" },
		{ label: "Dziennik", path: "/dziennik" },
		{ UserComponent: <AuthUser />, path: "#" },
	];

	const handleEdit = (note) => { 
    setEditingNoteId(note.id);
    setEditedNoteTitle(note.title);
    setEditedNoteDate(note.date);
};

const filteredNotes = notes.filter(note =>
	note.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const saveChanges = async (id) => {
			try {
					const noteDocRef = doc(db, "allJournals", editingNoteId);
					await updateDoc(noteDocRef, {
							title: editedNoteTitle,
							date: editedNoteDate,
					});

					setNotes(prevNotes =>
							prevNotes.map(note =>
									note.id === editingNoteId
											? { ...note, title: editedNoteTitle, date: editedNoteDate }
											: note
							)
					);
					setEditingNoteId(null);
					setEditedNoteTitle("");
					setEditedNoteDate("");

			} catch (error) {
					console.log(error);
			}
};

	const closePopup = () => {
		setIsPopupOpen(false);
		setFormData({
			title: "",
			date: "",
		});
		setInputErrors({});
	};

	useEffect(() => {
		const unsub = onSnapshot(
			query(
				collection(db, "allJournals"),
				where("userUid", "==", currentUser.uid)
			),
			(snapShot) => {
				let list = [];
				snapShot.docs.forEach((doc) => {
					list.push({ id: doc.id, ...doc.data() });
				});
				setNotes(list);
				setLoading(false);
			},
			(error) => {
				console.log(error);
			}
		);
		return () => {
			unsub();
		};
	}, []);

	const handleAdd = async (e) => {
		e.preventDefault();

		let hasEmptyFields = false;
		let errors = {};
		inputs.forEach((input) => {
			if (!formData[input.id]) {
				hasEmptyFields = true;
				errors[input.id] = "Pole jest wymagane";
			}
		});

		if (hasEmptyFields) {
			setInputErrors(errors);
			return; 
		} else {
			setInputErrors({}); 
		}

		try {
			await addDoc(collection(db, "allJournals"), {
				...formData,
				userUid: currentUser.uid,
			});
			closePopup();
		} catch (err) {
			console.log(err);
		}
	};

	const handleDivClick = (note) => {
		const path = `/twoje-podroze/${note.id}`;
		navigate(path);
	};

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setFormData((prevState) => ({ ...prevState, [id]: value }));
	};

	return (
	<div>
	<Navbar buttons={allTravelsButtons}></Navbar>
		<div className={styles.pageContainer}>

			<div className={styles.addNew}>
				<label> Rozpocznij nową podróż</label>
				<button className={styles.plusBtn} onClick={() => setIsPopupOpen(true)}>
					<AiOutlinePlus></AiOutlinePlus>
				</button>
			</div>
			<div className={styles.search}>
			<input
  type="text"
  placeholder="Wyszukaj..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className={styles.searchBar}
/>		
			</div>

			<AddNote isOpen={isPopupOpen} closePopup={closePopup}>
				<div>
					<form onSubmit={handleAdd}>
						{inputs.map((input) => (
							<div key={input.id}>
								<input
									id={input.id}
									type={input.type}
									placeholder={input.placeholder}
									className={`${
										inputErrors[input.id] ? styles.errorInput : ""
									} ${
										input.id === "title" ? styles.inputTitle : styles.inputNotes
									}`}
									onChange={handleInput}
									value={formData[input.id] || ""}
								/>
								{inputErrors[input.id] && (
									<span className={styles.errorMessage}>
										{inputErrors[input.id]}
									</span>
								)}
							</div>
						))}

						<div className={styles.info}>
							<label className={styles.infoLabel}>
								{" "}
								Po ustaleniu nazwy podróży i daty, naciśnij w panel by dodać
								szczegóły podróży{" "}
							</label>
						</div>
						<div className={styles.addBtnContainer}>
							<button className={styles.btn} type="submit">
								Dodaj
							</button>
						</div>
					</form>
				</div>
			</AddNote>

			{notes.length===0 && isPopupOpen===false&& loading===false && <EmptyPage/>}
			{isPopupOpen===false && loading===true && <Spinner/>}
		
			<div
				className={`${styles.scroller} ${
					isPopupOpen ? styles.scrollerShrinked : ""
				}`}
			>
				{Array.isArray(filteredNotes) &&
					filteredNotes.map((note) => (
						<div key={note.id} className={`${styles.notes} ${styles.travels}`}>
							  {editingNoteId !== note.id && (
							<button
								className={
									openMoreId === note.id ? styles.moreBtnBlock : styles.moreBtn
								}
								onClick={() =>
									openMoreId === note.id
										? setOpenMoreId(null)
										: setOpenMoreId(note.id)
								}
							>
								<AiOutlineMore />
							</button>
							)}
							{openMoreId === note.id && (
								<MoreWindow
									isOpen={openMoreId}
									setIsOpen={setOpenMoreId}
									id={note.id}
									notes={notes}
									setNotes={setNotes}
									note={note}
									collectionPath={`allJournals`}
									isEditing={editingNoteId === note.id}
									setIsEditing={(isEditing) => {
										handleEdit(note);
									}}
								/>
							)}
							 {editingNoteId === note.id ? (
            <div className= {styles.divClick}>
							<h2 className={`${styles.noteTitle} ${styles.noteContent}`}>
                <input
								type="text"
								className={styles.reset}
                    value={editedNoteTitle}
                    onChange={(e) => setEditedNoteTitle(e.target.value)}
                />
								</h2>
								<span className={styles.editSpan}>
                <input
								type="date"
									  className={styles.reset}
                    value={editedNoteDate}
                    onChange={(e) => setEditedNoteDate(e.target.value)}
                />
                <button onClick={saveChanges}
								className={styles.btn}>Zapisz</button>
								</span>
            </div>
        ) : (
						<div 
						className= {styles.divClick}
						onClick={() => handleDivClick(note)}>
							<h2 className={`${styles.noteTitle} ${styles.noteContent}`}>
								{note.title}
							</h2>
							<span>{note.date}</span>
						</div>
        )}
						</div>
					))}
			</div>
		</div>
		</div>
	);
};

export default AllTravelsPage;
