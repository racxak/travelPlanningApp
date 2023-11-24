import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import AuthUser from "../components/auth/AuthUser";
import {
	collection,
	addDoc,
	query,
	where,
	onSnapshot,
	doc,
	updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import styles from "./Pages.module.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddNote from "../components/AddNote";
import { AiOutlineClose, AiOutlineMore } from "react-icons/ai";
import MoreWindow from "../components/MoreWindow";

const TravelersJournal = ({ inputs, title }) => {
	const [notes, setNotes] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		date: "",
		note: "",
	});

	const [editingNoteId, setEditingNoteId] = useState(null);
	const [editedNoteTitle, setEditedNoteTitle] = useState("");
	const [editedNoteDate, setEditedNoteDate] = useState("");
	const [editedNoteContent, setEditedNoteContent] = useState("");

	const [inputErrors, setInputErrors] = useState({});
	const { currentUser } = useContext(AuthContext);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [openMoreId, setOpenMoreId] = useState(null);

	const travelersJournalButtons = [
		{ label: "Podróże", path: "/twoje-podroze" },
		{ label: "Dziennik", path: "/dziennik" },
		{ UserComponent: <AuthUser />, path: "#" },
	];

	const handleEdit = (note) => { 
    setEditingNoteId(note.id);
    setEditedNoteTitle(note.title);
    setEditedNoteDate(note.date);
    setEditedNoteContent(note.note);
};

const saveChanges = async (id) => {
	try {
			const noteDocRef = doc(db, "journalNotes", editingNoteId);
			await updateDoc(noteDocRef, {
					title: editedNoteTitle,
					date: editedNoteDate,
			});

			setNotes(prevNotes =>
					prevNotes.map(note =>
							note.id === editingNoteId
									? { ...note, title: editedNoteTitle, date: editedNoteDate, note: editedNoteContent }
									: note
					)
			);
			setEditingNoteId(null);
			setEditedNoteTitle("");
			setEditedNoteDate("");
			setEditedNoteContent("");

	} catch (error) {
			console.log(error);
	}
};

	const closePopup = () => {
		setIsPopupOpen(false);
		setFormData({
			title: "",
			date: "",
			note: "",
		});
		setInputErrors({});
	};

	useEffect(() => {
		const unsub = onSnapshot(
			query(
				collection(db, "journalNotes"),
				where("userUid", "==", currentUser.uid)
			),
			(snapShot) => {
				let list = [];
				snapShot.docs.forEach((doc) => {
					list.push({ id: doc.id, ...doc.data() });
				});
				setNotes(list);
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
			await addDoc(collection(db, "journalNotes"), {
				...formData,
				userUid: currentUser.uid,
			});
			closePopup();
		} catch (err) {
			console.log(err);
		}
	};

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setFormData((prevState) => ({ ...prevState, [id]: value }));
	};

	return (
		<div>
			<Navbar buttons={travelersJournalButtons}></Navbar>
			<div className={styles.pageContainer}>

			<div className={styles.addNew}>
				<label> Dodaj nowy wpis</label>
				<button className={styles.plusBtn} onClick={() => setIsPopupOpen(true)}>
					<AiOutlinePlus></AiOutlinePlus>
				</button>
			</div>

			<AddNote isOpen={isPopupOpen} closePopup={closePopup}>
				<div>
					<form onSubmit={handleAdd}>
						{inputs.map((input) =>
							input.id === "note" ? (
								<div key={input.id}>
									<textarea
										id={input.id}
										placeholder={input.placeholder}
										className={`${
											inputErrors[input.id] ? styles.errorInput : ""
										} ${
											input.id === "title"
												? styles.inputTitle
												: styles.inputNotes
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
							) : (
								<div key={input.id}>
									<input
										id={input.id}
										type={input.type}
										placeholder={input.placeholder}
										className={`${
											inputErrors[input.id] ? styles.errorInput : ""
										} ${
											input.id === "title"
												? styles.inputTitle
												: styles.inputNotes
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
							)
						)}
						<div className={styles.addBtnContainer}>
							<button className={styles.btn} type="submit">
								Dodaj
							</button>
						</div>
					</form>
				</div>
			</AddNote>

			<div
				className={`${styles.scroller} ${
					isPopupOpen ? styles.scrollerShrinked : ""
				}`}
			>
				{Array.isArray(notes) &&
					notes.map((note) => (
						<div key={note.id} className={styles.notes}>
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
									collectionPath={"journalNotes"}
									isEditing={editingNoteId === note.id}
									setIsEditing={(isEditing) => {
										handleEdit(note);
									}}
								/>
							)}
							 {editingNoteId === note.id ? (
            <div>
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
								<input
								type="textarea"
									  className={styles.reset}
                    value={editedNoteContent}
                    onChange={(e) => setEditedNoteContent(e.target.value)}
                />
                <button onClick={saveChanges}
								className={styles.btn}>Zapisz</button>
								</span>
            </div>
        ) : (
					<div>
							<h2 className={`${styles.noteTitle} ${styles.noteContent}`}>
								{note.title}
							</h2>
							<span>{note.date}</span>
							<p className={styles.noteContent}>{note.note}</p>
					</div>
				)}
						</div>
					))}
			</div>
		</div>
		</div>
	);
};

export default TravelersJournal;
